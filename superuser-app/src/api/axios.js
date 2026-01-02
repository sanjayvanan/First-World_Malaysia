import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- ADD INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage and force redirect
      localStorage.removeItem('superuser_token');
      localStorage.removeItem('superuser_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;