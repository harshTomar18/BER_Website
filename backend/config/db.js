import mongoose from 'mongoose';
import { config } from './env.js';

let cachedConn = null;
let cachedPromise = null;

export const connectDB = async () => {
  // If already connected, return active connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!config.mongoUri) {
    console.warn('⚠️ [MongoDB Warning]: MONGODB_URI is not set. In Vercel, add MONGODB_URI in Project Settings > Environment Variables.');
    return null;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  try {
    cachedPromise = mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false, // Prevents queries from hanging/buffering when offline
    });

    const conn = await cachedPromise;
    cachedConn = conn;
    console.log(`✅ [MongoDB Atlas] Connected: ${conn.connection.host}`);
    console.log(`📂 [Database] Active: ${conn.connection.name}`);

    // Connection lifecycle listeners
    mongoose.connection.on('error', (err) => {
      console.error(`❌ [MongoDB Error]: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [MongoDB Warning]: Connection disconnected.');
    });

    return conn;
  } catch (error) {
    cachedPromise = null;
    console.error(`❌ [MongoDB Fatal]: Failed to connect to MongoDB Atlas: ${error.message}`);
    return null;
  }
};
