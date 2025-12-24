import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; 
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* NEW ROUTE */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* SUPERUSER ROUTE */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;