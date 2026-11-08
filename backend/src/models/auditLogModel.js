const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: {
        values: [
          "INVITATION_CREATED",
          "INVITATION_REDEEMED",
          "INVITATION_REVOKED",
          "APPLICATION_PRIORITY_CHANGED",
          "APPLICATION_APPROVED",
          "APPLICATION_REJECTED",
          "APPLICATION_UNDER_REVIEW",
          "APPLICATION_WITHDRAWN",
          "APPLICATION_NOTES_UPDATED",
          "MEMBER_QUOTA_UPDATED",
        ],
      },
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
