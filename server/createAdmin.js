
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createAdmin() {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing from .env");
    }

    await mongoose.connect("mongodb://127.0.0.1:27017/myprofile");

    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin account already exists:", email);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = new User({
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("Admin account created successfully!");
    console.log("Admin email:", email);
    console.log("Password stored securely as a hash.");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
