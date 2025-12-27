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

// Create admin user
const createAdmin = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@careerpathway.com' });
        if (existingAdmin) {
            console.log('👤 Admin user already exists!');
            console.log('Email: admin@careerpathway.com');
            console.log('Password: admin123');
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin user
        const adminUser = new User({
            name: 'Career Pathway Admin',
            email: 'admin@careerpathway.com',
            phone: '9999999999',
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            isEmailVerified: true,

            // Personal Information
            dateOfBirth: new Date('1990-01-01'),
            gender: 'Male',

            // Address
            address: {
                street: 'Admin Office',
                city: 'Delhi',
                state: 'Delhi',
                pincode: '110001',
                country: 'India'
            },

            // Education
            education: {
                qualification: 'Master of Administration',
                institution: 'Career Pathway Institute',
                yearOfPassing: 2015,
                percentage: 95.0
            },

            // Preferences
            preferences: {
                examTypes: ['All'],
                subjects: ['Administration'],
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

        await adminUser.save();

        console.log('🎉 Admin user created successfully!');
        console.log('📧 Email: admin@careerpathway.com');
        console.log('🔑 Password: admin123');
        console.log('👤 Role: admin');
        console.log('✅ Status: Active & Email Verified');

    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Run the script
createAdmin();