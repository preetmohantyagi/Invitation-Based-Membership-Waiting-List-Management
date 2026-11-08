const applicationModel = require("../models/applicationModel");
const notificationModel = require("../models/notificationModel");
const auditLogModel = require("../models/auditLogModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

const PRIORITY_RANK = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getAllApplications(req, res) {
  const { search, status, priority, sort = "newest" } = req.query;
  const allowedPriorities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
  const allowedStatuses = [
    "PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "WITHDRAWN",
  ];
  const allowedSorts = ["newest", "oldest", "priority"];

  let applicationQuery = {};

  if (priority) {
    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid application priority",
      });
    }
    applicationQuery.priority = priority;
  }

  if (status) {
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }
    applicationQuery.status = status;
  }

  if (!allowedSorts.includes(sort)) {
    return res.status(400).json({
      message: "Invalid sort option",
    });
  }

  if (search) {
    if (typeof search !== "string") {
      return res.status(400).json({
        message: "Invalid search value",
      });
    }
    const safeSearch = escapeRegex(search.trim());
    const users = await userModel
      .find({
        $or: [
          { fullName: { $regex: safeSearch, $options: "i" } },
          { email: { $regex: safeSearch, $options: "i" } },
        ],
      })
      .select("_id");
    applicationQuery.$or = [
      { user: { $in: users.map((user) => user._id) } },
      { company: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const applications = await applicationModel
    .find(applicationQuery)
    .populate("user", "fullName email")
    .sort({ createdAt: sort === "oldest" ? 1 : -1 });

  if (sort === "priority") {
    applications.sort(
      (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
    );
  }

  return res.status(200).json({
    applications,
  });
}

async function getDashboardStats(req, res) {
  try {
    const [
      totalApplicants,
      pendingApplications,
      underReviewApplications,
      approvedUsers,
      rejectedApplications,
    ] = await Promise.all([
      applicationModel.countDocuments(),
      applicationModel.countDocuments({ status: "PENDING" }),
      applicationModel.countDocuments({ status: "UNDER_REVIEW" }),
      userModel.countDocuments({ role: "USER", accountStatus: "ACTIVE" }),
      applicationModel.countDocuments({ status: "REJECTED" }),
    ]);

    return res.status(200).json({
      totalApplicants,
      pendingApplications,
      underReviewApplications,
      approvedUsers,
      rejectedApplications,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
}

async function updateApplicationPriority(req, res) {
  const applicationId = req.params.id;
  const applicationPriority = req.body.priority;

  if (!mongoose.isValidObjectId(applicationId)) {
    return res.status(400).json({ message: "Invalid application id" });
  }

  if (!Object.keys(PRIORITY_RANK).includes(applicationPriority)) {
    return res.status(400).json({
      message: "Priority can be either CRITICAL, HIGH, MEDIUM or LOW",
    });
  }

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

async function reviewApplication(req, res, options) {
  const {
    newApplicationStatus,
    newAccountStatus,
    allowedFrom,
    auditAction,
    auditText,
    notification,
    errorMessage,
    failMessage,
    successMessage,
  } = options;

  const applicationId = req.params.id;
  if (!mongoose.isValidObjectId(applicationId)) {
    return res.status(400).json({ message: "Invalid application id" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const application = await applicationModel
      .findById(applicationId)
      .session(session);
    if (!application) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Application Not Found",
      });
    }
    if (!allowedFrom.includes(application.status)) {
      await session.abortTransaction();
      return res.status(400).json({
        message: errorMessage,
      });
    }
    const user = await userModel.findById(application.user).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    application.status = newApplicationStatus;
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    await application.save({ session });

    user.accountStatus = newAccountStatus;
    await user.save({ session });

    if (notification) {
      await notificationModel.create(
        [
          {
            user: user._id,
            type: notification.type,
            message: notification.message,
          },
        ],
        { session },
      );
    }

    await auditLogModel.create(
      [
        {
          performedBy: req.user._id,
          action: auditAction,
          targetId: application._id,
          details: `${auditText} ${user.email}`,
        },
      ],
      { session },
    );
    await session.commitTransaction();

    return res.status(200).json({
      message: successMessage,
      applicationStatus: application.status,
      accountStatus: user.accountStatus,
    });
  } catch (error) {
    console.log(error);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return res.status(500).json({
      message: failMessage,
    });
  } finally {
    await session.endSession();
  }
}

function approveApplication(req, res) {
  return reviewApplication(req, res, {
    newApplicationStatus: "APPROVED",
    newAccountStatus: "ACTIVE",
    allowedFrom: ["PENDING", "UNDER_REVIEW"],
    auditAction: "APPLICATION_APPROVED",
    auditText: "Application approved for user",
    notification: {
      type: "APPLICATION_APPROVED",
      message:
        "Congratulations! Your membership application has been approved.",
    },
    errorMessage: "Only pending or under-review applications can be approved",
    failMessage: "Application approval failed",
    successMessage: "Application Approved Successfully",
  });
}

function rejectApplication(req, res) {
  return reviewApplication(req, res, {
    newApplicationStatus: "REJECTED",
    newAccountStatus: "REJECTED",
    allowedFrom: ["PENDING", "UNDER_REVIEW"],
    auditAction: "APPLICATION_REJECTED",
    auditText: "Application rejected for user",
    notification: {
      type: "APPLICATION_REJECTED",
      message: "Sorry, your membership application has been rejected.",
    },
    errorMessage: "Only pending or under-review applications can be rejected",
    failMessage: "Application Rejection Failed",
    successMessage: "Application Rejected Successfully",
  });
}

function markUnderReview(req, res) {
  return reviewApplication(req, res, {
    newApplicationStatus: "UNDER_REVIEW",
    newAccountStatus: "PENDING_APPROVAL",
    allowedFrom: ["PENDING"],
    auditAction: "APPLICATION_UNDER_REVIEW",
    auditText: "Application marked under review for user",
    notification: null,
    errorMessage: "Only pending applications can be moved to Under Review",
    failMessage: "Application Request Failed",
    successMessage: "Application is Under Review",
  });
}

async function getApplicationDetails(req, res) {
  const applicationId = req.params.id;

  if (!mongoose.isValidObjectId(applicationId)) {
    return res.status(400).json({ message: "Invalid application id" });
  }

  const application = await applicationModel
    .findById(applicationId)
    .populate(
      "user",
      "fullName email accountStatus invitationQuota invitationsCreated",
    )
    .populate({
      path: "invitation",
      populate: { path: "createdBy", select: "fullName email role" },
    })
    .populate("reviewedBy", "fullName email");

  if (!application) {
    return res.status(404).json({
      message: "Application Not Found",
    });
  }

  const history = await auditLogModel
    .find({ targetId: application._id })
    .populate("performedBy", "fullName email")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    application,
    history,
  });
}

async function updateApplicationNotes(req, res) {
  const applicationId = req.params.id;
  const { adminNotes } = req.body;

  if (!mongoose.isValidObjectId(applicationId)) {
    return res.status(400).json({ message: "Invalid application id" });
  }
  if (typeof adminNotes !== "string") {
    return res.status(400).json({
      message: "adminNotes must be a string",
    });
  }

  const application = await applicationModel.findByIdAndUpdate(
    applicationId,
    { adminNotes: adminNotes.trim() },
    { returnDocument: "after", runValidators: true },
  );
  if (!application) {
    return res.status(404).json({
      message: "Application Not Found",
    });
  }

  await auditLogModel.create({
    performedBy: req.user._id,
    action: "APPLICATION_NOTES_UPDATED",
    targetId: application._id,
    details: "Internal admin notes updated",
  });

  return res.status(200).json({
    message: "Notes updated successfully",
    adminNotes: application.adminNotes,
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

async function getActiveMembers(req, res) {
  const members = await userModel
    .find({ role: "USER", accountStatus: "ACTIVE" })
    .select("fullName email invitationQuota invitationsCreated")
    .sort({ fullName: 1 });

  return res.status(200).json({
    count: members.length,
    members,
  });
}

async function updateMemberQuota(req, res) {
  try {
    const { memberId } = req.params;
    const { invitationQuota } = req.body;

    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({
        message: "Invalid member id",
      });
    }

    if (!Number.isInteger(invitationQuota) || invitationQuota < 0) {
      return res.status(400).json({
        message: "Invitation quota must be a non-negative integer",
      });
    }

    const member = await userModel
      .findOneAndUpdate(
        {
          _id: memberId,
          role: "USER",
          accountStatus: "ACTIVE",
        },
        {
          $set: { invitationQuota },
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .select("fullName email invitationQuota invitationsCreated");

    if (!member) {
      return res.status(404).json({
        message: "Active member not found",
      });
    }

    await auditLogModel.create({
      performedBy: req.user._id,
      action: "MEMBER_QUOTA_UPDATED",
      targetId: member._id,
      details: `Invitation quota of ${member.email} updated to ${invitationQuota}`,
    });

    return res.status(200).json({
      message: "Member invitation quota updated successfully",
      member,
    });
  } catch (error) {
    console.error("Update member quota error:", error);

    return res.status(500).json({
      message: "Unable to update member quota",
    });
  }
}
module.exports = {
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
};
