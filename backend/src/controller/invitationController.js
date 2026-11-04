const invitationModel = require("../models/invitationModel");
const userModel = require("../models/userModel");
const generateInviteCode = require("../utils/generateInviteCode");
const auditLogModel = require("../models/auditLogModel");

async function validateInvitation(req, res) {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({
      message: "Invitation code is required",
    });
  }
  const invitationCode = code.trim().toUpperCase();

  const c1 = await invitationModel.findOne({ code: invitationCode });
  if (!c1) {
    return res.status(404).json({
      message: "Not Found",
    });
  }
  if (c1.status !== "ACTIVE") {
    return res.status(404).json({
      message: "Not Found",
    });
  }
  if (c1.expiresAt && c1.expiresAt < new Date()) {
    return res.status(400).json({
      message: "Invitation Expired",
    });
  }
  if (c1.usedCount >= c1.maxUses) {
    return res.status(400).json({
      message: "Invitation Exhausted",
    });
  }
  return res.status(200).json({
    message: "Invitation is Valid",
  });
}

async function createInvitation(req, res) {
  const invitationCode = generateInviteCode();
  const { expiresAt, maxUses } = req.body;
  const invitation = await invitationModel.create({
    code: invitationCode,
    maxUses,
    expiresAt,
    createdBy: req.user._id,
  });
  await auditLogModel.create({
    performedBy: req.user._id,
    action: "INVITATION_CREATED",
    targetId: invitation._id,
    details: `Invitation ${invitation.code} created with maximum ${invitation.maxUses} uses`,
  });
  return res.status(201).json({
    message: "Invitation created successfully",
    code: invitation.code,
  });
}

async function getAllInvitations(req, res) {
  const invitations = await invitationModel.find().sort({ createdAt: -1 });

  return res.status(200).json({
    count: invitations.length,
    invitations,
  });
}

async function revokeInvitation(req, res) {
  const invitationId = req.params.id;

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

async function createMemberInvitation(req, res) {
  const invitationCode = generateInviteCode();
  const { maxUses, expiresAt } = req.body;
  const invitation = await invitationModel.create({
    code: invitationCode,
    maxUses,
    expiresAt,
    createdBy: req.user._id,
  });
  await auditLogModel.create({
    performedBy: req.user._id,
    action: "INVITATION_CREATED",
    targetId: invitation._id,
    details: `Member created invitation ${invitation.code}`,
  });
  return res.status(201).json({
    message: "Invitation created successfully",
    code: invitation.code,
  });
}
module.exports = {
  validateInvitation,
  createInvitation,
  getAllInvitations,
  revokeInvitation,
  createMemberInvitation,
};
