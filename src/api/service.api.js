import { apiClient } from './client';

export const serviceApi = {
  /**
   * Fetch all active services for public website
   */
  async getPublicServices() {
    return apiClient.get('/api/v1/services');
  },

  /**
   * Fetch a single active service by its slug
   * @param {string} slug
   */
  async getPublicServiceBySlug(slug) {
    return apiClient.get(`/api/v1/services/${slug}`);
  },

  /**
   * Fetch all services for admin management (Protected)
   */
  async getAdminServices() {
    return apiClient.get('/api/v1/services/admin/all');
  },

  /**
   * Create a new service (Protected)
   * @param {Object} data
   */
  async createService(data) {
    return apiClient.post('/api/v1/services/admin', data);
  },

  /**
   * Overwrite / Update a service by ID (Protected)
   * @param {string} id
   * @param {Object} data
   */
  async updateService(id, data) {
    return apiClient.put(`/api/v1/services/admin/${id}`, data);
  },

  /**
   * Delete a service by ID (Protected)
   * @param {string} id
   */
  async deleteService(id) {
    return apiClient.delete(`/api/v1/services/admin/${id}`);
  },

  /**
   * Upload service image (Protected)
   * @param {FormData} formData
   */
  async uploadImage(formData) {
    return apiClient.upload('/api/v1/services/admin/upload-image', formData);
  },
};
