import { apiClient } from './client';

export const aboutApi = {
  /**
   * Fetch active About section data for public website
   */
  async getPublicAbout() {
    return apiClient.get('/api/v1/about');
  },

  /**
   * Fetch About section data for admin editor (Protected)
   */
  async getAdminAbout() {
    return apiClient.get('/api/v1/about/admin');
  },

  /**
   * Overwrite / Update About section data (Protected)
   * @param {Object} data
   */
  async updateAbout(data) {
    return apiClient.put('/api/v1/about/admin', data);
  },

  /**
   * Upload About artwork / featured image to server (Protected)
   * @param {FormData} formData
   */
  async uploadImage(formData) {
    return apiClient.upload('/api/v1/about/admin/upload-image', formData);
  },
};
