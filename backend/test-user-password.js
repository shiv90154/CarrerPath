const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testUserPassword = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find the test admin user
        const user = await User.findOne({ email: 'testadmin@example.com' });

        if (!user) {
            console.log('❌ Test admin user not found');
            return;
        }

        console.log('✅ Test admin user found:');
        console.log('   Name:', user.name);
        console.log('   Email:', user.email);
        console.log('   Role:', user.role);
        console.log('   Active:', user.isActive);

        // Test password matching
        const isMatch = await user.matchPassword('testadmin123');
        console.log('   Password match test:', isMatch ? '✅ Success' : '❌ Failed');

        if (!isMatch) {
            console.log('   Stored password hash:', user.password);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

testUserPassword();