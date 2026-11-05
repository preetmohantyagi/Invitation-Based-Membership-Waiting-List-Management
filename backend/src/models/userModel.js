const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required for creating a user"],
    },
    email: {
      type: String,
      required: [true, "Email is required for creating a user"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid Email Address",
      ],
      unique: [true, "Email Already Exists"],
    },
    role: {
      type: String,
      enum: {
        values: ["USER", "ADMIN"],
        message: "Role can be either USER or ADMIN",
      },
      default: "USER",
    },
    accountStatus: {
      type: String,
      enum: {
        values: [
          "INVITE_REQUIRED",
          "PENDING_APPROVAL",
          "ACTIVE",
          "REJECTED",
          "SUSPENDED",
          "DISABLED",
        ],
        message:
          "Account Status can be either INVITE_REQUIRED, PENDING_APPROVAL, ACTIVE, REJECTED, SUSPENDED or  DISABLED",
      },
      default: "PENDING_APPROVAL",
    },
    password: {
      type: String,
      required: [true, "Password is required for creating an account"],
      minlength: [6, "password should contain more than 6 character"],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
