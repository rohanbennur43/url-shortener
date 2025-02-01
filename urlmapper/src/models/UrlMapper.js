const mongoose = require("mongoose");

const urlMapperSchema = new mongoose.Schema({
    longUrl: { type: String, required: true, unique: true },
    shortUrl: { type: String, required: true, unique: true },
});

const UrlMapperSchema = mongoose.model("UrlMapper", urlMapperSchema);
module.exports = UrlMapperSchema;
