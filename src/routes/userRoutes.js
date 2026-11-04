const express = require("express");
const router = express.Router();

const activeMemberMiddleware = require("../middleware/activeMemberMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getMyApplication,
  getMyInvitations,
  withdrawApplication,
  getMyNotifications,
  markNotificationAsRead,
} = require("../controller/userController");
const {
  createMemberInvitation,
} = require("../controller/invitationController");

router.get("/application", authMiddleware, getMyApplication);
router.get("/notifications", authMiddleware, getMyNotifications);
router.get("/invitations", authMiddleware, getMyInvitations);
router.post(
  "/invitations",
  authMiddleware,
  activeMemberMiddleware,
  createMemberInvitation,
);
router.patch("/application/withdraw", authMiddleware, withdrawApplication);
router.patch("/notifications/:id/read", authMiddleware, markNotificationAsRead);

module.exports = router;
