import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AdminUser } from '../models/AdminUser.model.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header for Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return ApiResponse.error(
        res,
        'Access denied. No authorization token provided. Please log in.',
        401
      );
    }

    // Verify JWT Token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return ApiResponse.error(res, 'Session expired. Please log in again.', 401);
      }
      return ApiResponse.error(res, 'Invalid authorization token. Please log in again.', 401);
    }

    // Ensure Admin User exists in database
    const admin = await AdminUser.findById(decoded.id).select('-password');
    if (!admin) {
      return ApiResponse.error(res, 'Admin account no longer exists or has been revoked.', 401);
    }

    // Attach admin profile to request
    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};
