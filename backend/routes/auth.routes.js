import { Router } from 'express';
import { loginAdmin, getMe } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { rateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

// Rate limiter for auth: 10 attempts per 15 minutes to block brute force
const loginRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });

// POST /api/v1/auth/login
router.post('/login', loginRateLimiter, loginAdmin);

// GET /api/v1/auth/me (Protected)
router.get('/me', requireAuth, getMe);

export default router;
