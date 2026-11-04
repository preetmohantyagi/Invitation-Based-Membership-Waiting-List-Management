const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const invitationRoutes = require("./routes/invitationRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/invitations", invitationRoutes);

app.get("/", (req, res) => {
  res.send("Invitation-Based Membership Platform up and running");
});

module.exports = app;
