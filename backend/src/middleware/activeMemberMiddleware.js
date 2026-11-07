function activeMemberMiddleware(req, res, next) {
  if (req.user.accountStatus === "ACTIVE") {
    return next();
  }
  return res.status(403).json({
    message: "Forbidden Access",
  });
}

module.exports = activeMemberMiddleware;
