const User = require("../model/User")
const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


// LOGIN
router.post("/login", async (req,res)=>{
    try{
        const { name,password } = req.body

        const validUser = await User.findOne({name})

        if(!validUser){
            return res.status(400).json({
                message:"User not found"
            })
        }

        const isMatch = await bcrypt.compare(password,validUser.password)

        if(!isMatch){
            return res.status(400).json({
                message: "Incorrect Username or Password"
            })
        }

        const token=jwt.sign(
            {id:validUser._id},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )


        res.status(200).json({
            success:true,
            token,
            message: "Login Successful"
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})

// SIGNUP

router.post("/signup", async (req,res)=>{
    try{
        const {name,password} = req.body

        const userExist = await User.findOne({name})

        if(userExist){
            return res.status(400).json({
                message:"User already Exists"
            })
        }

        const saltedRounds = 10

        const hashedPassword= await bcrypt.hash(password,saltedRounds);

        const newUser = new User({
            name,
            password:hashedPassword
        })

        await newUser.save()

        res.status(201).json({
            message:"Signup Successful"
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})

module.exports = router