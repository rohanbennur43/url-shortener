const express = require("express");
const UrlMapper = require("../models/UrlMapper");
const redisClient = require("../redisUtils/redisClient");


const router = express.Router();

const BASE_URL = process.env.BASE_URL || "https://shorturl.dev";

router.get("/r/:shortCode",async (req,res)=>{
    const { shortCode } = req.params;
    console.log("Short code is",shortCode)
    if (!shortCode) {
        return res.status(400).json({ status: "Fail", error: "Short code is required" });
    }

    try {
        console.log("Looking up short code:", shortCode);

        const longUrlFromCache = await redisClient.get(shortCode);
        if (longUrlFromCache) {
            console.log("Found in Redis:", shortCode, "->", longUrlFromCache);
            let longUrl = longUrlFromCache;
            if (!/^https?:\/\//i.test(longUrl)) {
                longUrl = "https://" + longUrl;
            }        
            return res.redirect(301, longUrl); // 301 Moved Permanently
        }

        console.log("Not found in Redis. Checking MongoDB...");

        const urlData = await UrlMapper.findOne({ shortUrl: shortCode });
        if (!urlData) {
            console.log("Short code not found:", shortCode);
            return res.status(404).json({ status: "Fail", error: "Short URL not found" });
        }

        console.log("Found in MongoDB:", urlData);

        await redisClient.set(shortCode, urlData.longUrl, "EX", 86400); // Cache for 1 day
        await redisClient.set(urlData.longUrl,shortCode, "EX", 86400);
        let longUrl = longUrlFromCache;
        if (!/^https?:\/\//i.test(longUrl)) {
            longUrl = "https://" + longUrl;
        }
    
        return res.redirect(301, longUrl); // 301 Moved Permanently

    } catch (error) {
        console.error("Error while redirecting:", error);
        return res.status(500).json({ status: "Fail", error: "Internal Server Error" });
    }
})

module.exports = router