import { Router } from 'express';
import {
  getPublicFaqs,
  getAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  reorderFaqs,
} from '../controllers/faq.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route: Fetch FAQs (supports ?landing=true or ?limit=1 to return ONLY 1 FAQ)
router.get('/', getPublicFaqs);

// Protected Admin routes
router.get('/admin', requireAuth, getAdminFaqs);
router.post('/admin', requireAuth, createFaq);
router.put('/admin/reorder', requireAuth, reorderFaqs);
router.put('/admin/:id', requireAuth, updateFaq);
router.delete('/admin/:id', requireAuth, deleteFaq);

export default router;
