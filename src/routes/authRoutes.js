const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controller/authController");

// /api/auth/register
router.post("/register", registerUser);

// /api/auth/login
router.post("/login", loginUser);

module.exports = router;
