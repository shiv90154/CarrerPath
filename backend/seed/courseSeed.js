const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const User = require('../models/User');

dotenv.config();

/**
 * MongoDB Connection
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Failed', error);
    process.exit(1);
  }
};

/**
 * Course Seeder
 */
const seedCourses = async () => {
  try {
    await connectDB();

    // Find an instructor or admin
    const instructor = await User.findOne({
      role: { $in: ['admin', 'instructor'] }
    });

    if (!instructor) {
      console.error('No instructor/admin found. Create one first.');
      process.exit(1);
    }

    // Optional: Clear existing courses
    await Course.deleteMany();

    const courses = [
      {
        title: 'UPSC Civil Services Foundation',
        description: 'Complete foundation course for UPSC IAS preparation.',
        fullDescription:
          'This course covers GS Paper I–IV, current affairs, answer writing, and interview guidance.',
        price: 14999,
        originalPrice: 19999,
        image: '/images/upsc.jpg',
        category: 'Civil Services',
        level: 'Beginner',
        duration: '12 months',
        language: 'English',
        tags: ['UPSC', 'IAS', 'GS'],
        requirements: ['Basic graduation level knowledge'],
        whatYouWillLearn: [
          'UPSC syllabus in-depth',
          'Answer writing techniques',
          'Current affairs analysis'
        ],
        instructor: instructor._id,
        isFeatured: true
      },
      {
        title: 'SSC CGL Complete Course',
        description: 'Crack SSC CGL with structured preparation.',
        fullDescription:
          'Quantitative aptitude, reasoning, English, and GK with practice tests.',
        price: 8999,
        originalPrice: 12999,
        image: '/images/ssc.jpg',
        category: 'SSC',
        level: 'Intermediate',
        duration: '6 months',
        language: 'Hindi',
        tags: ['SSC', 'CGL'],
        requirements: ['10+2 qualification'],
        whatYouWillLearn: [
          'Math shortcuts',
          'Reasoning tricks',
          'Previous year questions'
        ],
        instructor: instructor._id
      },
      {
        title: 'Banking Exam Mastery',
        description: 'IBPS & SBI PO/Clerk full preparation.',
        fullDescription:
          'Concept-based learning with mock tests and sectional practice.',
        price: 7999,
        originalPrice: 10999,
        image: '/images/banking.jpg',
        category: 'Banking',
        level: 'Beginner',
        duration: '5 months',
        language: 'English',
        tags: ['Banking', 'IBPS', 'SBI'],
        requirements: ['Basic math and English'],
        whatYouWillLearn: [
          'Banking aptitude',
          'Speed & accuracy',
          'Exam strategy'
        ],
        instructor: instructor._id
      }
    ];

    await Course.insertMany(courses);

    console.log('Courses Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Course Seeding Failed', error);
    process.exit(1);
  }
};

seedCourses();
