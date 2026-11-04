const generateToken = require("../utils/generateToken");
const userModel = require("../models/userModel");
const invitationModel = require("../models/invitationModel");
const applicationModel = require("../models/applicationModel");
const mongoose = require("mongoose");

async function registerUser(req, res) {
  const { fullName, email, password, code } = req.body;
  if (!fullName || !email || !password || !code) {
    return res.status(400).json({
      message: "Bad Request ",
    });
  }

  const isExists = await userModel.findOne({
    email: email,
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
  session.startTransaction();

  const user = await userModel.create({
    fullName,
    email,
    password,
  });

  const token = generateToken(user._id);
  res.cookie("token", token);

  res.status(201).json({
    message: "User Registered Successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
    token,
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = await userModel.findOne({ email }).select("+password");
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
  const token = generateToken(user._id);
  res.cookie("token", token);

  res.status(200).json({
    message: "User Login Successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
    token,
  });
}
module.exports = { registerUser, loginUser };
