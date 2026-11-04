const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Server is connected to DB");
  } catch (err) {
    console.log("Error connecting to DB", err.message);
    process.exit(1);
  }
}

module.exports = connectToDB;