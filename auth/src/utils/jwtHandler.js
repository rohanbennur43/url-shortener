const jwt = require("jsonwebtoken");

class JsonWebToken {
  static createToken(user, expireTime) {
    if(!expireTime){
        expireTime = 3600*24 //keep it for one day
    }
    const payload = { email: user.email, id: user.id };
    const privateKey = process.env.JWT_KEY;
    if (!privateKey) {
      throw new Error("JWT_KEY is not defined in environment variables!");
    }

    return jwt.sign(payload, privateKey, { expiresIn: expireTime });
  }

  static async verifyToken(jwtToken) {
    const privateKey = process.env.JWT_KEY;

    if (!privateKey) {
      throw new Error("JWT_KEY is not defined in environment variables!");
    }

    try {
      const payload = jwt.verify(jwtToken, privateKey);
      return payload;
    } catch (error) {
      console.error("Invalid JWT:", error.message);
      return null;
    }
  }
}

module.exports = JsonWebToken;
