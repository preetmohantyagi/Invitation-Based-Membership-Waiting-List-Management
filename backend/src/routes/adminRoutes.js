const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllApplications,
  updateApplicationPriority,
  approveApplication,
  rejectApplication,
  markUnderReview,
  getApplicationDetails,
  getAuditLogs,
  getDashboardStats,
} = require("../controller/adminController");

const {
  getAllInvitations,
  revokeInvitation,
  createMemberInvitation,
} = require("../controller/invitationController");

router.get("/", authMiddleware, adminMiddleware, getAllApplications);
router.get("/stats", authMiddleware, adminMiddleware, getDashboardStats);

router.get("/audit-logs", authMiddleware, adminMiddleware, getAuditLogs);

router.get(
  "/applications/:id",
  authMiddleware,
  adminMiddleware,
  getApplicationDetails,
);

router.get("/invitations", authMiddleware, adminMiddleware, getAllInvitations);

router.patch(
  "/applications/:id/priority",
  authMiddleware,
  adminMiddleware,
  updateApplicationPriority,
);

router.patch(
  "/applications/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveApplication,
);

router.patch(
  "/applications/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectApplication,
);

router.patch(
  "/applications/:id/review",
  authMiddleware,
  adminMiddleware,
  markUnderReview,
);

router.patch(
  "/invitations/:id/revoke",
  authMiddleware,
  adminMiddleware,
  revokeInvitation,
);
module.exports = router;
