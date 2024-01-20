const jwt = require("jsonwebtoken");

async function generateToken(userId) {
  try {
    const token = await jwt.sign({ userId }, process.env.SECRET_KEY,{ expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
}

module.exports = generateToken;
