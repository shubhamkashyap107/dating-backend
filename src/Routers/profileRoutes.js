const express = require("express")
const router = express.Router()
const { isLoggedIn } = require("../Middlewares/isLoggedIn")
const { User } = require("../Models/user")
const bcrypt = require("bcrypt")
const validator = require("validator")

router.get("/", isLoggedIn ,(req, res) => {
    try {
        const user = req.user
        res.json(user)
    } catch (error) {
        res.json({"error" : error.message})
    }
})


router.patch("/edit", isLoggedIn , async(req, res) => {
    try {
        const userId = req.user._id
        const {firstName, lastName, username, DOB, bio, image} = req.body
        const updatedUser = await User.findByIdAndUpdate(userId, {firstName, lastName, username, DOB, bio, image}, {runValidators : true, new : true})
        const{firstName : firstNameNew, lastName : lastNameNew, username : usernameNew, DOB : DOBnew, bio : bioNew, image : imageNew} = updatedUser
        res.status(201).json({"msg" : "User updated successfully", "data" : {
            firstName : firstNameNew,
            lastName : lastNameNew,
            username : usernameNew,
            DOB : DOBnew,
            bio : bioNew,
            image : imageNew
        }})
    } catch (error) {
        res.json({"error" : error.message})
    }
})

router.patch("/edit/password" , isLoggedIn, async(req, res) => {
    try {
        const userId = req.user._id
        const hashedPassword = req.user.password
        const {existingPasswordEnteredByUser, newPasswordEnteredByUser} = req.body
        const flag = await bcrypt.compare(existingPasswordEnteredByUser, hashedPassword)

        if(!flag)
        {
            throw new Error("Incorrect Password")
        }
        const isStrongPassword = validator.isStrongPassword(newPasswordEnteredByUser)
        const newPasswordHashed = await bcrypt.hash(newPasswordEnteredByUser, 10)
        if(isStrongPassword)
        {
            await User.findByIdAndUpdate(userId, {password : newPasswordHashed})
            res.json({"msg" : "Password updated successfully"})
        }
        else
        {
            throw new Error("Please enter a strong password")
        }
    } catch (error) {
        res.json({"error" : error.message})
    }
})










module.exports = {
    profileRouter : router
}