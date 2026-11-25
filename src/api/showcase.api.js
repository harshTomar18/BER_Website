import { apiClient } from './client.js';

let cachedPromise = null;
let cachedData = null;
let cacheTime = 0;
const CACHE_TTL = 15000; // 15s in-memory cache to prevent redundant simultaneous requests

/**
 * Public: Fetch showcase sections (TechSlider, NextGen, Testimonials, Clients)
 */
export const getPublicShowcase = async (forceFresh = false) => {
  const now = Date.now();
  if (!forceFresh && cachedData && now - cacheTime < CACHE_TTL) {
    return cachedData;
  }
  if (!forceFresh && cachedPromise) {
    return cachedPromise;
  }

  cachedPromise = apiClient
    .get('/api/v1/showcase')
    .then((res) => {
      cachedData = res;
      cacheTime = Date.now();
      cachedPromise = null;
      return res;
    })
    .catch((err) => {
      cachedPromise = null;
      throw err;
    });

  return cachedPromise;
};

/**
 * Admin: Get complete showcase data for admin manager
 */
export const getAdminShowcase = async () => {
  return apiClient.get('/api/v1/showcase/admin');
};

/**
 * Admin: Update showcase sections
 */
export const updateShowcase = async (showcaseData) => {
  const res = await apiClient.put('/api/v1/showcase/admin', showcaseData);
  // Invalidate public cache
  cachedData = null;
  cacheTime = 0;
  return res;
};

/**
 * Admin: Upload image for showcase (Logos, Tech Icons, Avatars)
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return apiClient.upload('/api/v1/showcase/admin/upload-image', formData);
};

export default {
  getPublicShowcase,
  getAdminShowcase,
  updateShowcase,
  uploadImage,
};
