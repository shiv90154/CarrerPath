const mongoose = require('mongoose');
const LiveTest = require('../models/LiveTest');
const Question = require('../models/Question');
const User = require('../models/User');
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

const seedLiveTests = async () => {
    try {
        await connectDB();

        // Clear existing live tests and questions
        await LiveTest.deleteMany({});
        await Question.deleteMany({ liveTest: { $exists: true } });
        console.log('🗑️ Cleared existing live tests and questions');

        // Find or create an admin user as instructor
        let instructor = await User.findOne({ role: 'admin' });
        if (!instructor) {
            console.log('⚠️ No admin user found. Please create an admin user first.');
            return;
        }

        // Live Test 1: UPSC Mock Test
        const liveTest1 = new LiveTest({
            title: 'UPSC Prelims Mock Test - General Studies',
            description: 'Comprehensive UPSC Prelims mock test covering History, Geography, Polity, Economy, Environment, and Current Affairs. Perfect practice for UPSC aspirants.',
            startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
            duration: 120, // 2 hours
            instructor: instructor._id,
            questions: []
        });

        // Live Test 2: SSC CGL Test
        const liveTest2 = new LiveTest({
            title: 'SSC CGL General Awareness Mock Test',
            description: 'Practice test for SSC CGL General Awareness section covering Indian History, Geography, Polity, Economy, General Science, and Current Affairs.',
            startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
            endTime: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
            duration: 30, // 30 minutes
            instructor: instructor._id,
            questions: []
        });

        // Live Test 3: Banking Test
        const liveTest3 = new LiveTest({
            title: 'Banking Awareness Live Test - IBPS Preparation',
            description: 'Comprehensive banking awareness test covering Banking Terms, RBI Functions, Financial Institutions, and Current Banking Affairs.',
            startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
            endTime: new Date(Date.now() + 25 * 60 * 60 * 1000), // 25 hours from now
            duration: 45, // 45 minutes
            instructor: instructor._id,
            questions: []
        });

        // Save live tests
        await liveTest1.save();
        await liveTest2.save();
        await liveTest3.save();

        // Create questions for each test
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

        // Save all questions
        const allQuestions = [...questions1, ...questions2, ...questions3];
        const savedQuestions = await Question.insertMany(allQuestions);

        // Update live tests with question references
        const test1Questions = savedQuestions.filter(q => q.liveTest.toString() === liveTest1._id.toString());
        const test2Questions = savedQuestions.filter(q => q.liveTest.toString() === liveTest2._id.toString());
        const test3Questions = savedQuestions.filter(q => q.liveTest.toString() === liveTest3._id.toString());

        liveTest1.questions = test1Questions.map(q => q._id);
        liveTest2.questions = test2Questions.map(q => q._id);
        liveTest3.questions = test3Questions.map(q => q._id);

        await liveTest1.save();
        await liveTest2.save();
        await liveTest3.save();

        console.log('🎉 Live Tests Seeded Successfully!');
        console.log('📊 Created 3 Live Tests:');
        console.log('   1. UPSC Prelims Mock Test (120 min, 3 questions)');
        console.log('   2. SSC CGL General Awareness (30 min, 2 questions)');
        console.log('   3. Banking Awareness Test (45 min, 2 questions)');
        console.log('📝 Total Questions Created:', savedQuestions.length);
        console.log('👨‍🏫 Instructor:', instructor.name);

        // Display schedule
        console.log('\n📅 Test Schedule:');
        console.log(`   Test 1: ${liveTest1.startTime.toLocaleString()}`);
        console.log(`   Test 2: ${liveTest2.startTime.toLocaleString()}`);
        console.log(`   Test 3: ${liveTest3.startTime.toLocaleString()}`);

    } catch (error) {
        console.error('❌ Error seeding live tests:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Run the seeding
seedLiveTests();