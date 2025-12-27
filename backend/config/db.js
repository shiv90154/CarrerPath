const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔍 Connecting to MongoDB Atlas...');

    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    // Simplified connection options for better compatibility
    const options = {
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10 seconds
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1, // Reduce minimum pool size
      maxIdleTimeMS: 30000
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB Atlas');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📴 Mongoose disconnected from MongoDB Atlas');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error(`   Message: ${error.message}`);

    // Specific error handling
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed:');
      console.error('   - Username: shiva90154_db_user');
      console.error('   - Check password in connection string');
      console.error('   - Verify user exists in MongoDB Atlas Database Access');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Network error:');
      console.error('   - Check internet connection');
      console.error('   - Verify cluster URL: cluster0.egk6uuf.mongodb.net');
    } else if (error.message.includes('MongoServerSelectionError')) {
      console.error('🔍 Server selection error:');
      console.error('   - Check MongoDB Atlas cluster status');
      console.error('   - Verify IP whitelist includes 0.0.0.0/0');
    }

    console.error('💡 Connection String Format:');
    console.error('   mongodb+srv://username:password@cluster0.egk6uuf.mongodb.net/database?options');

    process.exit(1);
  }
};

module.exports = connectDB;

