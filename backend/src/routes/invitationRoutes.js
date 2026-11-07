const express = require("express");
const router = express.Router();

const {
  validateInvitation,
  createInvitation,
  createMemberInvitation,
} = require("../controller/invitationController");

const { authMiddleware } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const activeMemberMiddleware = require("../middleware/activeMemberMiddleware");

// public: used by the registration page to check a code
router.post("/validate", validateInvitation);

// active members only (uses the member's invitation quota)
router.post(
  "/member",
  authMiddleware,
  activeMemberMiddleware,
  createMemberInvitation,
);

// admin only (no member quota)
router.post("/", authMiddleware, adminMiddleware, createInvitation);

module.exports = router;
