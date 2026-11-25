import { apiClient } from './client';

export const authApi = {
  /**
   * Authenticate admin user
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    return apiClient.post('/api/v1/auth/login', credentials);
  },

  /**
   * Fetch current admin profile using session token
   */
  async getMe() {
    return apiClient.get('/api/v1/auth/me');
  },
};
