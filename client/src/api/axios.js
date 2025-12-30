import axios from 'axios';

// 1. Reads from .env file (VITE_API_URL)
// 2. Fallback to localhost if .env is missing (for local dev)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;