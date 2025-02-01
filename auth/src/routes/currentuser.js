const express = require("express");
const jwtHandler = require("../utils/jwtHandler");

const router = express.Router();

router.get("/api/users/currentuser", async (req, res) => {
    if (!req.session || !req.session.jwt) {
        return res.status(401).json({ status: "Failed", error: "Not authenticated" });
    }

    try {
        const userData = await jwtHandler.verifyToken(req.session.jwt);
        if (!userData) {
            return res.status(401).json({ Status: "Failed", error: "Invalid or expired token" });
        }

        return res.status(200).json({
            Status: "Success",
            Message: "Authenticated user",
            data:{user: userData}
        });

    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(500).json({ status: "Failed", error: "Server error" });
    }
});

module.exports = router;
