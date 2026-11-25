import { Router } from 'express';
import {
  submitInquiry,
  getInquiries,
  deleteInquiry,
  updateInquiryStatus,
  getDashboardStats,
} from '../controllers/contact.controller.js';
import { validateContactInput } from '../middlewares/validate.middleware.js';
import { rateLimiter } from '../middlewares/rateLimiter.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// PUBLIC: Submit Contact / Consultation Form
router.post('/', rateLimiter({ windowMs: 60 * 1000, max: 15 }), validateContactInput, submitInquiry);

// PROTECTED (Admin Only): Dashboard metrics
router.get('/stats', requireAuth, getDashboardStats);

// PROTECTED (Admin Only): Retrieve all inquiries
router.get('/', requireAuth, getInquiries);

// PROTECTED (Admin Only): Update inquiry status
router.patch('/:id/status', requireAuth, updateInquiryStatus);

// PROTECTED (Admin Only): Delete inquiry
router.delete('/:id', requireAuth, deleteInquiry);

export default router;
