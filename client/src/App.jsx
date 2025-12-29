import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import your pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage'; 

// --- THE FIX: Define PrivateRoute Here ---
// This component checks if a user is logged in.
// If yes, it shows the page (children). If no, it redirects to Login.
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES (No Login Required) */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* PROTECTED USER DASHBOARD */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        
        {/* PROTECTED NESTED ROUTES (For Tree/Donate/etc inside Dashboard) */}
        <Route path="/dashboard/*" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />

        {/* PROTECTED MANAGER DASHBOARD (Admin Only) */}
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        } />

        {/* CATCH-ALL: Redirect unknown pages to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;