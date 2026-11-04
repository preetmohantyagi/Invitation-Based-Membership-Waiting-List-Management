const applicationModel = require("../models/applicationModel");
const invitationModel = require("../models/invitationModel");

async function getMyApplication(req, res) {
  const application = await applicationModel.findOne({ user: req.user._id });
  if (!application) {
    return res.status(404).json({
      message: "Not Found",
    });
  }
  return res.status(200).json({
    status: application.status,
    priority: application.priority,
  });
}
async function getMyInvitations(req, res) {
  const invitations = await invitationModel
    .find({ createdBy: req.user._id })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    count: invitations.length,
    invitations,
  });
}

async function withdrawApplication(req, res) {
  const application = await applicationModel.findOne({
    user: req.user._id,
  });
  if (!application) {
    return res.status(404).json({
      message: "Application Not Found",
    });
  }
  if (!["PENDING", "UNDER_REVIEW"].includes(application.status)) {
    return res.status(400).json({
      message: "Application cannot be withdrawn",
    });
  }
  application.status = "WITHDRAWN";
  await application.save();
  return res.status(200).json({
    message: "Application Withdrawn Successfully",
    status: application.status,
  });
}
module.exports = { getMyApplication, getMyInvitations };
