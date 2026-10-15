import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitfuel';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    mongoose.set('bufferCommands', false);
    console.warn(`[MongoDB Notice] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.warn(`[MongoDB Notice] Operating with in-memory persistence fallback so server remains 100% operational.`);
    return null;
  }
};

export const isDbConnected = () => mongoose.connection.readyState === 1;
