const mongoose = require('mongoose');
const Course = require('./models/Course');
const StudyMaterial = require('./models/StudyMaterial');
const Ebook = require('./models/Ebook');
const TestSeries = require('./models/TestSeries');
require('dotenv').config();

const createFreeContent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Create free course
        const freeCourse = new Course({
            title: 'Free UPSC Foundation Course',
            description: 'A comprehensive foundation course for UPSC preparation - completely free!',
            fullDescription: 'This free course covers all the basics of UPSC preparation including syllabus overview, study strategy, and important topics.',
            price: 0,
            originalPrice: 999,
            image: 'https://via.placeholder.com/300x200?text=Free+Course',
            category: 'UPSC',
            level: 'Beginner',
            duration: 30,
            language: 'English',
            instructor: {
                name: 'Dr. UPSC Expert',
                bio: 'Experienced UPSC mentor',
                image: 'https://via.placeholder.com/100x100?text=Instructor'
            },
            videos: [
                {
                    title: 'Introduction to UPSC',
                    description: 'Overview of UPSC exam pattern',
                    duration: 15,
                    videoUrl: 'https://example.com/video1.mp4',
                    isFree: true,
                    isPreview: true,
                    order: 1
                },
                {
                    title: 'UPSC Syllabus Breakdown',
                    description: 'Detailed syllabus analysis',
                    duration: 20,
                    videoUrl: 'https://example.com/video2.mp4',
                    isFree: true,
                    order: 2
                }
            ],
            tags: ['UPSC', 'Free', 'Foundation'],
            requirements: ['Basic understanding of current affairs'],
            whatYouWillLearn: [
                'UPSC exam pattern and structure',
                'Effective study strategies',
                'Time management techniques'
            ],
            isFeatured: true,
            discountPercentage: 100
        });

        await freeCourse.save();
        console.log('✅ Free course created');

        // Create free study material
        const freeStudyMaterial = new StudyMaterial({
            title: 'Free UPSC Previous Year Papers',
            description: 'Collection of previous year question papers for UPSC preparation',
            year: 2023,
            examType: 'UPSC',
            subject: 'General Studies',
            type: 'Free',
            price: 0,
            coverImage: 'https://via.placeholder.com/300x400?text=Free+Study+Material',
            fileUrl: 'https://example.com/free-papers.pdf',
            pages: 150,
            language: 'English',
            author: 'UPSC Experts',
            downloads: 0
        });

        await freeStudyMaterial.save();
        console.log('✅ Free study material created');

        // Create free ebook
        const freeEbook = new Ebook({
            title: 'Free UPSC Preparation Guide',
            description: 'Complete guide for UPSC preparation - absolutely free!',
            fullDescription: 'This comprehensive ebook covers all aspects of UPSC preparation including study plan, important topics, and exam strategies.',
            price: 0,
            originalPrice: 299,
            coverImage: 'https://via.placeholder.com/300x400?text=Free+Ebook',
            isFree: true,
            category: 'UPSC',
            language: 'English',
            pages: 200,
            fileSize: '5 MB',
            format: 'PDF',
            publishedDate: new Date(),
            tags: ['UPSC', 'Free', 'Preparation Guide'],
            author: {
                name: 'UPSC Mentors',
                bio: 'Team of experienced UPSC mentors'
            },
            fileUrl: 'https://example.com/free-ebook.pdf',
            previewUrl: 'https://example.com/free-ebook-preview.pdf',
            isFeatured: true,
            discountPercentage: 100
        });

        await freeEbook.save();
        console.log('✅ Free ebook created');

        // Create test series with free tests
        const testSeries = new TestSeries({
            title: 'UPSC Mock Test Series',
            description: 'Comprehensive test series for UPSC preparation with some free tests',
            fullDescription: 'This test series includes both free and premium tests to help you prepare for UPSC.',
            price: 499,
            originalPrice: 999,
            image: 'https://via.placeholder.com/300x200?text=Test+Series',
            category: 'UPSC',
            level: 'Intermediate',
            duration: 180,
            language: 'English',
            instructor: {
                name: 'Test Expert',
                bio: 'Expert in creating mock tests'
            },
            tests: [
                {
                    title: 'Free Mock Test 1',
                    description: 'Free practice test for UPSC',
                    duration: 120,
                    totalQuestions: 50,
                    isFree: true,
                    questions: []
                },
                {
                    title: 'Premium Mock Test 1',
                    description: 'Premium practice test for UPSC',
                    duration: 180,
                    totalQuestions: 100,
                    isFree: false,
                    questions: []
                }
            ],
            totalTests: 2,
            totalQuestions: 150,
            tags: ['UPSC', 'Mock Tests'],
            discountPercentage: 50
        });

        await testSeries.save();
        console.log('✅ Test series with free tests created');

        console.log('\n🎉 All free content created successfully!');

    } catch (error) {
        console.error('❌ Error creating free content:', error);
    } finally {
        mongoose.connection.close();
    }
};

createFreeContent();