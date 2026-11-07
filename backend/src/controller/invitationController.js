const invitationModel = require("../models/invitationModel");
const userModel = require("../models/userModel");
const applicationModel = require("../models/applicationModel");
const generateInviteCode = require("../utils/generateInviteCode");
const auditLogModel = require("../models/auditLogModel");
const mongoose = require("mongoose");

// Validates maxUses and expiresAt coming from the request body.
// Returns { error } or { maxUses, expiresAt }
function parseInvitationInput(body) {
  const { maxUses = 1, expiresAt } = body;

  if (!Number.isInteger(maxUses) || maxUses < 1) {
    return { error: "maxUses must be a positive integer" };
  }

  let expiryDate = null;
  if (expiresAt) {
    expiryDate = new Date(expiresAt);
    if (Number.isNaN(expiryDate.getTime())) {
      return { error: "expiresAt must be a valid date" };
    }
    if (expiryDate <= new Date()) {
      return { error: "expiresAt must be a future date" };
    }
  }

  return { maxUses, expiresAt: expiryDate };
}

async function validateInvitation(req, res) {
  const { code } = req.body;
  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({
      message: "Invitation code is required",
    });
  }
  const invitationCode = code.trim().toUpperCase();

  const invitation = await invitationModel.findOne({ code: invitationCode });
  if (!invitation) {
    return res.status(404).json({
      message: "Invalid invitation code",
    });
  }
  if (invitation.status === "REVOKED") {
    return res.status(400).json({
      message: "Invitation has been revoked",
    });
  }
  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    return res.status(400).json({
      message: "Invitation Expired",
    });
  }
  if (invitation.status === "EXHAUSTED" || invitation.usedCount >= invitation.maxUses) {
    return res.status(400).json({
      message: "Invitation Exhausted",
    });
  }
  if (invitation.status !== "ACTIVE") {
    return res.status(400).json({
      message: "Invitation is not active",
    });
  }
  return res.status(200).json({
    message: "Invitation is Valid",
  });
}

// Admin creates an invitation (no member quota involved)
async function createInvitation(req, res) {
  const input = parseInvitationInput(req.body);
  if (input.error) {
    return res.status(400).json({ message: input.error });
  }

  const session = await mongoose.startSession();

  try {
    let invitation;

    await session.withTransaction(async () => {
      invitation = new invitationModel({
        code: generateInviteCode(),
        maxUses: input.maxUses,
        expiresAt: input.expiresAt,
        createdBy: req.user._id,
      });
      await invitation.save({ session });

      await auditLogModel.create(
        [
          {
            performedBy: req.user._id,
            action: "INVITATION_CREATED",
            targetId: invitation._id,
            details: `Invitation ${invitation.code} created with maximum ${invitation.maxUses} uses`,
          },
        ],
        { session },
      );
    });

    return res.status(201).json({
      message: "Invitation created successfully",
      code: invitation.code,
    });
  } catch (error) {
    console.error("Create invitation error:", error);
    return res.status(500).json({
      message: "Unable to create invitation",
    });
  } finally {
    await session.endSession();
  }
}

async function getAllInvitations(req, res) {
  const invitations = await invitationModel
    .find()
    .populate("createdBy", "fullName email role")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    count: invitations.length,
    invitations,
  });
}

// Who redeemed this invitation (redemption history)
async function getInvitationRedemptions(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid invitation id" });
  }

  const invitation = await invitationModel.findById(req.params.id);
  if (!invitation) {
    return res.status(404).json({
      message: "Invitation Not Found",
    });
  }

  const applications = await applicationModel
    .find({ invitation: invitation._id })
    .populate("user", "fullName email")
    .sort({ createdAt: -1 });

  const redemptions = applications.map((application) => ({
    applicationId: application._id,
    fullName: application.user?.fullName,
    email: application.user?.email,
    applicationStatus: application.status,
    redeemedAt: application.createdAt,
  }));

  return res.status(200).json({
    count: redemptions.length,
    redemptions,
  });
}

async function revokeInvitation(req, res) {
  const invitationId = req.params.id;

  if (!mongoose.isValidObjectId(invitationId)) {
    return res.status(400).json({ message: "Invalid invitation id" });
  }

  const invitation = await invitationModel.findById(invitationId);

  if (!invitation) {
    return res.status(404).json({
      message: "Invitation Not Found",
    });
  }
  if (invitation.status === "REVOKED") {
    return res.status(400).json({
      message: "Invitation is already revoked",
    });
  }
  invitation.status = "REVOKED";

  await invitation.save();

  await auditLogModel.create({
    performedBy: req.user._id,
    action: "INVITATION_REVOKED",
    targetId: invitation._id,
    details: `Invitation ${invitation.code} was revoked`,
  });

  return res.status(200).json({
    message: "Invitation Revoked Successfully",
    invitation,
  });
}

// Member creates an invitation. Uses the member's individual quota.
// (invitation.maxUses and user.invitationQuota are different things)
async function createMemberInvitation(req, res) {
  const input = parseInvitationInput(req.body);
  if (input.error) {
    return res.status(400).json({ message: input.error });
  }

  const session = await mongoose.startSession();

  try {
    let invitation;
    let updatedUser;

    await session.withTransaction(async () => {
      updatedUser = await userModel.findOneAndUpdate(
        {
          _id: req.user._id,
          role: "USER",
          accountStatus: "ACTIVE",
          $expr: {
            $lt: ["$invitationsCreated", "$invitationQuota"],
          },
        },
        {
          $inc: { invitationsCreated: 1 },
        },
        {
          new: true,
          session,
        },
      );

      if (!updatedUser) {
        const error = new Error("INVITATION_QUOTA_EXHAUSTED");
        throw error;
      }

      invitation = new invitationModel({
        code: generateInviteCode(),
        maxUses: input.maxUses,
        expiresAt: input.expiresAt,
        createdBy: req.user._id,
      });

      await invitation.save({ session });

      const auditLog = new auditLogModel({
        performedBy: req.user._id,
        action: "INVITATION_CREATED",
        targetId: invitation._id,
        details: `Member created invitation ${invitation.code}`,
      });

      await auditLog.save({ session });
    });

    return res.status(201).json({
      message: "Invitation created successfully",
      code: invitation.code,
      quota: {
        total: updatedUser.invitationQuota,
        used: updatedUser.invitationsCreated,
        remaining: updatedUser.invitationQuota - updatedUser.invitationsCreated,
      },
    });
  } catch (error) {
    if (error.message === "INVITATION_QUOTA_EXHAUSTED") {
      return res.status(403).json({
        message: "Invitation quota exhausted or membership inactive",
      });
    }

    console.error("Member invitation error:", error);

    return res.status(500).json({
      message: "Unable to create invitation",
    });
  } finally {
    await session.endSession();
  }
}
module.exports = {
  validateInvitation,
  createInvitation,
  getAllInvitations,
  getInvitationRedemptions,
  revokeInvitation,
  createMemberInvitation,
};
