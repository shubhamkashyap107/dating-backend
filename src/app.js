const express = require("express")
const{connectDB} = require("./Utils/db")
const cookieParser = require('cookie-parser')
const { authRouter } = require("./Routers/authRoutes")
const { profileRouter } = require("./Routers/profileRoutes")
const { connectionRouter } = require("./Routers/ConnectionRoutes")
const { userRouter } = require("./Routers/userRoutes")
const cors = require("cors")
const app = express()
require("dotenv").config()


app.use(cors(
    {
        origin : "http://localhost:5173",
        credentials : true
    }
))
app.use(express.json())
app.use(cookieParser())
app.use("/auth", authRouter)
app.use("/profile", profileRouter)
app.use("/connection", connectionRouter)
app.use("/user", userRouter)






connectDB(process.env.DB)
.then(() => {
    console.log("DB Connected")
    app.listen(process.env.PORT, () => {
        console.log("Server connected")
    })
})
.catch(() => {
    console.log("DB Connection failed")
})










