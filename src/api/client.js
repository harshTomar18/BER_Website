/**
 * Unified API HTTP Client
 * Handles base URLs, timeouts, headers, automatic sessionStorage JWT token injection,
 * query parameters serialization, and normalized error responses.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const DEFAULT_TIMEOUT = 12000;

export class ApiError extends Error {
  constructor(message, status = 500, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function request(endpoint, options = {}) {
  const { timeout = DEFAULT_TIMEOUT, headers = {}, body, params, ...customConfig } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Automatically read token from sessionStorage
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('ber_admin_token') : null;

  const authHeaders = {};
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const defaultHeaders = {};
  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...authHeaders,
      ...headers,
    },
    signal: controller.signal,
    ...customConfig,
  };

  if (body) {
    config.body = isFormData ? body : (typeof body === 'string' ? body : JSON.stringify(body));
  }

  // Serialize query params if provided
  let queryString = '';
  if (params && typeof params === 'object') {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const serialized = searchParams.toString();
    if (serialized) {
      queryString = (endpoint.includes('?') ? '&' : '?') + serialized;
    }
  }

  const url = `${API_BASE_URL}${endpoint}${queryString}`;

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      // If 401 Unauthorized, notify session expired
      if (response.status === 401 && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
          sessionStorage.removeItem('ber_admin_token');
          sessionStorage.removeItem('ber_admin_user');
          window.location.href = '/admin/login?expired=1';
        }
      }

      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data?.errors || null);
    }

    if (data === null) {
      throw new ApiError('Invalid response format received from server.', 500);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your internet connection.', 408);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(error.message || 'Network error occurred. Please try again.', 500);
  }
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
  upload: (endpoint, formData, options = {}) => request(endpoint, { ...options, method: 'POST', body: formData }),
};
