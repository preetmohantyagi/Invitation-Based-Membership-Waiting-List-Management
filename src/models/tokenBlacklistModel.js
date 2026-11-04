const mongoose = require("mongoose");
const tokenBlacklistSchema = new mongoose.Schema({
  jti: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
});

module.exports = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
