const mongoose = require("mongoose");
const dotenv = require("dotenv");
const TestSeries = require("../models/TestSeries");
const Test = require("../models/Test");
const Question = require("../models/Question");
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
const seedTestSeries = async () => {
    try {
        await connectDB();

        // Clear old data
        await TestSeries.deleteMany();
        await Test.deleteMany();
        await Question.deleteMany();

        // Get admin/instructor user
        const adminUser = await User.findOne({ role: "admin" });

        if (!adminUser) {
            console.log("Admin user not found. Create admin first.");
            process.exit(1);
        }

        // Sample questions for tests
        const sampleQuestions = [
            {
                questionText: "What is the capital of India?",
                options: [
                    { text: "Mumbai", isCorrect: false },
                    { text: "New Delhi", isCorrect: true },
                    { text: "Kolkata", isCorrect: false },
                    { text: "Chennai", isCorrect: false }
                ]
            },
            {
                questionText: "Who is known as the Father of the Nation in India?",
                options: [
                    { text: "Jawaharlal Nehru", isCorrect: false },
                    { text: "Mahatma Gandhi", isCorrect: true },
                    { text: "Sardar Patel", isCorrect: false },
                    { text: "Dr. APJ Abdul Kalam", isCorrect: false }
                ]
            },
            {
                questionText: "Which is the longest river in India?",
                options: [
                    { text: "Yamuna", isCorrect: false },
                    { text: "Ganga", isCorrect: true },
                    { text: "Godavari", isCorrect: false },
                    { text: "Krishna", isCorrect: false }
                ]
            }
        ];

        const testSeriesData = [
            {
                title: "UPSC Prelims Complete Test Series",
                description: "Comprehensive test series for UPSC Civil Services Prelims",
                fullDescription: "This test series covers all subjects of UPSC Prelims including History, Geography, Polity, Economy, Science & Technology, and Current Affairs. Each test is designed as per the latest UPSC pattern with detailed explanations.",
                price: 2999,
                originalPrice: 4999,
                image: "/images/test-series/upsc-prelims.jpg",
                category: "UPSC",
                level: "Advanced",
                duration: "6 months",
                language: "English",
                tags: ["UPSC", "Prelims", "Civil Services", "Mock Tests"],
                requirements: ["Basic knowledge of UPSC syllabus", "12th pass or equivalent"],
                whatYouWillLearn: [
                    "Complete UPSC Prelims syllabus coverage",
                    "Time management skills",
                    "Answer writing techniques",
                    "Current affairs updates"
                ],
                instructor: adminUser._id,
                isFeatured: true,
                tests: [
                    {
                        title: "UPSC Prelims Mock Test 1 - FREE",
                        description: "Free sample test covering basic GS topics",
                        duration: 120,
                        totalQuestions: 100,
                        maxMarks: 200,
                        difficulty: "Medium",
                        isFree: true,
                        order: 1
                    },
                    {
                        title: "UPSC Prelims Mock Test 2",
                        description: "Advanced test with current affairs focus",
                        duration: 120,
                        totalQuestions: 100,
                        maxMarks: 200,
                        difficulty: "Hard",
                        isFree: false,
                        order: 2
                    },
                    {
                        title: "UPSC Prelims Mock Test 3",
                        description: "Subject-wise comprehensive test",
                        duration: 120,
                        totalQuestions: 100,
                        maxMarks: 200,
                        difficulty: "Medium",
                        isFree: false,
                        order: 3
                    }
                ]
            },
            {
                title: "SSC CGL Complete Test Series",
                description: "Complete test series for SSC CGL Tier-1 and Tier-2",
                fullDescription: "Comprehensive test series covering Quantitative Aptitude, General Intelligence, English Language, and General Awareness for SSC CGL examination.",
                price: 1499,
                originalPrice: 2499,
                image: "/images/test-series/ssc-cgl.jpg",
                category: "SSC",
                level: "Intermediate",
                duration: "4 months",
                language: "English",
                tags: ["SSC", "CGL", "Government Jobs"],
                requirements: ["12th pass", "Basic mathematics knowledge"],
                whatYouWillLearn: [
                    "Complete SSC CGL syllabus",
                    "Speed and accuracy improvement",
                    "Shortcut techniques",
                    "Previous year analysis"
                ],
                instructor: adminUser._id,
                isFeatured: false,
                tests: [
                    {
                        title: "SSC CGL Mock Test 1 - FREE",
                        description: "Free sample test for SSC CGL preparation",
                        duration: 60,
                        totalQuestions: 100,
                        maxMarks: 200,
                        difficulty: "Easy",
                        isFree: true,
                        order: 1
                    },
                    {
                        title: "SSC CGL Mock Test 2",
                        description: "Quantitative Aptitude focused test",
                        duration: 60,
                        totalQuestions: 25,
                        maxMarks: 50,
                        difficulty: "Medium",
                        isFree: false,
                        order: 2
                    }
                ]
            },
            {
                title: "Banking Exam Test Series",
                description: "Complete test series for Bank PO, Clerk, and SO exams",
                fullDescription: "Comprehensive test series covering all banking exams including SBI, IBPS, RBI with focus on Quantitative Aptitude, Reasoning, English, and Banking Awareness.",
                price: 999,
                originalPrice: 1999,
                image: "/images/test-series/banking.jpg",
                category: "Banking",
                level: "Intermediate",
                duration: "3 months",
                language: "English",
                tags: ["Banking", "SBI", "IBPS", "RBI"],
                requirements: ["Graduation", "Basic banking knowledge"],
                whatYouWillLearn: [
                    "Banking exam patterns",
                    "Quantitative techniques",
                    "Banking awareness",
                    "Current affairs for banking"
                ],
                instructor: adminUser._id,
                isFeatured: false,
                tests: [
                    {
                        title: "Banking Mock Test 1 - FREE",
                        description: "Free sample banking exam test",
                        duration: 45,
                        totalQuestions: 50,
                        maxMarks: 50,
                        difficulty: "Easy",
                        isFree: true,
                        order: 1
                    }
                ]
            },
            {
                title: "Current Affairs Monthly Tests",
                description: "Monthly current affairs tests for all competitive exams",
                fullDescription: "Stay updated with monthly current affairs tests covering national, international, sports, awards, and government schemes relevant for all competitive examinations.",
                price: 0,
                originalPrice: 0,
                image: "/images/test-series/current-affairs.jpg",
                category: "Current Affairs",
                level: "Beginner",
                duration: "1 month",
                language: "English",
                tags: ["Current Affairs", "Monthly", "Free"],
                requirements: ["None"],
                whatYouWillLearn: [
                    "Latest current affairs",
                    "Monthly updates",
                    "Exam-relevant facts",
                    "Quick revision notes"
                ],
                instructor: adminUser._id,
                isFeatured: false,
                tests: [
                    {
                        title: "January 2024 Current Affairs",
                        description: "Current affairs test for January 2024",
                        duration: 30,
                        totalQuestions: 50,
                        maxMarks: 50,
                        difficulty: "Easy",
                        isFree: true,
                        order: 1
                    },
                    {
                        title: "February 2024 Current Affairs",
                        description: "Current affairs test for February 2024",
                        duration: 30,
                        totalQuestions: 50,
                        maxMarks: 50,
                        difficulty: "Easy",
                        isFree: true,
                        order: 2
                    }
                ]
            }
        ];

        // Create test series with tests and questions
        for (const seriesData of testSeriesData) {
            const { tests, ...testSeriesInfo } = seriesData;

            // Create test series
            const testSeries = new TestSeries(testSeriesInfo);
            const savedTestSeries = await testSeries.save();

            // Create tests for this series
            for (const testData of tests) {
                const test = new Test({
                    ...testData,
                    testSeries: savedTestSeries._id
                });
                const savedTest = await test.save();

                // Create sample questions for each test
                for (const questionData of sampleQuestions) {
                    const question = new Question({
                        ...questionData,
                        test: savedTest._id
                    });
                    const savedQuestion = await question.save();
                    savedTest.questions.push(savedQuestion._id);
                }

                // Update test with questions and total questions
                savedTest.totalQuestions = sampleQuestions.length;
                await savedTest.save();

                // Add test to test series
                savedTestSeries.tests.push(savedTest._id);
            }

            // Update test series with total counts
            savedTestSeries.totalTests = tests.length;
            savedTestSeries.totalQuestions = tests.length * sampleQuestions.length;
            await savedTestSeries.save();

            console.log(`Created test series: ${savedTestSeries.title}`);
        }

        console.log("Test series seeded successfully");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedTestSeries();