const mongoose = require('mongoose');
require('dotenv').config();

// Test MongoDB connection
const testConnection = async () => {
    try {
        console.log('🔍 Testing MongoDB Connection...');
        console.log('📍 Connection String:', process.env.MONGO_URI ? 'Found' : 'Missing');

        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI environment variable is not set');
            process.exit(1);
        }

        // Simple connection without extra options
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log('✅ MongoDB Connected Successfully!');
        console.log(`📍 Host: ${conn.connection.host}`);
        console.log(`🗄️  Database: ${conn.connection.name}`);
        console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

        // Test a simple operation
        const collections = await conn.connection.db.listCollections().toArray();
        console.log(`📚 Collections found: ${collections.length}`);

        await mongoose.connection.close();
        console.log('🔌 Connection closed successfully');
        process.exit(0);

    } catch (error) {
        console.error('❌ MongoDB Connection Failed:');
        console.error(`   Error: ${error.message}`);

        if (error.message.includes('authentication failed')) {
            console.error('🔐 Authentication Issue:');
            console.error('   - Check username and password in connection string');
            console.error('   - Verify database user exists in MongoDB Atlas');
            console.error('   - Ensure user has proper permissions');
        }

        if (error.message.includes('ENOTFOUND')) {
            console.error('🌐 Network Issue:');
            console.error('   - Check internet connection');
            console.error('   - Verify cluster URL is correct');
        }

        process.exit(1);
    }
};

testConnection();