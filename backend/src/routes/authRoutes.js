const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} = require("../controller/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const authLimiter = require("../middleware/rateLimitMiddleware");

router.post("/register", authLimiter, registerUser);

router.post("/login", authLimiter, loginUser);

router.post("/logout", logoutUser);

router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
