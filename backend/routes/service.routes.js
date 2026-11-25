import express from 'express';
import {
  getPublicServices,
  getPublicServiceBySlug,
  getAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  uploadServiceImageHandler,
} from '../controllers/service.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { uploadServiceImage } from '../middlewares/upload.middleware.js';

const router = express.Router();

// 1. Public Routes
router.get('/', getPublicServices);
router.get('/:slug', getPublicServiceBySlug);

// 2. Protected Admin Routes
router.get('/admin/all', requireAuth, getAdminServices);
router.post('/admin', requireAuth, createAdminService);
router.put('/admin/:id', requireAuth, updateAdminService);
router.delete('/admin/:id', requireAuth, deleteAdminService);
router.post('/admin/upload-image', requireAuth, uploadServiceImage, uploadServiceImageHandler);

export default router;
