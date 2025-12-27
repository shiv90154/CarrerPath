const mongoose = require('mongoose');
const LiveTest = require('../models/LiveTest');
const Question = require('../models/Question');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully!');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

const fixAllIssues = async () => {
    try {
        await connectDB();

        console.log('🔧 Starting comprehensive fix...');

        // 1. Create/Update Admin User
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('👤 Creating admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            admin = new User({
                name: 'Career Pathway Admin',
                email: 'admin@careerpathway.com',
                phone: '9999999999',
                password: hashedPassword,
                role: 'admin',
                isActive: true,
                isEmailVerified: true
            });
            await admin.save();
            console.log('✅ Admin user created');
        }

        // 2. Create/Update Student User
        let student = await User.findOne({ email: 'student@test.com' });
        if (!student) {
            console.log('👤 Creating student user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('student123', salt);

            student = new User({
                name: 'Test Student',
                email: 'student@test.com',
                phone: '9876543210',
                password: hashedPassword,
                role: 'student',
                isActive: true,
                isEmailVerified: true
            });
            await student.save();
            console.log('✅ Student user created');
        }

        // 3. Clear and recreate Live Tests
        console.log('🗑️ Clearing existing live tests...');
        await LiveTest.deleteMany({});
        await Question.deleteMany({ liveTest: { $exists: true } });

        // 4. Create Live Tests with Questions
        console.log('📝 Creating live tests...');

        // Live Test 1: UPSC Mock Test
        const liveTest1 = new LiveTest({
            title: 'UPSC Prelims Mock Test - General Studies',
            description: 'Comprehensive UPSC Prelims mock test covering History, Geography, Polity, Economy, Environment, and Current Affairs. Perfect practice for UPSC aspirants.',
            startTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
            endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
            duration: 120, // 2 hours
            instructor: admin._id,
            questions: []
        });

        await liveTest1.save();

        // Create questions for Live Test 1
        const questions1 = [
            {
                questionText: 'Which of the following is the correct chronological order of the Mughal emperors?',
                options: [
                    { text: 'Babur → Humayun → Akbar → Jahangir → Shah Jahan → Aurangzeb', isCorrect: true },
                    { text: 'Babur → Akbar → Humayun → Jahangir → Shah Jahan → Aurangzeb', isCorrect: false },
                    { text: 'Humayun → Babur → Akbar → Jahangir → Shah Jahan → Aurangzeb', isCorrect: false },
                    { text: 'Babur → Humayun → Jahangir → Akbar → Shah Jahan → Aurangzeb', isCorrect: false }
                ],
                liveTest: liveTest1._id
            },
            {
                questionText: 'The Western Ghats are known for which type of forest?',
                options: [
                    { text: 'Tropical Deciduous Forest', isCorrect: false },
                    { text: 'Tropical Evergreen Forest', isCorrect: true },
                    { text: 'Mangrove Forest', isCorrect: false },
                    { text: 'Alpine Forest', isCorrect: false }
                ],
                liveTest: liveTest1._id
            },
            {
                questionText: 'Which Article of the Indian Constitution deals with the Right to Equality?',
                options: [
                    { text: 'Article 12-18', isCorrect: false },
                    { text: 'Article 14-18', isCorrect: true },
                    { text: 'Article 19-22', isCorrect: false },
                    { text: 'Article 23-24', isCorrect: false }
                ],
                liveTest: liveTest1._id
            }
        ];

        const savedQuestions1 = await Question.insertMany(questions1);
        liveTest1.questions = savedQuestions1.map(q => q._id);
        await liveTest1.save();

        // Live Test 2: SSC CGL Test
        const liveTest2 = new LiveTest({
            title: 'SSC CGL General Awareness Mock Test',
            description: 'Practice test for SSC CGL General Awareness section covering Indian History, Geography, Polity, Economy, General Science, and Current Affairs.',
            startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
            endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
            duration: 30, // 30 minutes
            instructor: admin._id,
            questions: []
        });

        await liveTest2.save();

        const questions2 = [
            {
                questionText: 'Who was the first President of India?',
                options: [
                    { text: 'Jawaharlal Nehru', isCorrect: false },
                    { text: 'Dr. Rajendra Prasad', isCorrect: true },
                    { text: 'Dr. A.P.J. Abdul Kalam', isCorrect: false },
                    { text: 'Dr. S. Radhakrishnan', isCorrect: false }
                ],
                liveTest: liveTest2._id
            },
            {
                questionText: 'Which planet is known as the Red Planet?',
                options: [
                    { text: 'Venus', isCorrect: false },
                    { text: 'Jupiter', isCorrect: false },
                    { text: 'Mars', isCorrect: true },
                    { text: 'Saturn', isCorrect: false }
                ],
                liveTest: liveTest2._id
            }
        ];

        const savedQuestions2 = await Question.insertMany(questions2);
        liveTest2.questions = savedQuestions2.map(q => q._id);
        await liveTest2.save();

        // Live Test 3: Banking Test
        const liveTest3 = new LiveTest({
            title: 'Banking Awareness Live Test - IBPS Preparation',
            description: 'Comprehensive banking awareness test covering Banking Terms, RBI Functions, Financial Institutions, and Current Banking Affairs.',
            startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
            endTime: new Date(Date.now() + 25 * 60 * 60 * 1000), // 25 hours from now
            duration: 45, // 45 minutes
            instructor: admin._id,
            questions: []
        });

        await liveTest3.save();

        const questions3 = [
            {
                questionText: 'What is the full form of NEFT?',
                options: [
                    { text: 'National Electronic Fund Transfer', isCorrect: false },
                    { text: 'National Electronic Funds Transfer', isCorrect: true },
                    { text: 'New Electronic Fund Transfer', isCorrect: false },
                    { text: 'Net Electronic Fund Transfer', isCorrect: false }
                ],
                liveTest: liveTest3._id
            },
            {
                questionText: 'The Reserve Bank of India was established in which year?',
                options: [
                    { text: '1934', isCorrect: false },
                    { text: '1935', isCorrect: true },
                    { text: '1936', isCorrect: false },
                    { text: '1937', isCorrect: false }
                ],
                liveTest: liveTest3._id
            }
        ];

        const savedQuestions3 = await Question.insertMany(questions3);
        liveTest3.questions = savedQuestions3.map(q => q._id);
        await liveTest3.save();

        console.log('🎉 All Issues Fixed Successfully!');
        console.log('');
        console.log('✅ Created Users:');
        console.log('   👤 Admin: admin@careerpathway.com / admin123');
        console.log('   👤 Student: student@test.com / student123');
        console.log('');
        console.log('✅ Created Live Tests:');
        console.log('   📝 UPSC Prelims Mock Test (3 questions)');
        console.log('   📝 SSC CGL General Awareness (2 questions)');
        console.log('   📝 Banking Awareness Test (2 questions)');
        console.log('');
        console.log('📅 Test Schedule:');
        console.log(`   🕐 Test 1: ${liveTest1.startTime.toLocaleString()}`);
        console.log(`   🕐 Test 2: ${liveTest2.startTime.toLocaleString()}`);
        console.log(`   🕐 Test 3: ${liveTest3.startTime.toLocaleString()}`);
        console.log('');
        console.log('🚀 System Ready for Testing!');

    } catch (error) {
        console.error('❌ Error fixing issues:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Run the fix
fixAllIssues();