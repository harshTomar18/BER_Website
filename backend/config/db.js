import mongoose from 'mongoose';
import { config } from './env.js';

let cachedConnection = null;

export const connectDB = async () => {
  // If already connected or connecting, return active connection
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    cachedConnection = conn;
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
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};
