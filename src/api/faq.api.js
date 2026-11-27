import { apiClient } from './client';

export const faqApi = {
  /**
   * Fetch public FAQs
   * @param {Object} [params] - { landing: boolean, limit: number, category: string, search: string }
   */
  async getPublicFaqs(params = {}) {
    return apiClient.get('/api/v1/faqs', { params });
  },

  /**
   * Fetch all FAQs for Admin Manager (Protected)
   */
  async getAdminFaqs() {
    return apiClient.get('/api/v1/faqs/admin');
  },

  /**
   * Create a new FAQ (Protected)
   * @param {Object} data - { question, answer, category, order, isActive, isLandingFeatured }
   */
  async createFaq(data) {
    return apiClient.post('/api/v1/faqs/admin', data);
  },

  /**
   * Update an FAQ (Protected)
   * @param {string} id
   * @param {Object} data
   */
  async updateFaq(id, data) {
    return apiClient.put(`/api/v1/faqs/admin/${id}`, data);
  },

  /**
   * Delete an FAQ (Protected)
   * @param {string} id
   */
  async deleteFaq(id) {
    return apiClient.delete(`/api/v1/faqs/admin/${id}`);
  },

  /**
   * Reorder FAQs in bulk (Protected)
   * @param {Array<{id: string, order: number}>} items
   */
  async reorderFaqs(items) {
    return apiClient.put('/api/v1/faqs/admin/reorder', { items });
  },
};

export default faqApi;
