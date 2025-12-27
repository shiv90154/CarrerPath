const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = "admin@institute.com";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = await User.create({
      name: "Super Admin",
      email: adminEmail,
      phone: "9999999999",
      password: "Admin@123",
      role: "admin"
    });

    console.log("Admin created successfully:");
    console.log({
      email: admin.email,
      password: "Admin@123"
    });

    process.exit(0);
  } catch (error) {
    console.error("Admin seed error:", error);
    process.exit(1);
  }
}

seedAdmin();
