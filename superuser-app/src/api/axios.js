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
    // 1. Check if the error is 401
    // 2. AND check if the request URL is NOT the login endpoint
    //    (This prevents the page from refreshing if you just typed the wrong password)
    const isLoginRequest = error.config && error.config.url.includes('/login');

    if (error.response && error.response.status === 401 && !isLoginRequest) {
      // Clear storage and force redirect only for expired sessions
      localStorage.removeItem('superuser_token');
      localStorage.removeItem('superuser_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;