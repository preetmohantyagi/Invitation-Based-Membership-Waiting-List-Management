function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Forbidden Access",
    });
  }

  return next();
}

module.exports = adminMiddleware;