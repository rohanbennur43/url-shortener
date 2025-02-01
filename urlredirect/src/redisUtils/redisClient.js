const Redis = require("ioredis");

// ✅ Use environment variable or default to local Redis
const redisClient = new Redis(process.env.REDIS_URL || "redis://redis-cluster-ip-svc:6379");

redisClient.on("connect", () => {
    console.log("Connected to Redis successfully!");
});

redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
});

module.exports = redisClient; // Export to use in other files
