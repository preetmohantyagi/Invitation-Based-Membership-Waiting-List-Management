const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const invitationModel = require("../models/invitationModel");
const applicationModel = require("../models/applicationModel");
const notificationModel = require("../models/notificationModel");
const auditLogModel = require("../models/auditLogModel");
const mongoose = require("mongoose");
const tokenBlacklistModel = require("../models/tokenBlacklistModel");

async function registerUser(req, res) {
  const {
    fullName,
    email,
    password,
    code,
    phone,
    designation,
    company,
    industry,
    experience,
    location,
  } = req.body;
  const applicantFields = [
    phone,
    designation,
    company,
    industry,
    experience,
    location,
  ];
  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof code !== "string" ||
    applicantFields.some((field) => typeof field !== "string")
  ) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  if (
    !fullName.trim() ||
    !email.trim() ||
    !password ||
    !code.trim() ||
    applicantFields.some((field) => !field.trim())
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const isExists = await userModel.findOne({
    email: normalizedEmail,
  });

  if (isExists) {
    return res.status(422).json({
      message: "User Already Exists with the Email",
    });
  }
  const invitationCode = code.trim().toUpperCase();

  const invitation = await invitationModel.findOne({ code: invitationCode });
  if (!invitation) {
    return res.status(404).json({
      message: "Invalid Invitation Code",
    });
  }
  if (invitation.status !== "ACTIVE") {
    return res.status(400).json({
      message: "Invitation is not active",
    });
  }
  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    return res.status(400).json({
      message: "Invitation Expired",
    });
  }

  if (invitation.usedCount >= invitation.maxUses) {
    return res.status(400).json({
      message: "Invitation Exhausted",
    });
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updatedInvitation = await invitationModel.findOneAndUpdate(
      {
        _id: invitation._id,
        status: "ACTIVE",
        $expr: {
          $lt: ["$usedCount", "$maxUses"],
        },
        $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
      },
      {
        $inc: { usedCount: 1 },
      },
      {
        returnDocument: "after",
        session,
      },
    );

    if (!updatedInvitation) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invitation is no longer available",
      });
    }
    if (updatedInvitation.usedCount >= updatedInvitation.maxUses) {
      updatedInvitation.status = "EXHAUSTED";
      await updatedInvitation.save({ session });
    }

    const user = await userModel.create(
      [
        {
          fullName: fullName.trim(),
          email: normalizedEmail,
          password,
          accountStatus: "PENDING_APPROVAL",
        },
      ],
      { session },
    );
    const newUser = user[0];
    const application = await applicationModel.create(
      [
        {
          user: newUser._id,
          invitation: updatedInvitation._id,
          phone,
          designation,
          company,
          industry,
          experience,
          location,
        },
      ],
      { session },
    );

    const newApplication = application[0];
    await notificationModel.create(
      [
        {
          user: newUser._id,
          type: "APPLICATION_SUBMITTED",
          message:
            "Your membership application has been submitted successfully.",
        },
      ],
      { session },
    );
    await auditLogModel.create(
      [
        {
          performedBy: newUser._id,
          action: "INVITATION_REDEEMED",
          targetId: updatedInvitation._id,
          details: `Application ${newApplication._id} submitted using invitation ${updatedInvitation.code}`,
        },
      ],
      { session },
    );
    await session.commitTransaction();

    const token = generateToken(newUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "User Registered Successfully",
      user: {
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        accountStatus: newUser.accountStatus,
      },
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0];
      return res.status(400).json({
        message: firstError?.message || "Invalid input",
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }
    return res.status(500).json({
      message: "Registration failed",
    });
  } finally {
    await session.endSession();
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({
      message: "Invalid input",
    });
  }
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }
  const normalizedEmail = email.trim().toLowerCase();

  const user = await userModel
    .findOne({ email: normalizedEmail })
    .select("+password");
  if (!user) {
    return res.status(401).json({
      message: "Email or password is Invalid",
    });
  }
  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Email or password is Invalid",
    });
  }
  if (["SUSPENDED", "DISABLED"].includes(user.accountStatus)) {
    return res.status(403).json({
      message: "Your account is not allowed to login. Please contact support.",
    });
  }
  const token = generateToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    message: "User Login Successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      accountStatus: user.accountStatus,
      invitationQuota: user.invitationQuota,
      invitationsCreated: user.invitationsCreated,
      createdAt: user.createdAt,
    },
  });
}

async function logoutUser(req, res) {
  const token = req.cookies?.token;
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      await tokenBlacklistModel.create({
        jti: decoded.jti,
        expiresAt: new Date(decoded.exp * 1000),
      });
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(200).json({
        message: "Logged out successfully",
      });
    }

    return res.status(500).json({
      message: "Logout failed. Please try again.",
    });
  }
}
async function getCurrentUser(req, res) {
  res.status(200).json({
    user: {
      _id: req.user._id,
      email: req.user.email,
      fullName: req.user.fullName,
      accountStatus: req.user.accountStatus,
      role: req.user.role,
      invitationQuota: req.user.invitationQuota,
      invitationsCreated: req.user.invitationsCreated,
      createdAt: req.user.createdAt,
    },
  });
}

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser };
