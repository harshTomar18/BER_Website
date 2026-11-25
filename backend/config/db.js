import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ [MongoDB Atlas] Connected: ${conn.connection.host}`);
    console.log(`📂 [Database] Active: ${conn.connection.name}`);

    // Connection lifecycle listeners
    mongoose.connection.on('error', (err) => {
      console.error(`❌ [MongoDB Error]: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [MongoDB Warning]: Connection disconnected. Attempting reconnect...');
    });

    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB Fatal]: Failed to connect to MongoDB Atlas: ${error.message}`);
    process.exit(1);
  }
};
