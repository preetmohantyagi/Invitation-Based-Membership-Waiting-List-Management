const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    invitation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invitation",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: [
          "PENDING",
          "UNDER_REVIEW",
          "APPROVED",
          "REJECTED",
          "WITHDRAWN",
        ],
        message:
          "Status can be either PENDING, UNDER_REVIEW, APPROVED, REJECTED, or WITHDRAWN",
      },
      default: "PENDING",
    },
    priority: {
      type: String,
      enum: {
        values: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
        message: "Priority can be either CRITICAL, HIGH, MEDIUM or LOW",
      },
      default: "MEDIUM",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Application", applicationSchema);
