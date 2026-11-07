const applicationModel = require("../models/applicationModel");
const invitationModel = require("../models/invitationModel");
const notificationModel = require("../models/notificationModel");

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

async function getMyNotifications(req, res) {
  const notifications = await notificationModel
    .find({ user: req.user._id })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    count: notifications.length,
    notifications,
  });
}

async function markNotificationAsRead(req, res) {
  const notification = await notificationModel.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    {
      isRead: true,
    },
    {
      returnDocument: "after",
    },
  );
  if (!notification) {
    return res.status(404).json({
      message: "Notification Not Found",
    });
  }

  return res.status(200).json({
    message: "Notification marked as read",
    notification,
  });
}
module.exports = {
  getMyApplication,
  getMyInvitations,
  withdrawApplication,
  getMyNotifications,
  markNotificationAsRead,
};
