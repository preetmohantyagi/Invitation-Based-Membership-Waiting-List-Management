const crypto = require("crypto");

function generateInviteCode() {
  const code = crypto.randomBytes(6).toString("hex").toUpperCase();

  return "INV-" + code;
}


module.exports = generateInviteCode;
