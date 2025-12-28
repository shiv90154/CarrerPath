const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createTestAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Delete existing test admin if exists
        await User.deleteOne({ email: 'testadmin@example.com' });

        // Create new test admin with known credentials
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('testadmin123', salt);

        const testAdmin = new User({
            name: 'Test Admin',
            email: 'testadmin@example.com',
            phone: '1234567890',
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            emailVerified: true,
            phoneVerified: true
        });

        await testAdmin.save();
        console.log('✅ Test admin user created successfully!');
        console.log('   Email: testadmin@example.com');
        console.log('   Password: testadmin123');
        console.log('   Role: admin');

    } catch (error) {
        console.error('❌ Error creating test admin:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

createTestAdmin();