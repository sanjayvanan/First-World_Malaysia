import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; // <--- Import this

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* NEW ROUTE */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Admin Placeholder */}
        <Route path="/admin" element={<div className="p-10">Admin Area</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;