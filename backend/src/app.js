const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const invitationRoutes = require("./routes/invitationRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const csrfMiddleware = require("./middleware/csrfMiddleware");
const helmet = require("helmet");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(csrfMiddleware);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/invitations", invitationRoutes);

app.get("/", (req, res) => {
  res.send("Invitation-Based Membership Platform up and running");
});
app.use(errorMiddleware);

module.exports = app;
