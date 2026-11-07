const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const tokenBlacklistModel = require("../models/tokenBlacklistModel");

async function authMiddleware(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized Access, token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const isBlacklisted = await tokenBlacklistModel.findOne({
      jti: decoded.jti,
    });

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token has been revoked. Please login again.",
      });
    }
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }
}

module.exports = {
  authMiddleware,
};
