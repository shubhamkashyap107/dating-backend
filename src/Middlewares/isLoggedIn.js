const jwt = require("jsonwebtoken")
const { User } = require("../Models/user")


const isLoggedIn = async(req, res, next) => {
   try{
    const{token} = req.cookies
    if(!token)
    {
        throw new Error("Please sign in")
    }
    const obj = jwt.verify(token, process.env.SECRET)
    const foundUser = await User.findOne({_id : obj._id})
    if(foundUser)
    {
        req.user = foundUser
        next()
    }
    else
    {
        throw new Error("Please sign in")
    }
   }
   catch(e)
   {
    res.json({"Error" : e.message})
   }
}

module.exports = {
    isLoggedIn
}