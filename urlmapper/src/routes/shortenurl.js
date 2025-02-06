const express = require("express");
const UrlMapper = require("../models/UrlMapper");
const redisClient = require("../redisUtils/redisClient");
const { nanoid } = require("nanoid");
const router = express.Router();

const BASE_URL = process.env.BASE_URL || "https://short-url.info"; // Change to your domain

router.post("/api/mapper/shortenurl", async (req, res) => {
    console.log("Received request to shorten URL");

    const { longUrl } = req.body;
    if (!longUrl) {
        return res.status(400).json({ status: "Fail", error: "The longUrl cannot be empty" });
    }

    try {
        const shortCodeFromCache = await redisClient.get(longUrl);
        if (shortCodeFromCache) {
            const fullShortUrl = `${BASE_URL}/r/${shortCodeFromCache}`;
            console.log("Found in Redis:", longUrl, "->", fullShortUrl);
            return res.status(200).json({
                status: "Success",
                message: "URL mapping retrieved from Redis",
                data: { shortUrl: fullShortUrl, longUrl }
            });
        }

        console.log("Not found in Redis. Checking MongoDB...");

        const urlData = await UrlMapper.findOne({ longUrl });
        if (urlData) {
            const fullShortUrl = `${BASE_URL}/r/${urlData.shortUrl}`;
            console.log("Found in MongoDB:", urlData);

            await redisClient.set(longUrl, urlData.shortUrl, "EX", 86400); // Cache longUrl → shortCode
            await redisClient.set(urlData.shortUrl, longUrl, "EX", 86400); // Cache shortCode → longUrl

            return res.status(200).json({
                status: "Success",
                message: "URL mapping retrieved from MongoDB",
                data: { shortUrl: fullShortUrl, longUrl }
            });
        }

        console.log("Not found in MongoDB. Creating new short URL...");

        const shortCode = nanoid(7); // Generates a 7-character unique ID
        const fullShortUrl = `${BASE_URL}/r/${shortCode}`;

        const newUrlMapping = new UrlMapper({ longUrl, shortUrl: shortCode });
        await newUrlMapping.save();

        console.log("Created new short URL mapping:", longUrl, fullShortUrl);

        await redisClient.set(longUrl, shortCode, "EX", 86400); // Cache longUrl → shortCode
        await redisClient.set(shortCode, longUrl, "EX", 86400); // Cache shortCode → longUrl

        return res.status(201).json({
            status: "Success",
            message: "Successfully mapped longUrl to shortUrl",
            data: { shortUrl: fullShortUrl, longUrl }
        });

    } catch (error) {
        console.error("Error while mapping longUrl to shortUrl:", error);
        return res.status(500).json({ status: "Fail", error: "Internal Server Error" });
    }
});

module.exports = router;
