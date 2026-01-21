import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 1. NEW: REQUEST INTERCEPTOR (Attaches Token)
api.interceptors.request.use(
  (config) => {
    // Get token from Superuser storage
    const token = localStorage.getItem('superuser_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. EXISTING: RESPONSE INTERCEPTOR (Handles 401 Logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config && error.config.url.includes('/login');

    if (error.response && error.response.status === 401 && !isLoginRequest) {
      localStorage.removeItem('superuser_token');
      localStorage.removeItem('superuser_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;