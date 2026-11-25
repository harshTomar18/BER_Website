import mongoose from 'mongoose';
import { ApiResponse } from '../utils/apiResponse.js';

export const getHealth = (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  const healthData = {
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'BER Services API Gateway',
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: isDbConnected ? 'connected' : 'disconnected',
      host: mongoose.connection.host || 'unknown',
      name: mongoose.connection.name || 'unknown',
    },
    systemTime: new Date().toISOString(),
  };

  return ApiResponse.success(
    res,
    healthData,
    isDbConnected ? 'All systems operational' : 'Database connection warning',
    isDbConnected ? 200 : 503
  );
};
