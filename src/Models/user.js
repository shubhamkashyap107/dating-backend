const mongoose = require("mongoose")
const validator = require('validator');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        // required : true,
        trim : true,
        minLength : 2,
        maxLength : 15
    },
    lastName : {
        type : String,
        // required : true,
        trim : true,
        minLength : 2,
        maxLength : 15
    },
    emailId : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        minLength : 10,
        validate(val)
        {
            const flag = validator.isEmail(val)

            if(!flag)
            {
                throw new Error("Not a valid email")
            }
        }
    },
    username : {
        type : String,
        required : true,
        trim : true,
        minLength : 2,
        maxLength : 15,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        trim : true,
    },
    DOB : {
        type : String,
        // required : true,
        trim : true,
        validate(val)
        {
            const flag = validator.isDate(val)
            if(!flag)
            {
                throw new Error("Please enter a valid Date")
            }
        }
    },
    bio : {
        type : String,
        trim : true,
        minLength : 20,
        maxLength : 50
    },
    image : {
        type : String,
    },
}, {timestamps : true})


userSchema.methods.getJWT = function()
{
    const foundUser = this;
    const token = jwt.sign({_id : foundUser._id}, process.env.SECRET, {
        expiresIn : "7d"
    });
    return token;
}


userSchema.methods.validatePassword = async function(val)
{
    const foundUser = this;
    const flag = await bcrypt.compare(val, foundUser.password)
    return flag
}

const User = mongoose.model("User", userSchema)


module.exports = { User }