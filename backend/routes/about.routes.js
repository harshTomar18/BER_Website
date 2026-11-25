import { Router } from 'express';
import {
  getPublicAbout,
  getAdminAbout,
  updateAdminAbout,
  uploadAboutImageHandler,
} from '../controllers/about.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { uploadAboutImage } from '../middlewares/upload.middleware.js';

const router = Router();

// Public route: Get current active about section data
router.get('/', getPublicAbout);

// Protected Admin routes
router.get('/admin', requireAuth, getAdminAbout);
router.put('/admin', requireAuth, updateAdminAbout);
router.post('/admin/upload-image', requireAuth, uploadAboutImage, uploadAboutImageHandler);

export default router;
