const applicationModel = require("../models/applicationModel");
const notificationModel = require("../models/notificationModel");
const auditLogModel = require("../models/auditLogModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

async function getAllApplications(req, res) {
  const search = req.query.search;
  const status = req.query.status;
  const priority = req.query.priority;
  const allowedPriorities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

  let applicationQuery = {};

  if (priority && !allowedPriorities.includes(priority)) {
    return res.status(400).json({
      message: "Invalid application priority",
    });
  }

  if (priority) {
    applicationQuery.priority = priority;
  }
  const allowedStatuses = [
    "PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "WITHDRAWN",
  ];
  if (status) {
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    applicationQuery.status = status;
  }
  if (search) {
    const users = await userModel
      .find({
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      })
      .select("_id");
    applicationQuery.user = {
      $in: users.map((user) => user._id),
    };
  }

  const applications = await applicationModel
    .find(applicationQuery)
    .populate("user", "fullName email");
  return res.status(200).json({
    applications,
  });
}

async function updateApplicationPriority(req, res) {
  const applicationId = req.params.id;
  const applicationPriority = req.body.priority;

  const application = await applicationModel.findByIdAndUpdate(
    applicationId,
    {
      priority: applicationPriority,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  if (!application) {
    return res.status(404).json({
      message: "Application Not Found",
    });
  }
  await auditLogModel.create({
    performedBy: req.user._id,
    action: "APPLICATION_PRIORITY_CHANGED",
    targetId: application._id,
    details: `Application priority changed to ${application.priority}`,
  });

  return res.status(200).json({
    message: "Priority Updated Successfully",
    application,
  });
}

async function approveApplication(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const applicationId = req.params.id;
    const applicationExists = await applicationModel
      .findById(applicationId)
      .session(session);
    if (!applicationExists) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Not Found",
      });
    }
    const user = await userModel
      .findById(applicationExists.user)
      .session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    applicationExists.status = "APPROVED";
    applicationExists.reviewedBy = req.user._id;
    applicationExists.reviewedAt = new Date();
    await applicationExists.save({ session });

    user.accountStatus = "ACTIVE";
    await user.save({ session });

    await notificationModel.create(
      [
        {
          user: user._id,
          type: "APPLICATION_APPROVED",
          message:
            "Congratulations! Your membership application has been approved.",
        },
      ],
      { session },
    );
    await auditLogModel.create(
      [
        {
          performedBy: req.user._id,
          action: "APPLICATION_APPROVED",
          targetId: applicationExists._id,
          details: `Application approved for user ${user.email}`,
        },
      ],
      { session },
    );
    await session.commitTransaction();

    return res.status(200).json({
      message: "Application Approved Successfully",
      applicationStatus: applicationExists.status,
      accountStatus: user.accountStatus,
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();

    return res.status(500).json({
      message: "Application approval failed",
    });
  } finally {
    await session.endSession();
  }
}

async function rejectApplication(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const applicationId = req.params.id;
    const applicationExists = await applicationModel
      .findById(applicationId)
      .session(session);
    if (!applicationExists) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Not Found",
      });
    }
    const user = await userModel
      .findById(applicationExists.user)
      .session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    applicationExists.status = "REJECTED";
    applicationExists.reviewedBy = req.user._id;
    applicationExists.reviewedAt = new Date();
    await applicationExists.save({ session });

    user.accountStatus = "REJECTED";
    await user.save({ session });

    await notificationModel.create(
      [
        {
          user: user._id,
          type: "APPLICATION_REJECTED",
          message: "Sorry, your membership application has been rejected.",
        },
      ],
      { session },
    );
    await auditLogModel.create(
      [
        {
          performedBy: req.user._id,
          action: "APPLICATION_REJECTED",
          targetId: applicationExists._id,
          details: `Application rejected for user ${user.email}`,
        },
      ],
      { session },
    );
    await session.commitTransaction();

    return res.status(200).json({
      message: "Application Rejected Successfully",
      applicationStatus: applicationExists.status,
      accountStatus: user.accountStatus,
    });
  } catch (error) {
    console.log(error);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return res.status(500).json({
      message: "Application Rejection Failed",
    });
  } finally {
    await session.endSession();
  }
}

async function markUnderReview(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const applicationId = req.params.id;
    const applicationExists = await applicationModel
      .findById(applicationId)
      .session(session);
    if (!applicationExists) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Not Found",
      });
    }
    const user = await userModel
      .findById(applicationExists.user)
      .session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    if (
      applicationExists.status === "APPROVED" ||
      applicationExists.status === "REJECTED" ||
      applicationExists.status === "WITHDRAWN"
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Application cannot be moved to Under Review",
      });
    }
    applicationExists.status = "UNDER_REVIEW";
    applicationExists.reviewedBy = req.user._id;
    applicationExists.reviewedAt = new Date();
    await applicationExists.save({ session });

    user.accountStatus = "PENDING_APPROVAL";
    await user.save({ session });
    await session.commitTransaction();

    return res.status(200).json({
      message: "Application  is Under Review",
      applicationStatus: applicationExists.status,
      accountStatus: user.accountStatus,
    });
  } catch (error) {
    console.log(error);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return res.status(500).json({
      message: "Application Request Failed",
    });
  } finally {
    await session.endSession();
  }
}

async function getApplicationDetails(req, res) {
  const applicationId = req.params.id;
  const application = await applicationModel
    .findById(applicationId)
    .populate("user", "fullName email")
    .populate("invitation");

  if (!application) {
    return res.status(404).json({
      message: "Application Not Found",
    });
  }
  return res.status(200).json({
    application,
  });
}

async function getAuditLogs(req, res) {
  const logs = await auditLogModel
    .find()
    .populate("performedBy", "fullName email")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    count: logs.length,
    logs,
  });
}
module.exports = {
  getAllApplications,
  updateApplicationPriority,
  approveApplication,
  rejectApplication,
  markUnderReview,
  getApplicationDetails,
  getAuditLogs,
};
