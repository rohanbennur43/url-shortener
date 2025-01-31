const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwtHandler = require("../utils/jwtHandler");

const router = express.Router();

router.post(
    "/api/users/signin",
    [
        body("email").isEmail().withMessage("Enter a valid email"),
        body("password")
            .trim()
            .isLength({ min: 6, max: 15 }).withMessage("Password should be between 6 and 15 characters")
            .matches(/\d/).withMessage("Password must contain at least one digit")
            .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character")
    ],
    async (req, res) => {
        // ✅ Step 1: Validate Request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        console.log("Received a sign-in request:", email);

        try {
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                console.log("User does not exist:", email);
                return res.status(404).json({ status: "Failed", error: "Invalid credentials" });
            }
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                console.log("Invalid password attempt:", email);
                return res.status(401).json({ status: "Failed", error: "Invalid credentials" });
            }

            const jwtToken = jwtHandler.createToken(
                { id: existingUser.id, email: existingUser.email },
                "1d"
            );
            console.log("Token created successfully:", jwtToken);

            req.session = { jwt: jwtToken };

            return res.status(200).json({
                status: "Success",
                message: "User signed in successfully",
                token: jwtToken, // Also return token for API usage
                user: {
                    id: existingUser.id,
                    email: existingUser.email
                }
            });

        } catch (error) {
            console.error("Error signing in:", error);
            return res.status(500).json({ status: "Failed", error: "Server error" });
        }
    }
);

module.exports = router;
