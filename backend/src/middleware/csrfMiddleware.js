function csrfMiddleware(req, res, next) {
  const allowedOrigin = process.env.CLIENT_URL;

  const methods = ["POST", "PUT", "PATCH", "DELETE"];

  if (!methods.includes(req.method)) {
    return next();
  }

  const origin = req.get("Origin");
  
  const csrfHeader = req.get("X-CSRF-Protection");

  if (origin !== allowedOrigin || csrfHeader !== "1") {
    return res.status(403).json({
      message: "CSRF protection: Request blocked",
    });
  }
  
  next();
}

module.exports = csrfMiddleware;