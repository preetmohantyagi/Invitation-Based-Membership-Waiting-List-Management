
function activeMemberMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (
    req.user.role !== "USER" ||
    req.user.accountStatus !== "ACTIVE"
  ) {
    return res.status(403).json({
      message: "Active membership required",
    });
  }

  next();
}

module.exports = activeMemberMiddleware;
