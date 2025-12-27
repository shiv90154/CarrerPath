const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Test = require("../models/Test");

dotenv.config();

/* ---------------- SAMPLE TEST DATA ---------------- */
const tests = [
  {
    title: "UPSC Prelims Mock Test – 1",
    description: "Full-length UPSC Prelims mock test based on latest syllabus.",
    duration: 120,
    passMark: 33,
    isFree: true,
  },
  {
    title: "UPSC Prelims Mock Test – 2",
    description: "Advanced difficulty mock test with current affairs focus.",
    duration: 120,
    passMark: 33,
    isFree: false,
  },
  {
    title: "HAS Prelims Practice Test",
    description: "Himachal Administrative Services prelims practice test.",
    duration: 90,
    passMark: 30,
    isFree: true,
  },
  {
    title: "SSC CGL Tier-1 Test",
    description: "SSC CGL Tier-1 exam pattern based mock test.",
    duration: 60,
    passMark: 25,
    isFree: false,
  },
  {
    title: "Bank PO Quantitative Aptitude Test",
    description: "Bank PO quantitative aptitude section test.",
    duration: 45,
    passMark: 20,
    isFree: false,
  },
  {
    title: "Current Affairs Weekly Test",
    description: "Weekly current affairs MCQ test for all exams.",
    duration: 30,
    passMark: 15,
    isFree: true,
  },
];

/* ---------------- DB CONNECT ---------------- */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

/* ---------------- SEED FUNCTION ---------------- */
const seedTests = async () => {
  try {
    await connectDB();

    await Test.deleteMany();
    console.log("Old tests removed");

    await Test.insertMany(tests);
    console.log("Test data seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedTests();
