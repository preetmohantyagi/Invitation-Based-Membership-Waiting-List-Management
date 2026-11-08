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
  updateApplicationNotes,
  getAuditLogs,
  getDashboardStats,
  getActiveMembers,
  updateMemberQuota,
  updateMemberStatus
} = require("../controller/adminController");

const {
  getAllInvitations,
  getInvitationRedemptions,
  revokeInvitation,
  createInvitation,
} = require("../controller/invitationController");

router.use(authMiddleware, adminMiddleware);

router.get("/", getAllApplications);
router.get("/stats", getDashboardStats);
router.get("/audit-logs", getAuditLogs);

router.get("/applications/:id", getApplicationDetails);
router.patch("/applications/:id/priority", updateApplicationPriority);
router.patch("/applications/:id/review", markUnderReview);
router.patch("/applications/:id/approve", approveApplication);
router.patch("/applications/:id/reject", rejectApplication);
router.patch("/applications/:id/notes", updateApplicationNotes);

router.get("/members", getActiveMembers);
router.patch("/members/:memberId/quota", updateMemberQuota);
router.patch("/members/:memberId/status", updateMemberStatus);

router.get("/invitations", getAllInvitations);
router.post("/invitations", createInvitation);
router.get("/invitations/:id/redemptions", getInvitationRedemptions);
router.patch("/invitations/:id/revoke", revokeInvitation);

module.exports = router;
