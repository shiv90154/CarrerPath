const mongoose = require('mongoose');
const StudyMaterial = require('../models/StudyMaterial');
const User = require('../models/User');

const studyMaterialSeedData = [
    {
        title: "UPSC Prelims 2023 General Studies Paper I",
        description: "Complete question paper with detailed solutions and explanations. Covers History, Geography, Polity, Economics, Environment, and Current Affairs.",
        year: "2023",
        examType: "UPSC",
        subject: "General Studies",
        type: "Free",
        price: 0,
        language: "English",
        pages: 24,
        downloads: 1250,
        isActive: true,
        coverImage: "/images/upsc-gs-2023.jpg",
        fileUrl: "https://example.com/upsc-gs-2023.pdf"
    },
    {
        title: "SSC CGL 2022 Quantitative Aptitude",
        description: "Previous year question paper with step-by-step solutions. Includes all topics: Arithmetic, Algebra, Geometry, Trigonometry, and Statistics.",
        year: "2022",
        examType: "SSC",
        subject: "Quantitative Aptitude",
        type: "Paid",
        price: 199,
        language: "English",
        pages: 32,
        downloads: 890,
        isActive: true,
        coverImage: "/images/ssc-quant-2022.jpg",
        fileUrl: "https://example.com/ssc-quant-2022.pdf"
    },
    {
        title: "Banking PO 2023 English Language",
        description: "Comprehensive question paper covering Reading Comprehension, Grammar, Vocabulary, and Writing Skills with detailed explanations.",
        year: "2023",
        examType: "Banking",
        subject: "English",
        type: "Free",
        price: 0,
        language: "English",
        pages: 20,
        downloads: 675,
        isActive: true,
        coverImage: "/images/banking-english-2023.jpg",
        fileUrl: "https://example.com/banking-english-2023.pdf"
    },
    {
        title: "Railway NTPC 2022 General Awareness",
        description: "Complete question paper with current affairs, static GK, and subject-specific questions. Includes detailed explanations and shortcuts.",
        year: "2022",
        examType: "Railway",
        subject: "General Awareness",
        type: "Paid",
        price: 149,
        language: "English",
        pages: 28,
        downloads: 543,
        isActive: true,
        coverImage: "/images/railway-ga-2022.jpg",
        fileUrl: "https://example.com/railway-ga-2022.pdf"
    },
    {
        title: "State PSC 2023 History & Culture",
        description: "Previous year questions from various State PSC exams covering Ancient, Medieval, and Modern Indian History with cultural aspects.",
        year: "2023",
        examType: "State Exams",
        subject: "History",
        type: "Free",
        price: 0,
        language: "English",
        pages: 36,
        downloads: 432,
        isActive: true,
        coverImage: "/images/state-psc-history-2023.jpg",
        fileUrl: "https://example.com/state-psc-history-2023.pdf"
    },
    {
        title: "Teaching Eligibility Test 2022 Child Development",
        description: "Complete TET paper focusing on Child Development and Pedagogy with practical examples and case studies.",
        year: "2022",
        examType: "Teaching",
        subject: "Child Development",
        type: "Paid",
        price: 179,
        language: "English",
        pages: 25,
        downloads: 321,
        isActive: true,
        coverImage: "/images/tet-cdp-2022.jpg",
        fileUrl: "https://example.com/tet-cdp-2022.pdf"
    },
    {
        title: "UPSC Mains 2022 Essay Paper",
        description: "Previous year essay topics with sample answers, structure guidelines, and expert tips for scoring high marks.",
        year: "2022",
        examType: "UPSC",
        subject: "Essay Writing",
        type: "Paid",
        price: 299,
        language: "English",
        pages: 45,
        downloads: 756,
        isActive: true,
        coverImage: "/images/upsc-essay-2022.jpg",
        fileUrl: "https://example.com/upsc-essay-2022.pdf"
    },
    {
        title: "General Knowledge Compendium 2023",
        description: "Comprehensive collection of important GK questions from various competitive exams with detailed explanations and memory tricks.",
        year: "2023",
        examType: "Other",
        subject: "General Knowledge",
        type: "Free",
        price: 0,
        language: "English",
        pages: 50,
        downloads: 1890,
        isActive: true,
        coverImage: "/images/gk-compendium-2023.jpg",
        fileUrl: "https://example.com/gk-compendium-2023.pdf"
    }
];

const seedStudyMaterials = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding study materials');

        // Find an admin user to assign as author
        let adminUser = await User.findOne({ role: 'admin' });

        if (!adminUser) {
            // Create a default admin user if none exists
            adminUser = await User.create({
                name: 'Study Material Admin',
                email: 'studymaterial@admin.com',
                password: 'admin123',
                role: 'admin',
                isActive: true,
                emailVerified: true
            });
            console.log('Created default admin user for study materials');
        }

        // Clear existing study materials
        await StudyMaterial.deleteMany({});
        console.log('Cleared existing study materials');

        // Add author to each study material
        const materialsWithAuthor = studyMaterialSeedData.map(material => ({
            ...material,
            author: adminUser._id
        }));

        // Insert new study materials
        const createdMaterials = await StudyMaterial.insertMany(materialsWithAuthor);
        console.log(`Created ${createdMaterials.length} study materials`);

        // Log summary
        const summary = {
            total: createdMaterials.length,
            free: createdMaterials.filter(m => m.type === 'Free').length,
            paid: createdMaterials.filter(m => m.type === 'Paid').length,
            byExamType: {}
        };

        createdMaterials.forEach(material => {
            summary.byExamType[material.examType] = (summary.byExamType[material.examType] || 0) + 1;
        });

        console.log('Study Materials Seed Summary:', summary);
        console.log('Study materials seeded successfully!');

    } catch (error) {
        console.error('Error seeding study materials:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run if called directly
if (require.main === module) {
    require('dotenv').config();
    seedStudyMaterials();
}

module.exports = { seedStudyMaterials, studyMaterialSeedData };