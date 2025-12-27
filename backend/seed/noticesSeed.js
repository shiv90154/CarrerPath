const mongoose = require('mongoose');
const Notice = require('../models/Notice');
const User = require('../models/User');

const noticesSeedData = [
    {
        title: "UPSC Foundation Batch 2025 - Admissions Open",
        description: "New comprehensive UPSC foundation batch starting from 15th January 2025. Early bird discount of 30% available till 10th January.",
        content: "Our UPSC Foundation Batch 2025 is designed for serious aspirants who want to start their preparation from the basics. The course includes comprehensive coverage of all subjects, regular tests, and personalized mentoring. Limited seats available.",
        badge: "new",
        link: "/courses",
        category: "admission",
        priority: 3,
        targetAudience: "all",
        publishDate: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isPublished: true,
        isActive: true
    },
    {
        title: "Merit Scholarship Test - January 2025",
        description: "Merit-based scholarship test on 20th January 2025. Up to 50% scholarship available for deserving candidates.",
        content: "We are conducting a merit-based scholarship test for students who want to pursue competitive exam preparation but need financial assistance. The test will cover basic aptitude, general knowledge, and reasoning.",
        badge: "important",
        link: "/scholarship",
        category: "scholarship",
        priority: 3,
        targetAudience: "students",
        publishDate: new Date(),
        expiryDate: new Date('2025-01-20'),
        isPublished: true,
        isActive: true
    },
    {
        title: "Republic Day Holiday Notice",
        description: "Institute will remain closed on 26th January 2025 on account of Republic Day. Regular classes will resume from 27th January.",
        content: "All students are informed that the institute will remain closed on 26th January 2025 in observance of Republic Day. Online classes scheduled for this day are also cancelled and will be rescheduled.",
        badge: "urgent",
        link: "/holidays",
        category: "holiday",
        priority: 2,
        targetAudience: "all",
        publishDate: new Date(),
        expiryDate: new Date('2025-01-27'),
        isPublished: true,
        isActive: true
    },
    {
        title: "SSC CGL 2024 Results Declared",
        description: "SSC CGL 2024 preliminary examination results have been declared. Check your results and prepare for mains.",
        content: "The Staff Selection Commission has declared the results for CGL 2024 preliminary examination. Qualified candidates can now start preparing for the mains examination. We offer specialized mains preparation courses.",
        badge: "result",
        link: "/test-series",
        category: "result",
        priority: 2,
        targetAudience: "students",
        publishDate: new Date(),
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        isPublished: true,
        isActive: true
    },
    {
        title: "New Study Material Available",
        description: "Latest study materials for UPSC Prelims 2025 are now available. Download free sample chapters.",
        content: "We have updated our study materials with the latest syllabus and exam patterns. The materials include previous year questions, practice sets, and detailed explanations.",
        badge: "new",
        link: "/study-materials",
        category: "course",
        priority: 1,
        targetAudience: "students",
        publishDate: new Date(),
        expiryDate: null,
        isPublished: true,
        isActive: true
    },
    {
        title: "Live Mock Test Series Starting Soon",
        description: "Live mock test series for UPSC Prelims 2025 starting from 1st February. Register now for early bird pricing.",
        content: "Our live mock test series simulates the actual exam environment and provides detailed performance analysis. The series includes 20 full-length tests with comprehensive solutions.",
        badge: "live",
        link: "/test-series",
        category: "exam",
        priority: 2,
        targetAudience: "students",
        publishDate: new Date(),
        expiryDate: new Date('2025-02-01'),
        isPublished: true,
        isActive: true
    },
    {
        title: "Faculty Recruitment Drive",
        description: "We are hiring experienced faculty members for various subjects. Apply now if you have relevant teaching experience.",
        content: "Join our team of expert educators. We are looking for passionate teachers with proven track records in competitive exam preparation. Attractive compensation and growth opportunities available.",
        badge: "important",
        link: "/careers",
        category: "general",
        priority: 1,
        targetAudience: "all",
        publishDate: new Date(),
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        isPublished: true,
        isActive: true
    },
    {
        title: "Student Success Stories",
        description: "Read inspiring success stories of our students who cleared UPSC, SSC, and other competitive exams in 2024.",
        content: "We are proud to share the success stories of our students who achieved their dreams in 2024. Their journey and preparation strategies can inspire and guide current aspirants.",
        badge: "new",
        link: "/success-stories",
        category: "general",
        priority: 1,
        targetAudience: "all",
        publishDate: new Date(),
        expiryDate: null,
        isPublished: true,
        isActive: true
    }
];

const seedNotices = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding notices');

        // Find an admin user to assign as author
        let adminUser = await User.findOne({ role: 'admin' });

        if (!adminUser) {
            // Create a default admin user if none exists
            adminUser = await User.create({
                name: 'Notice Admin',
                email: 'notices@admin.com',
                password: 'admin123',
                role: 'admin',
                isActive: true,
                emailVerified: true
            });
            console.log('Created default admin user for notices');
        }

        // Clear existing notices
        await Notice.deleteMany({});
        console.log('Cleared existing notices');

        // Add author to each notice
        const noticesWithAuthor = noticesSeedData.map(notice => ({
            ...notice,
            author: adminUser._id,
            updatedBy: adminUser._id
        }));

        // Insert new notices
        const createdNotices = await Notice.insertMany(noticesWithAuthor);
        console.log(`Created ${createdNotices.length} notices`);

        // Log summary
        const summary = {
            total: createdNotices.length,
            published: createdNotices.filter(n => n.isPublished).length,
            byCategory: {},
            byBadge: {},
            byPriority: {}
        };

        createdNotices.forEach(notice => {
            summary.byCategory[notice.category] = (summary.byCategory[notice.category] || 0) + 1;
            summary.byBadge[notice.badge] = (summary.byBadge[notice.badge] || 0) + 1;
            summary.byPriority[notice.priority] = (summary.byPriority[notice.priority] || 0) + 1;
        });

        console.log('Notices Seed Summary:', summary);
        console.log('Notices seeded successfully!');

    } catch (error) {
        console.error('Error seeding notices:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run if called directly
if (require.main === module) {
    require('dotenv').config();
    seedNotices();
}

module.exports = { seedNotices, noticesSeedData };