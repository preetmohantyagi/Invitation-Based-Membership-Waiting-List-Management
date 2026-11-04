const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controller/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const authLimiter = require("../middleware/rateLimitMiddleware");

// /api/auth/register
router.post("/register", authLimiter, registerUser);

// /api/auth/login
router.post("/login", authLimiter, loginUser);

// /api/auth/logout
router.post("/logout", logoutUser);

module.exports = router;
