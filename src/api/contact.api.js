import { apiClient } from './client';

export const contactApi = {
  /**
   * Submit client inquiry / lead to MongoDB Atlas (Public)
   * @param {Object} payload - { name, phone, email, company, service, message, type }
   */
  async submitInquiry(payload) {
    return apiClient.post('/api/v1/contact', payload);
  },

  /**
   * Retrieve all leads from MongoDB Atlas (Admin Protected)
   * @param {Object} params - { page, limit, type, status, search }
   */
  async getLeads(page = 1, limit = 50, filters = {}) {
    let url = `/api/v1/contact?page=${page}&limit=${limit}`;
    if (filters.type && filters.type !== 'ALL') {
      url += `&type=${encodeURIComponent(filters.type)}`;
    }
    if (filters.status && filters.status !== 'ALL') {
      url += `&status=${encodeURIComponent(filters.status)}`;
    }
    if (filters.search) {
      url += `&search=${encodeURIComponent(filters.search)}`;
    }
    return apiClient.get(url);
  },

  /**
   * Retrieve Executive Dashboard Statistics (Admin Protected)
   */
  async getDashboardStats() {
    return apiClient.get('/api/v1/contact/stats');
  },

  /**
   * Update inquiry status (Admin Protected)
   * @param {string} id
   * @param {string} status - 'new' | 'contacted' | 'in_progress' | 'closed'
   */
  async updateStatus(id, status) {
    return apiClient.patch(`/api/v1/contact/${id}/status`, { status });
  },

  /**
   * Delete lead from MongoDB Atlas (Admin Protected)
   * @param {string} id
   */
  async deleteLead(id) {
    return apiClient.delete(`/api/v1/contact/${id}`);
  },

  /**
   * Check Backend & Database Health
   */
  async getHealth() {
    return apiClient.get('/api/v1/health');
  },
};
