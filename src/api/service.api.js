import { apiClient } from './client';

let servicesPromise = null;
let servicesData = null;
let servicesCacheTime = 0;
const SERVICES_CACHE_TTL = 30000;

export const serviceApi = {
  /**
   * Fetch all active services for public website
   */
  async getPublicServices(forceFresh = false) {
    const now = Date.now();
    if (!forceFresh && servicesData && now - servicesCacheTime < SERVICES_CACHE_TTL) {
      return servicesData;
    }
    if (!forceFresh && servicesPromise) {
      return servicesPromise;
    }
    servicesPromise = apiClient.get('/api/v1/services')
      .then((res) => {
        servicesData = res;
        servicesCacheTime = Date.now();
        servicesPromise = null;
        return res;
      })
      .catch((err) => {
        servicesPromise = null;
        throw err;
      });
    return servicesPromise;
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
