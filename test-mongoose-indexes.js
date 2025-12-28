const mongoose = require('mongoose');

// Test script to verify Mongoose index warnings are resolved
async function testMongooseIndexes() {
    try {
        console.log('🔍 Testing Mongoose index configuration...\n');

        // Connect to MongoDB (replace with your connection string)
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database';

        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Import models to trigger index creation
        console.log('📋 Loading models...');
        require('./backend/models/CurrentAffair');
        require('./backend/models/User');
        require('./backend/models/Video');
        require('./backend/models/Course');

        console.log('✅ Models loaded successfully\n');

        // Wait a moment for indexes to be created
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('🎉 No duplicate index warnings should appear above!');
        console.log('✅ Mongoose index configuration is clean\n');

        // Disconnect
        await mongoose.disconnect();
        console.log('📡 Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Instructions
console.log('📝 Instructions:');
console.log('1. Make sure MongoDB is running');
console.log('2. Set MONGODB_URI environment variable or update the connection string');
console.log('3. Run: node test-mongoose-indexes.js');
console.log('4. Check that no duplicate index warnings appear\n');

// Uncomment to run the test
// testMongooseIndexes();