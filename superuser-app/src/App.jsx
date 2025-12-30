import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Simple Guard: Check if token exists
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('superuser_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// 404 Page Component (Internal)
const NotFound = () => (
  <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center text-center p-4">
    <h1 className="text-6xl font-bold text-[#C5A059] mb-4">404</h1>
    <p className="text-gray-400 mb-8">Page not found in Superuser System.</p>
    <a href="/" className="text-white underline hover:text-[#C5A059]">Return to Dashboard</a>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Dashboard */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        {/* Specific 404 Page instead of redirecting to login */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;