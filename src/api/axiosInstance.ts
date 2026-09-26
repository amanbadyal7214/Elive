import axios from 'axios';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.9:5000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 25000, // 25 seconds timeout to allow backend cold starts and network latency
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { getStorageItem } = await import('../utils/storage');
      const token = await getStorageItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('[axiosInstance] Error attaching token to request:', err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global API errors (e.g. 401 Unauthorized, Network Error, Timeout, etc.)
    if (error.response) {
      console.error(`[API Error ${error.response.status}]:`, error.response.data);
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.warn(`[API Timeout Warning]: Request to ${error.config?.url} timed out. Ensure backend server at ${BASE_URL} is running and reachable.`);
    } else if (error.request) {
      console.error('[API Network Error]: No response received from server at', BASE_URL);
    } else {
      console.error('[API Request Error]:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { axiosInstance };
