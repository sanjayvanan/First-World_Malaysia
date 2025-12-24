import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to Login for now */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* The Login Page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Placeholders for future pages */}
        <Route path="/dashboard" element={<div className="p-10 text-2xl">User Dashboard (Coming Soon)</div>} />
        <Route path="/admin" element={<div className="p-10 text-2xl">Superuser Dashboard (Coming Soon)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;