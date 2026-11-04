const express = require("express");
const router = express.Router();

const activeMemberMiddleware = require("../middleware/activeMemberMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getMyApplication,getMyInvitations } = require("../controller/userController");
const {createMemberInvitation}= require("../controller/invitationController")

router.get("/application", authMiddleware, getMyApplication);
router.get("/invitations", authMiddleware, getMyInvitations);
router.post(
  "/invitations",
  authMiddleware,
  activeMemberMiddleware,
  createMemberInvitation,
);

module.exports = router;
