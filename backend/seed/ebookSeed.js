const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Ebook = require("../models/Ebook");
const User = require("../models/User");

dotenv.config();

/* ================== CONNECT DB ================== */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

/* ================== SEED DATA ================== */
const seedEbooks = async () => {
  try {
    await connectDB();

    // 🔴 Clear old ebooks (optional)
    await Ebook.deleteMany();

    // 🔑 Get admin/author user
    const adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      console.log("Admin user not found. Create admin first.");
      process.exit(1);
    }

    const ebooks = [
      {
        title: "UPSC GS Complete Notes",
        description: "Concise GS notes for UPSC Prelims & Mains",
        fullDescription:
          "Comprehensive General Studies notes covering Polity, History, Geography, Economy, and Current Affairs with exam-focused explanations.",
        price: 499,
        originalPrice: 999,
        coverImage: "/images/ebooks/upsc-gs.jpg",
        fileUrl: "/uploads/ebooks/upsc-gs.pdf",
        previewUrl: "/uploads/ebooks/upsc-gs-preview.pdf",
        isFree: false,
        category: "UPSC",
        language: "English",
        pages: 320,
        fileSize: "5.2 MB",
        format: "PDF",
        tags: ["UPSC", "GS", "Prelims", "Mains"],
        author: adminUser._id,
        isFeatured: true,
      },
      {
        title: "Himachal GK for HAS",
        description: "State specific GK for HPAS / HAS exams",
        fullDescription:
          "Focused GK content for Himachal Pradesh covering history, geography, polity, economy, and current affairs.",
        price: 0,
        originalPrice: 0,
        coverImage: "/images/ebooks/hp-gk.jpg",
        fileUrl: "/uploads/ebooks/hp-gk.pdf",
        isFree: true,
        category: "State Exams",
        language: "English",
        pages: 180,
        fileSize: "3.1 MB",
        format: "PDF",
        tags: ["HAS", "HPAS", "Himachal GK"],
        author: adminUser._id,
      },
      {
        title: "SSC Quantitative Aptitude",
        description: "Complete maths guide for SSC exams",
        fullDescription:
          "Covers Arithmetic, Algebra, Geometry, Trigonometry with solved examples and practice questions.",
        price: 299,
        originalPrice: 599,
        coverImage: "/images/ebooks/ssc-quant.jpg",
        fileUrl: "/uploads/ebooks/ssc-quant.pdf",
        isFree: false,
        category: "SSC",
        language: "English",
        pages: 250,
        fileSize: "4.0 MB",
        format: "PDF",
        tags: ["SSC", "Quant", "Maths"],
        author: adminUser._id,
      },
      {
        title: "Current Affairs Monthly – January",
        description: "Monthly current affairs for competitive exams",
        fullDescription:
          "Exam-oriented current affairs covering national, international, economy, science, and government schemes.",
        price: 0,
        originalPrice: 0,
        coverImage: "/images/ebooks/current-affairs.jpg",
        fileUrl: "/uploads/ebooks/current-affairs-jan.pdf",
        isFree: true,
        category: "Current Affairs",
        language: "English",
        pages: 90,
        fileSize: "1.8 MB",
        format: "PDF",
        tags: ["Current Affairs", "Monthly"],
        author: adminUser._id,
      },
    ];

    await Ebook.insertMany(ebooks);

    console.log("Ebooks seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedEbooks();
