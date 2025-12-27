const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlas connection options (updated for latest Mongoose)
    const options = {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain a minimum of 5 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    console.log('Connecting to MongoDB Atlas...');
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
      console.error('❌ Mongoose connection error:', err);
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

    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed. Please check your username and password.');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Network error. Please check your internet connection.');
    } else if (error.message.includes('MongoServerSelectionError')) {
      console.error('🔍 Server selection error. Please check your MongoDB Atlas cluster status.');
    }

    console.error('💡 Troubleshooting tips:');
    console.error('   1. Verify your MongoDB Atlas connection string');
    console.error('   2. Check if your IP address is whitelisted');
    console.error('   3. Ensure your database user has proper permissions');
    console.error('   4. Verify your internet connection');

    process.exit(1);
  }
};

module.exports = connectDB;

