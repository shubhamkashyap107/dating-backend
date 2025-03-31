const express = require("express")
const bcrypt = require("bcrypt")
const validator = require("validator")
const { User } = require("../Models/user")
const { validateReq } = require("../Middlewares/validateReq")
const jwt = require("jsonwebtoken")
const { isLoggedIn } = require("../Middlewares/isLoggedIn")
const router = express.Router()


router.post("/signup", validateReq ,async(req, res) => {
    try{
        const{username, emailId, password} = req.body
        const flag = validator.isStrongPassword(password)
        if(!flag)
        {
            throw new Error("Please enter a strong password")
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        let createdUser = await User.insertOne({username, emailId, password : hashedPassword})
        const token = createdUser.getJWT()
        res.cookie("token", token)
        const{firstName, lastName, dateOfBirth, bio, image} = createdUser
        res.status(200).json({msg : "User signed up", data : {firstName, lastName, dateOfBirth, bio, image, username}})
    }
    catch(error)
    {
        res.status(409).json({error : "User already exists"})
    }
})

router.post("/login", async(req, res) => {

    try {
        const{username, password} = req.body
        const foundUser = await User.findOne({username})
        console.log(foundUser)
        if(!foundUser)
        {
            throw new Error("Invalid Credentials")
        }
        const flag = await foundUser.validatePassword(password)
        if(!flag)
        {
            throw new Error("Incorrect Password")
        }
        
        const token = foundUser.getJWT()
        res.cookie("token", token)
        const{firstName, lastName, DOB, bio, image} = foundUser
        res.status(200).json({"msg" : "User logged in successfully", "data" : {firstName, lastName, DOB, bio, image, username}})
    } catch (error) {
        res.status(401).json({error : error.message})
    }
   
})



router.get("/logout", isLoggedIn ,(req, res) => {
    try {
        res.cookie("token", null).json({"msg" : "User logged out"})

    } catch (error) {
        res.json({"error" : error.message})
    }
})













module.exports = {authRouter : router}