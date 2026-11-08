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

router.post("/validate", validateInvitation);

router.post(
  "/member",
  authMiddleware,
  activeMemberMiddleware,
  createMemberInvitation,
);

router.post("/", authMiddleware, adminMiddleware, createInvitation);

module.exports = router;
