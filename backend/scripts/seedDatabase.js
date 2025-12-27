const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Course = require('../models/Course');
const TestSeries = require('../models/TestSeries');
const Ebook = require('../models/Ebook');
const StudyMaterial = require('../models/StudyMaterial');
const Notice = require('../models/Notice');
const CurrentAffair = require('../models/CurrentAffair');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for seeding');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await User.deleteMany({});
        await Course.deleteMany({});
        await TestSeries.deleteMany({});
        await Ebook.deleteMany({});
        await StudyMaterial.deleteMany({});
        await Notice.deleteMany({});
        await CurrentAffair.deleteMany({});

        // Create admin user
        console.log('👤 Creating admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 12);
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@careerpathway.com',
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            isEmailVerified: true,
            phone: '9876543210',
            address: {
                street: 'Career Pathway Institute',
                city: 'Shimla',
                state: 'Himachal Pradesh',
                pincode: '171001',
                country: 'India'
            }
        });

        // Create sample student
        console.log('👨‍🎓 Creating sample student...');
        const studentPassword = await bcrypt.hash('student123', 12);
        const studentUser = await User.create({
            name: 'John Doe',
            email: 'student@example.com',
            password: studentPassword,
            role: 'student',
            isActive: true,
            isEmailVerified: true,
            phone: '9876543211',
            address: {
                street: '123 Student Street',
                city: 'Shimla',
                state: 'Himachal Pradesh',
                pincode: '171002',
                country: 'India'
            }
        });

        // Create sample courses
        console.log('📚 Creating sample courses...');
        const courses = [
            {
                title: 'Complete IAS Preparation Course',
                description: 'Comprehensive UPSC Civil Services preparation with expert guidance',
                price: 75000,
                originalPrice: 100000,
                category: 'UPSC',
                level: 'Advanced',
                duration: '12 months',
                language: 'Hindi/English',
                instructor: adminUser._id,
                tags: ['IAS', 'UPSC', 'Civil Services', 'Government Jobs'],
                isFeatured: true,
                isActive: true,
                videos: []
            },
            {
                title: 'SSC CGL Complete Course',
                description: 'Complete preparation for SSC Combined Graduate Level examination',
                price: 35000,
                originalPrice: 50000,
                category: 'SSC',
                level: 'Intermediate',
                duration: '8 months',
                language: 'Hindi/English',
                instructor: adminUser._id,
                tags: ['SSC', 'CGL', 'Government Jobs'],
                isFeatured: true,
                isActive: true,
                videos: []
            }
        ];

        const createdCourses = await Course.insertMany(courses);

        // Create sample test series
        console.log('📝 Creating sample test series...');
        const testSeries = [
            {
                title: 'UPSC Prelims Mock Test Series 2024',
                description: 'Complete mock test series for UPSC Prelims preparation',
                price: 5000,
                originalPrice: 7500,
                category: 'UPSC',
                level: 'Advanced',
                duration: '6 months',
                language: 'English',
                totalTests: 25,
                instructor: adminUser._id,
                tags: ['UPSC', 'Prelims', 'Mock Tests'],
                isFeatured: true,
                isActive: true,
                tests: []
            },
            {
                title: 'SSC CGL Practice Tests',
                description: 'Comprehensive practice tests for SSC CGL preparation',
                price: 2500,
                originalPrice: 4000,
                category: 'SSC',
                level: 'Intermediate',
                duration: '4 months',
                language: 'Hindi',
                totalTests: 15,
                instructor: adminUser._id,
                tags: ['SSC', 'CGL', 'Practice Tests'],
                isFeatured: false,
                isActive: true,
                tests: []
            }
        ];

        const createdTestSeries = await TestSeries.insertMany(testSeries);

        // Create sample ebooks
        console.log('📖 Creating sample ebooks...');
        const ebooks = [
            {
                title: 'Complete Guide to Indian Polity',
                description: 'Comprehensive guide covering all aspects of Indian Political System',
                price: 500,
                originalPrice: 800,
                category: 'UPSC',
                level: 'Intermediate',
                language: 'English',
                author: 'Career Pathway Team',
                pages: 450,
                fileSize: '15 MB',
                format: 'PDF',
                tags: ['Polity', 'Constitution', 'UPSC'],
                isFeatured: true,
                isActive: true
            },
            {
                title: 'Mathematics for SSC Exams',
                description: 'Complete mathematics preparation book for SSC examinations',
                price: 300,
                originalPrice: 500,
                category: 'SSC',
                level: 'Beginner',
                language: 'Hindi',
                author: 'Math Expert Team',
                pages: 350,
                fileSize: '12 MB',
                format: 'PDF',
                tags: ['Mathematics', 'SSC', 'Quantitative Aptitude'],
                isFeatured: false,
                isActive: true
            }
        ];

        const createdEbooks = await Ebook.insertMany(ebooks);

        // Create sample study materials
        console.log('📑 Creating sample study materials...');
        const studyMaterials = [
            {
                title: 'Current Affairs Monthly Compilation - January 2024',
                description: 'Complete current affairs compilation for competitive exams',
                price: 200,
                originalPrice: 300,
                examType: 'UPSC',
                subject: 'Current Affairs',
                year: 2024,
                month: 'January',
                language: 'English',
                fileSize: '8 MB',
                format: 'PDF',
                tags: ['Current Affairs', 'Monthly', 'UPSC'],
                isActive: true
            },
            {
                title: 'English Grammar Notes for Banking Exams',
                description: 'Comprehensive English grammar notes for banking examinations',
                price: 150,
                originalPrice: 250,
                examType: 'Banking',
                subject: 'English',
                year: 2024,
                language: 'English',
                fileSize: '5 MB',
                format: 'PDF',
                tags: ['English', 'Grammar', 'Banking'],
                isActive: true
            }
        ];

        const createdStudyMaterials = await StudyMaterial.insertMany(studyMaterials);

        // Create sample notices
        console.log('📢 Creating sample notices...');
        const notices = [
            {
                title: 'New Batch Starting for IAS Preparation',
                description: 'We are starting a new batch for IAS preparation from February 1st, 2024',
                content: 'Join our comprehensive IAS preparation program with expert faculty and proven methodology.',
                badge: 'new',
                category: 'admission',
                priority: 3,
                targetAudience: 'all',
                publishDate: new Date(),
                isPublished: true,
                isActive: true,
                author: adminUser._id,
                updatedBy: adminUser._id
            },
            {
                title: 'Free Demo Classes Available',
                description: 'Book your free demo class for any course and experience our teaching methodology',
                content: 'We offer free demo classes for all our courses. Book now to get a taste of our expert teaching.',
                badge: 'important',
                category: 'general',
                priority: 2,
                targetAudience: 'students',
                publishDate: new Date(),
                isPublished: true,
                isActive: true,
                author: adminUser._id,
                updatedBy: adminUser._id
            }
        ];

        const createdNotices = await Notice.insertMany(notices);

        // Create sample current affairs
        console.log('📰 Creating sample current affairs...');
        const currentAffairs = [
            {
                title: 'Important Government Schemes Update',
                content: 'Latest updates on government schemes and their impact on competitive examinations.',
                category: 'Government Schemes',
                tags: ['Government', 'Schemes', 'Policy'],
                date: new Date(),
                isPublished: true,
                isActive: true,
                author: adminUser._id,
                updatedBy: adminUser._id
            },
            {
                title: 'Economic Survey Highlights',
                content: 'Key highlights from the latest Economic Survey and their relevance for UPSC preparation.',
                category: 'Economy',
                tags: ['Economy', 'Survey', 'UPSC'],
                date: new Date(),
                isPublished: true,
                isActive: true,
                author: adminUser._id,
                updatedBy: adminUser._id
            }
        ];

        const createdCurrentAffairs = await CurrentAffair.insertMany(currentAffairs);

        console.log('✅ Database seeding completed successfully!');
        console.log(`📊 Seeded Data Summary:`);
        console.log(`   👤 Users: ${2} (1 admin, 1 student)`);
        console.log(`   📚 Courses: ${createdCourses.length}`);
        console.log(`   📝 Test Series: ${createdTestSeries.length}`);
        console.log(`   📖 Ebooks: ${createdEbooks.length}`);
        console.log(`   📑 Study Materials: ${createdStudyMaterials.length}`);
        console.log(`   📢 Notices: ${createdNotices.length}`);
        console.log(`   📰 Current Affairs: ${createdCurrentAffairs.length}`);
        console.log('');
        console.log('🔐 Login Credentials:');
        console.log('   Admin: admin@careerpathway.com / admin123');
        console.log('   Student: student@example.com / student123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
};

// Run seeding
connectDB().then(() => {
    seedDatabase();
});