const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for Seeding"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const seedUsers = async () => {
  try {
    // Remove existing users (optional but recommended)
    await User.deleteMany();

    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        phone: "9999999999",
        password: "Admin@123",
        role: "admin",
        emailVerified: true,
        phoneVerified: true,
      },
      {
        name: "Instructor User",
        email: "instructor@example.com",
        phone: "8888888888",
        password: "Instructor@123",
        role: "instructor",
        bio: "Expert faculty with 10+ years experience",
        preferences: {
          examTypes: ["UPSC", "State PSC"],
          subjects: ["Polity", "History"],
        },
      },
      {
        name: "Student User",
        email: "student@example.com",
        phone: "7777777777",
        password: "Student@123",
        role: "student",
        preferences: {
          examTypes: ["UPSC", "SSC"],
          subjects: ["GS", "Quant"],
        },
        subscription: {
          type: "free",
          isActive: true,
        },
      },
    ];

    await User.insertMany(users);

    console.log("✅ Users Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
};

seedUsers();
