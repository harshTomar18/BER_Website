import { apiClient } from './client';

export const blogApi = {
  // Public Endpoints
  getPublicBlogs: (params = {}) => apiClient.get('/api/v1/blogs', { params }),
  getPublicBlogBySlug: (slug) => apiClient.get(`/api/v1/blogs/slug/${slug}`),
  getPublicCategories: () => apiClient.get('/api/v1/blogs/categories'),

  // Admin Blog Management Endpoints
  getAdminBlogs: (params = {}) => apiClient.get('/api/v1/blogs/admin/list', { params }),
  getAdminBlogById: (id) => apiClient.get(`/api/v1/blogs/admin/${id}`),
  createBlog: (data) => apiClient.post('/api/v1/blogs/admin', data),
  updateBlog: (id, data) => apiClient.put(`/api/v1/blogs/admin/${id}`, data),
  deleteBlog: (id) => apiClient.delete(`/api/v1/blogs/admin/${id}`),
  duplicateBlog: (id) => apiClient.post(`/api/v1/blogs/admin/${id}/duplicate`),
  toggleBlogStatus: (id) => apiClient.patch(`/api/v1/blogs/admin/${id}/status`),
  getInternalRoutes: () => apiClient.get('/api/v1/blogs/admin/internal-routes'),
  uploadImage: (formData) => apiClient.upload('/api/v1/blogs/admin/upload-image', formData),

  // Category Management Endpoints
  getAdminCategories: () => apiClient.get('/api/v1/blogs/admin/categories'),
  createCategory: (data) => apiClient.post('/api/v1/blogs/admin/categories', data),
  updateCategory: (id, data) => apiClient.put(`/api/v1/blogs/admin/categories/${id}`, data),
  deleteCategory: (id) => apiClient.delete(`/api/v1/blogs/admin/categories/${id}`),
};

export default blogApi;
