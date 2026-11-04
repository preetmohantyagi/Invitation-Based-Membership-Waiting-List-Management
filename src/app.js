const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const invitationRoutes = require("./routes/invitationRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/invitations", invitationRoutes);

app.get("/", (req, res) => {
  res.send("Invitation-Based Membership Platform up and running");
});

module.exports = app;
