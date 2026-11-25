import app from '../backend/server.js';
import { connectDB } from '../backend/config/db.js';
import { config } from '../backend/config/env.js';

export default async function handler(req, res) {
  // Ensure MongoDB connection before handling any request in serverless environment
  if (config.mongoUri) {
    try {
      await connectDB();
    } catch (err) {
      console.error('Serverless DB connection warning:', err?.message || err);
    }
  }

  // Pass request to Express application
  return app(req, res);
}
