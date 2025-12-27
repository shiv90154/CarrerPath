const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('../models/User');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully!');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// Create student user
const createStudent = async () => {
    try {
        await connectDB();

        // Check if student already exists
        const existingStudent = await User.findOne({ email: 'student@test.com' });
        if (existingStudent) {
            console.log('👤 Student user already exists!');
            console.log('Email: student@test.com');
            console.log('Password: student123');
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('student123', salt);

        // Create student user
        const studentUser = new User({
            name: 'Test Student',
            email: 'student@test.com',
            phone: '9876543210',
            password: hashedPassword,
            role: 'student',
            isActive: true,
            isEmailVerified: true,

            // Personal Information
            dateOfBirth: new Date('1995-01-15'),
            gender: 'Male',

            // Address
            address: {
                street: '123 Student Street',
                city: 'Delhi',
                state: 'Delhi',
                pincode: '110001',
                country: 'India'
            },

            // Education
            education: {
                qualification: 'Bachelor of Arts',
                institution: 'Delhi University',
                yearOfPassing: 2020,
                percentage: 75.5
            },

            // Preferences
            preferences: {
                examTypes: ['UPSC', 'SSC'],
                subjects: ['General Studies', 'Current Affairs'],
                language: 'English',
                notifications: {
                    email: true,
                    sms: true,
                    push: true
                }
            },

            // Profile completion
            profileCompletion: 100,

            // Timestamps
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await studentUser.save();

        console.log('🎉 Student user created successfully!');
        console.log('📧 Email: student@test.com');
        console.log('🔑 Password: student123');
        console.log('👤 Role: student');
        console.log('✅ Status: Active & Email Verified');

    } catch (error) {
        console.error('❌ Error creating student:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Run the script
createStudent();