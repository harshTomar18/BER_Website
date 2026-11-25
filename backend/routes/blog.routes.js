import { Router } from 'express';
import {
  getPublicBlogs,
  getPublicBlogBySlug,
  getSitemapXml,
  getAdminBlogs,
  getAdminBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  duplicateBlog,
  toggleBlogStatus,
  getInternalRoutes,
  uploadBlogImageHandler,
} from '../controllers/blog.controller.js';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { uploadBlogImage } from '../middlewares/upload.middleware.js';

const router = Router();

// ---------------------------------------------------------------------------
// PUBLIC ROUTES
// ---------------------------------------------------------------------------
router.get('/', getPublicBlogs);
router.get('/categories', getAllCategories);
router.get('/sitemap.xml', getSitemapXml);
router.get('/internal-routes', getInternalRoutes);
router.get('/slug/:slug', getPublicBlogBySlug);

// ---------------------------------------------------------------------------
// ADMIN PROTECTED ROUTES (Requires valid JWT session)
// ---------------------------------------------------------------------------
router.get('/admin/list', requireAuth, getAdminBlogs);
router.get('/admin/internal-routes', requireAuth, getInternalRoutes);

// Category Management
router.get('/admin/categories', requireAuth, getAllCategories);
router.post('/admin/categories', requireAuth, createCategory);
router.put('/admin/categories/:id', requireAuth, updateCategory);
router.delete('/admin/categories/:id', requireAuth, deleteCategory);

// Blog CRUD & Actions
router.get('/admin/:id', requireAuth, getAdminBlogById);
router.post('/admin', requireAuth, createBlog);
router.put('/admin/:id', requireAuth, updateBlog);
router.delete('/admin/:id', requireAuth, deleteBlog);
router.post('/admin/:id/duplicate', requireAuth, duplicateBlog);
router.patch('/admin/:id/status', requireAuth, toggleBlogStatus);
router.post('/admin/upload-image', requireAuth, uploadBlogImage, uploadBlogImageHandler);

export default router;
