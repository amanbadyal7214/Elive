import axios from 'axios';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.9:5000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can attach authorization tokens here if needed
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
    // Handle global API errors (e.g. 401 Unauthorized, Network Error, etc.)
    if (error.response) {
      console.error(`[API Error ${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.error('[API Network Error]: No response received', error.request);
    } else {
      console.error('[API Request Error]:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { axiosInstance };
