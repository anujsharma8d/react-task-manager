const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const authRoutes = require("./authRoutes")
dotenv.config();

const app = express()
const port = process.env.PORT || 5000
const db = process.env.MONGO_URI

app.use(express.json())
app.use(cors());

app.use("/api/auth", authRoutes)

app.listen(port,()=>console.log(`server is running at port ${port}`))

mongoose.connect(db)
.then(()=>{
    console.log("MongoDB Connected")
})
.catch((err)=>console.log(err))