const express = require("express")
const { isLoggedIn } = require("../Middlewares/isLoggedIn")
const { ConnectionRequestModel } = require("../Models/connectionRequest")
const { User } = require("../Models/user")
const router = express.Router()

router.get("/requests/received", isLoggedIn , async(req, res) => {
   try{
    const loggedInUser = req.user

    const requests = await ConnectionRequestModel.find({
        toUserId : loggedInUser._id,
        status : "interested"
    }).populate("fromUserId", ["firstName", "lastName", "DOB", "username", "bio", "image"])

    
    res.json(requests)
   }
   catch(error)
   {
    res.json({"msg" : error.message})
   }
})

router.get("/connections", isLoggedIn , async(req, res) => {
    const loggedInUser = req.user
    const allRequests = await ConnectionRequestModel.find({
        $or : [
            { status : "accepted" , fromUserId : loggedInUser._id },
            { status : "accepted" , toUserId : loggedInUser._id }
        ]
    }).populate("fromUserId", ["firstName", "lastName", "username", "dateOfBirth"])
    .populate("toUserId", ["firstName", "lastName", "username", "dateOfBirth"])

    const data = allRequests.map((item) => {
        if(item.fromUserId._id.equals(loggedInUser._id))
        {
            return item.toUserId
        }
        return item.fromUserId
    })

    res.json(data)
})

router.get("/feed", isLoggedIn , async(req, res) => {
    try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const loggedInUser = req.user
    //show users except self and those who have sent req to me or those who i have sent the req to
    const allRequests = await ConnectionRequestModel.find({
        $or : [
            { toUserId : loggedInUser._id },
            { fromUserId : loggedInUser._id },
        ]
    })

    const usersToBeHidden = new Set()

    allRequests.forEach((item) => {
        usersToBeHidden.add(item.fromUserId.toString())
        usersToBeHidden.add(item.toUserId.toString())
    })
    // console.log(usersToBeHidden)


    const toBeShownUsers = await User.find({
        $and : [
            { _id : {$nin :  Array.from(usersToBeHidden)} },
            { _id : {$ne : loggedInUser._id} },
        ]
    }).select(" firstName lastName username dateOfBirth image bio DOB").skip((page - 1) * 10).limit(limit).exists("firstName")

    res.json(toBeShownUsers)
    } catch (error) {
        res.json({"msg" : error.message})
    }
})

module.exports = {
    userRouter : router
}