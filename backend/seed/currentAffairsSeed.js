const mongoose = require("mongoose");
const dotenv = require("dotenv");
const CurrentAffair = require("../models/CurrentAffair");
const User = require("../models/User");

dotenv.config();

/* ---------------- DB CONNECT ---------------- */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

/* ---------------- SEED FUNCTION ---------------- */
const seedCurrentAffairs = async () => {
  try {
    await connectDB();

    // Get admin user
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("Admin user not found. Create admin first.");
      process.exit(1);
    }

    await CurrentAffair.deleteMany();
    console.log("Old current affairs removed");

    const currentAffairs = [
      {
        title: "Union Budget 2025 Focuses on Infrastructure Growth",
        description: "Union Budget 2025 emphasizes infrastructure development with increased allocation for roads, railways, and digital infrastructure.",
        detailedContent: `
          <h3>Key Highlights of Union Budget 2025</h3>
          <p>The Union Budget 2025 has allocated significant funds for infrastructure development across various sectors:</p>
          <ul>
            <li><strong>Roads and Highways:</strong> ₹2.7 lakh crore allocated for road infrastructure</li>
            <li><strong>Railways:</strong> ₹2.4 lakh crore for railway modernization and expansion</li>
            <li><strong>Digital Infrastructure:</strong> ₹1.2 lakh crore for digital connectivity and 5G rollout</li>
            <li><strong>Green Energy:</strong> ₹35,000 crore for renewable energy projects</li>
          </ul>
          <p>This budget aims to boost economic growth and create employment opportunities across the country.</p>
        `,
        category: "Economy",
        date: new Date("2025-02-01"),
        month: "February",
        year: 2025,
        tags: ["Budget 2025", "Economy", "Infrastructure"],
        relatedExams: ["UPSC", "SSC", "Banking", "State PSC"],
        source: "PIB",
        importanceLevel: "High",
        isPublished: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        title: "India Launches Mission Chandrayaan-4",
        description: "ISRO announces Chandrayaan-4 mission to explore lunar south pole with advanced rover technology.",
        detailedContent: `
          <h3>Chandrayaan-4 Mission Details</h3>
          <p>The Indian Space Research Organisation (ISRO) has announced the ambitious Chandrayaan-4 mission:</p>
          <ul>
            <li><strong>Launch Date:</strong> Scheduled for Q4 2025</li>
            <li><strong>Objective:</strong> Detailed exploration of lunar south pole</li>
            <li><strong>Technology:</strong> Advanced rover with drilling capabilities</li>
            <li><strong>Duration:</strong> 14-day mission on lunar surface</li>
          </ul>
          <p>This mission will further establish India's position as a leading space-faring nation.</p>
        `,
        category: "Science & Technology",
        date: new Date("2025-01-15"),
        month: "January",
        year: 2025,
        tags: ["ISRO", "Chandrayaan", "Space Mission", "Science"],
        relatedExams: ["UPSC", "SSC", "Defense"],
        source: "ISRO",
        importanceLevel: "High",
        isPublished: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        title: "New Environmental Protection Act 2025 Passed",
        description: "Parliament passes comprehensive Environmental Protection Act 2025 with stricter pollution norms.",
        detailedContent: `
          <h3>Environmental Protection Act 2025</h3>
          <p>The new act introduces several key provisions:</p>
          <ul>
            <li><strong>Air Quality Standards:</strong> Stricter PM2.5 and PM10 limits</li>
            <li><strong>Water Conservation:</strong> Mandatory rainwater harvesting for buildings</li>
            <li><strong>Waste Management:</strong> Extended producer responsibility for packaging</li>
            <li><strong>Penalties:</strong> Increased fines for environmental violations</li>
          </ul>
          <p>The act aims to achieve carbon neutrality by 2070 as per India's climate commitments.</p>
        `,
        category: "Environment",
        date: new Date("2025-01-20"),
        month: "January",
        year: 2025,
        tags: ["Environment", "Pollution", "Climate Change", "Legislation"],
        relatedExams: ["UPSC", "State PSC", "Teaching"],
        source: "Parliament",
        importanceLevel: "High",
        isPublished: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        title: "India-Japan Strategic Partnership Agreement Signed",
        description: "India and Japan sign comprehensive strategic partnership agreement covering defense, technology, and trade.",
        detailedContent: `
          <h3>India-Japan Strategic Partnership</h3>
          <p>The agreement covers multiple areas of cooperation:</p>
          <ul>
            <li><strong>Defense:</strong> Joint military exercises and technology sharing</li>
            <li><strong>Technology:</strong> Collaboration in AI, quantum computing, and semiconductors</li>
            <li><strong>Trade:</strong> Bilateral trade target of $50 billion by 2025</li>
            <li><strong>Infrastructure:</strong> Japanese investment in Indian infrastructure projects</li>
          </ul>
          <p>This partnership strengthens India's position in the Indo-Pacific region.</p>
        `,
        category: "International",
        date: new Date("2025-01-10"),
        month: "January",
        year: 2025,
        tags: ["India-Japan", "International Relations", "Defense", "Trade"],
        relatedExams: ["UPSC", "SSC", "Defense"],
        source: "MEA",
        importanceLevel: "High",
        isPublished: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        title: "Digital India 2.0 Initiative Launched",
        description: "Government launches Digital India 2.0 with focus on AI integration and digital governance.",
        detailedContent: `
          <h3>Digital India 2.0 Features</h3>
          <p>The upgraded initiative includes:</p>
          <ul>
            <li><strong>AI Integration:</strong> AI-powered government services</li>
            <li><strong>Digital Governance:</strong> Paperless government offices</li>
            <li><strong>Cybersecurity:</strong> Enhanced data protection measures</li>
            <li><strong>Digital Literacy:</strong> Training programs for rural areas</li>
          </ul>
          <p>The initiative aims to make India a global leader in digital governance.</p>
        `,
        category: "National",
        date: new Date("2025-01-25"),
        month: "January",
        year: 2025,
        tags: ["Digital India", "AI", "Governance", "Technology"],
        relatedExams: ["UPSC", "SSC", "Banking"],
        source: "MeitY",
        importanceLevel: "Medium",
        isPublished: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      },
      {
        title: "Virat Kohli Becomes Leading Run Scorer in ODIs",
        description: "Virat Kohli surpasses Sachin Tendulkar's record to become the highest run scorer in ODI cricket.",
        detailedContent: `
          <h3>Historic Cricket Achievement</h3>
          <p>Virat Kohli's record-breaking performance:</p>
          <ul>
            <li><strong>Total Runs:</strong> 13,500+ runs in ODI format</li>
            <li><strong>Centuries:</strong> 47 ODI centuries</li>
            <li><strong>Average:</strong> Maintains average above 58</li>
            <li><strong>Achievement Date:</strong> January 30, 2025</li>
          </ul>
          <p>This achievement cements Kohli's position as one of cricket's greatest batsmen.</p>
        `,
        category: "Sports",
        date: new Date("2025-01-30"),
        month: "January",
        year: 2025,
        tags: ["Cricket", "Virat Kohli", "ODI", "Record"],
        relatedExams: ["UPSC", "SSC", "State PSC"],
        source: "BCCI",
        importanceLevel: "Medium",
        isPublished: true,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      }
    ];

    await CurrentAffair.insertMany(currentAffairs);
    console.log("Current Affairs seeded successfully");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCurrentAffairs();
