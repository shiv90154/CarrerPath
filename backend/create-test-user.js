const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createTestUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if test user already exists
        const existingUser = await User.findOne({ email: 'test@example.com' });

        if (existingUser) {
            console.log('Test user already exists');
            process.exit(0);
        }

        // Create test user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const testUser = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
            phone: '9876543210',
            role: 'student',
            isVerified: true,
            profilePicture: '',
            dateOfBirth: new Date('1995-01-01'),
            address: {
                street: 'Test Street',
                city: 'Test City',
                state: 'Test State',
                pincode: '123456',
                country: 'India'
            },
            education: {
                qualification: 'Graduate',
                institution: 'Test University',
                yearOfPassing: 2020
            },
            preferences: {
                examCategories: ['UPSC'],
                subjects: ['General Studies'],
                studyGoals: ['Exam Preparation']
            }
        });

        await testUser.save();
        console.log('✅ Test user created successfully');
        console.log('Email: test@example.com');
        console.log('Password: password123');

    } catch (error) {
        console.error('❌ Error creating test user:', error);
    } finally {
        mongoose.connection.close();
    }
};

createTestUser();