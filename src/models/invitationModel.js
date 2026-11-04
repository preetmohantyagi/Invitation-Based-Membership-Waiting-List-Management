const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Code is required"],
      unique: [true, "Code should be unique"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    maxUses: {
      type: Number,
      default: 1,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "EXHAUSTED", "EXPIRED", "REVOKED"],
        message: "Status can be either ACTIVE, EXHAUSTED, EXPIRED or REVOKED",
      },
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Invitation", invitationSchema);
