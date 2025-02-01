const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const shortenUrlRouter = require("./routes/shortenurl")
const redisClient = require("./redisUtils/redisClient")
const getshortUrlRouter = require("./routes/getshorturl")
const app = express();

app.use(express.json());
app.use(cors());
app.use(shortenUrlRouter);
app.use(getshortUrlRouter)


const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://auth-mongodb-cluster-ip-svc:27017/database", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1); // Exit process with failure
    }
};

connectDB()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
