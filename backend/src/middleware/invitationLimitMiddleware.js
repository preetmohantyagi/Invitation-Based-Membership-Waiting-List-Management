const rateLimit = require("express-rate-limit");

// Code guess karne wale scripts ko rokne ke liye
const invitationValidateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many attempts. Please try again after 15 minutes.",
  },
});

module.exports = invitationValidateLimiter;