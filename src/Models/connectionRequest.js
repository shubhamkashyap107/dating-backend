const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        trim : true,
        ref : "User"
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        trim : true,
        ref : "User"
    },
    status : {
        type : String,
        enum : {
            values : ["accepted", "rejected", "ignore", "interested"],
            message : `{VALUE} is not a valid status type` 
        }
    }
}, {timestamps : true})

connectionRequestSchema.pre("save", function(next){
    const instance = this

    if(instance.fromUserId.equals(instance.toUserId))
    {
        throw new Error("Cannot send request to yourself!!")
    }
    next()
    
})

const ConnectionRequestModel = mongoose.model("connnectionrequest", connectionRequestSchema)


module.exports = {
    ConnectionRequestModel
}