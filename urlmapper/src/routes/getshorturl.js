const express = require("express");
const UrlMapper = require("../models/UrlMapper");
const redisClient = require("../redisUtils/redisClient");
const router = express.Router();

router.get("/api/mapper/:code", async (req, res) => {
    const { code } = req.params;

    if (!code) {
        return res.status(400).json({ status: "Fail", error: "Short code is required" });
    }

    try {
        console.log("Looking up short code:", code);

        const longUrlFromCache = await redisClient.get(code);
        if (longUrlFromCache) {
            console.log("Found in Redis:", code, "->", longUrlFromCache);
            return res.status(200).json({
                status: "Success",
                message: "URL details retrieved from Redis",
                data: { shortCode: code, longUrl: longUrlFromCache, source: "cache" }
            });
        }

        console.log("Not found in Redis. Checking MongoDB...");

        const urlData = await UrlMapper.findOne({ shortUrl: code });
        if (!urlData) {
            console.log("Short code not found:", code);
            return res.status(404).json({ status: "Fail", error: "Short URL not found" });
        }

        console.log("Found in MongoDB:", urlData);

        await redisClient.set(code, urlData.longUrl, "EX", 86400); // Cache for 1 day

        return res.status(200).json({
            status: "Success",
            message: "URL details retrieved from MongoDB",
            data: { shortCode: code, longUrl: urlData.longUrl, createdAt: urlData.createdAt, source: "database" }
        });

    } catch (error) {
        console.error("Error while retrieving URL details:", error);
        return res.status(500).json({ status: "Fail", error: "Internal Server Error" });
    }
});

module.exports = router;
