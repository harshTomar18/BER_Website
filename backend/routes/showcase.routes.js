import express from 'express';
import {
  getPublicShowcase,
  getAdminShowcase,
  updateAdminShowcase,
  uploadShowcaseImageHandler,
} from '../controllers/showcase.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { uploadShowcaseImage } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Public route to fetch showcase data
router.get('/', getPublicShowcase);

// Protected Admin Routes
router.get('/admin', requireAuth, getAdminShowcase);
router.put('/admin', requireAuth, updateAdminShowcase);
router.post('/admin/upload-image', requireAuth, uploadShowcaseImage, uploadShowcaseImageHandler);

export default router;
