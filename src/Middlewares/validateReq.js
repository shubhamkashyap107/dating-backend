const validateReq = (req, res, next) => {
    try{
        if(!req.body.username)
            {
                throw new Error("Please Enter a valid username")
            }
            else if(!req.body.emailId)
            {
                throw new Error("Please Enter a valid Email")
            }
            else if(!req.body.password)
            {
                throw new Error("Please Enter a valid password")
            }
            else
            {
                next()
            }
    }
    catch(error)
    {
        res.send(error.message)
    }
} 

module.exports = {validateReq}