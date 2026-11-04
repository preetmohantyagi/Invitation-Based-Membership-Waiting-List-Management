const {
  validateInvitation,
  createInvitation,
} = require("../controller/invitationController");
const { authMiddleware } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const express = require("express");

const router = express.Router();

// /api/invitations/validate
router.post("/validate", validateInvitation);
router.post("/create", authMiddleware, adminMiddleware, createInvitation);

module.exports = router;
