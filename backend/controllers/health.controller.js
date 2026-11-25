import mongoose from 'mongoose';
import { ApiResponse } from '../utils/apiResponse.js';
import { config } from '../config/env.js';

export const getHealth = (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  const healthData = {
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'BER Services API Gateway',
    environment: config.env,
    database: {
      status: isDbConnected ? 'connected' : 'disconnected',
      readyState: mongoose.connection.readyState,
      mongoUriConfigured: Boolean(config.mongoUri),
      host: mongoose.connection.host || 'unknown',
      name: mongoose.connection.name || 'unknown',
    },
    systemTime: new Date().toISOString(),
  };

  return ApiResponse.success(
    res,
    healthData,
    isDbConnected ? 'All systems operational' : 'Database disconnected or initializing (check MONGODB_URI in Vercel settings)',
    200
  );
};
