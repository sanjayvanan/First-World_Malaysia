import axios from 'axios';

// Ensure this points to your LIVE backend
const BASE_URL = import.meta.env.VITE_API_URL || 'https://first-worldmalaysia-production.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 1. REQUEST INTERCEPTOR (Attaches User Token)
api.interceptors.request.use(
  (config) => {
    // Note: Client app uses 'token', Superuser used 'superuser_token'
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR (Auto-Logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config && error.config.url.includes('/login');

    if (error.response && error.response.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;