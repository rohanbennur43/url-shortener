const express = require("express");
const  {body,validationResult} = require("express-validator")
const User = require("../models/User")
const bcrypt = require("bcryptjs");
const jwtHandler = require("../utils/jwtHandler")
const router = express.Router();

router.post("/api/users/signup",[body("email").isEmail().withMessage("Enter valid email"),body("password").trim().isLength({min:6,max:15}).withMessage("Password should be between 6 and 15 characters").matches(/\d/) // Check if it contains at least one digit
    .withMessage('Password must contain at least one digit')
    .matches(/[!@#$%^&*(),.?":{}|<>]/) // Check if it contains at least one special character
    .withMessage('Password must contain at least one special character')], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;
    console.log("Received a signup request here",email,password)
    
    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        let jwtToken = jwtHandler.createToken(newUser)
        console.log("Token created successfully")
        req.session={
            jwt:jwtToken
        }
        return res.status(201).json({status:"Success",data:newUser});
    } catch (error) {
        console.error("Error signing up:", error);
        return res.status(500).json({status:"Failed",error:"Internal Server Error"});
    }
});

module.exports = router;
