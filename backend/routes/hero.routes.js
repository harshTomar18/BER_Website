import { Router } from 'express';
import {
  getPublicHero,
  getAdminHero,
  updateAdminHero,
  uploadHeroImageHandler,
  uploadHeroMediaHandler,
} from '../controllers/hero.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { uploadHeroImage, uploadHeroMedia } from '../middlewares/upload.middleware.js';

const router = Router();

// Public route: Get current active hero section
router.get('/', getPublicHero);

// Protected Admin routes
router.get('/admin', requireAuth, getAdminHero);
router.put('/admin', requireAuth, updateAdminHero);
router.post('/admin/upload-image', requireAuth, uploadHeroImage, uploadHeroImageHandler);
router.post('/admin/upload-media', requireAuth, uploadHeroMedia, uploadHeroMediaHandler);

export default router;
