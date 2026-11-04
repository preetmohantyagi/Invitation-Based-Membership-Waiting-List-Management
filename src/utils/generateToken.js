const jwt = require("jsonwebtoken");
const crypto = require("crypto");

function generateToken(userId) {
  const token = jwt.sign(
    { userId, jti: crypto.randomUUID() },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );
  return token;
}



module.exports = generateToken;
