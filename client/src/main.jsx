import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import api from './api/axios'; // Import your Axios instance
import { logout } from './redux/slices/authSlice'; // Import logout action

// --- ADD GLOBAL INTERCEPTOR HERE ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend sends 401 (Expired/Invalid), log out immediately
    if (error.response && error.response.status === 401) {
      store.dispatch(logout()); 
      // Redux state change will trigger App.jsx to redirect to /login
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);