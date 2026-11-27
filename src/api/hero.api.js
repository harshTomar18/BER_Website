import { apiClient } from './client';

export const heroApi = {
  /**
   * Fetch active Hero section for public website
   */
  async getPublicHero() {
    return apiClient.get('/api/v1/hero');
  },

  /**
   * Fetch Hero section data for admin editor (Protected)
   */
  async getAdminHero() {
    return apiClient.get('/api/v1/hero/admin');
  },

  /**
   * Overwrite / Update Hero section data (Protected)
   * @param {Object} data
   */
  async updateHero(data) {
    return apiClient.put('/api/v1/hero/admin', data);
  },

  /**
   * Upload Hero image to server (Protected)
   * @param {FormData} formData
   */
  async uploadImage(formData) {
    return apiClient.upload('/api/v1/hero/admin/upload-image', formData);
  },

  /**
   * Upload Hero media (Video or Image) to server (Protected)
   * @param {FormData} formData
   */
  async uploadMedia(formData) {
    return apiClient.upload('/api/v1/hero/admin/upload-media', formData);
  },
};
