const invitationModel = require("../models/invitationModel");
const userModel = require("../models/userModel");
const generateInviteCode = require("../utils/generateInviteCode");
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
  });
  return res.status(201).json({
    message: "Invitation created successfully",
    code: invitation.code,
  });
}

module.exports = { validateInvitation, createInvitation };
