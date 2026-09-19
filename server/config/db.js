const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/time_tracking_db';
  
  try {
    // Attempt standard connection with 3s timeout to test availability
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Local MongoDB connection failed (${error.message}).`);
    console.log(`[MongoDB] Starting In-Memory MongoDB Server for fallback...`);
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB] In-Memory Database running at: ${memoryUri}`);
    } catch (memErr) {
      console.error(`[MongoDB] Critical Database Connection Error:`, memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
