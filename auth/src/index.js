require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const signUpRouter = require("./routes/signup");
const signInRouter  = require("./routes/signin");
const currentUserRouter = require("./routes/currentuser")
const signOutRouter = require("./routes/signout")
const cookieSession = require("cookie-session")
const app = express();
app.use(express.json());
app.use(cookieSession({
    name: 'session',
    keys:['jwt']
  }))

  app.use(cors({
    origin: "https://shorturl.dev", // 🔥 MUST specify domain, cannot use "*"
    credentials: true, // ✅ Allows authentication cookies
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));
  
app.use(signUpRouter);
app.use(signInRouter);
app.use(currentUserRouter);
app.use(signOutRouter);


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
