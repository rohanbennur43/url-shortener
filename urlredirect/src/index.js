const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const cookieSession = require("cookie-session")
const urlRedirectRouter = require("./routes/urlredirect")

const app = express();

app.use(express.json());
app.use(cookieSession({
    name: 'session',
    keys:['jwt']
  }))
app.use(cors());
app.use(urlRedirectRouter)

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
    console.log(`Url redirect server running on port ${PORT}`);
});