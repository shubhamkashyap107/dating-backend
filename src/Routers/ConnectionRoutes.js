const express = require("express")
const { isLoggedIn } = require("../Middlewares/isLoggedIn")
const { User } = require("../Models/user")
const { ConnectionRequestModel } = require("../Models/connectionRequest")
const router = express.Router()


router.post("/send/:status/:id", isLoggedIn, async(req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.id
        const status = req.params.status

        const allowedStatus = ["interested", "ignore"]
        if(!allowedStatus.includes(status))
        {
            throw new Error("Invalid request status")
        }

        const existingRequest = await ConnectionRequestModel.findOne({
            $or : [
                {fromUserId, toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ]
        })

        if(existingRequest)
        {
            throw new Error("Request already exists")
        }
 
        const foundUser = await User.find({_id : toUserId})
        if(!foundUser)
        {
            throw new Error("User does not exist")
        }

        const newRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })

        await newRequest.save()

        res.status(201).json({"msg" : "Request sent!"})
    } catch (error) {
        res.json({"msg" : error.message})
    }
})


router.post("/review/:status/:reqId", isLoggedIn, async(req, res) => {
   try {
    const requestId = req.params.reqId
    const toUserId = req.user._id
    const{status} = req.params

    const allowedStatus = ["accepted", "rejected"]
    if(!allowedStatus.includes(status))
    {
        throw new Error("Not a valid status: " + status)
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
        _id : requestId,
        toUserId,
        status : "interested" 
    })

    if(!connectionRequest)
    {
        throw new Error("Connection Request not found")
    }

    connectionRequest.status = status
    await connectionRequest.save()
    res.json({"msg" : "Done"})
   } catch (error) {
    res.json({"error" : error.message})
   }
})



module.exports = {
    connectionRouter : router
}