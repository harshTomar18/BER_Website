import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.model.js';
import { config } from '../config/env.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Generate signed JWT token
 */
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );
};

/**
 * POST /api/v1/auth/login
 */
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, 'Please provide both email and password.', 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query admin user and explicitly select password field
    const admin = await AdminUser.findOne({ email: normalizedEmail }).select('+password');

    if (!admin) {
      return ApiResponse.error(res, 'Invalid email or password credentials.', 401);
    }

    // Verify Password Hash
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return ApiResponse.error(res, 'Invalid email or password credentials.', 401);
    }

    // Update lastLogin timestamp
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = generateToken(admin);

    const adminProfile = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin,
    };

    console.log(`🔐 [Admin Auth] Successful login for: ${admin.email}`);

    return ApiResponse.success(
      res,
      {
        token,
        admin: adminProfile,
      },
      'Authentication successful. Session started.',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/auth/me (Protected)
 */
export const getMe = async (req, res) => {
  return ApiResponse.success(
    res,
    {
      admin: req.admin,
    },
    'Admin profile retrieved.'
  );
};

/**
 * Auto-Seed Default Admin User if collection is empty
 */
export const seedDefaultAdmin = async () => {
  try {
    const count = await AdminUser.countDocuments();
    if (count === 0) {
      await AdminUser.create({
        name: 'Admin',
        email: config.adminDefaultEmail,
        password: config.adminDefaultPassword,
        role: 'superadmin',
      });
      console.log(`👑 [Admin Seeded] Default admin created: ${config.adminDefaultEmail}`);
      console.log(`🔑 [Admin Credentials] Password: ${config.adminDefaultPassword}`);
    }
  } catch (err) {
    console.error('❌ Error seeding default admin:', err.message);
  }
};
