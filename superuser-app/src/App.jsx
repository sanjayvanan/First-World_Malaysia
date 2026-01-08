import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PlansManager from './pages/PlansManager'; // Ensure this exists from previous step
import Layout from './components/Layout'; // Import the new Layout

// Guard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('superuser_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const NotFound = () => (
  <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center text-center p-4">
    <h1 className="text-6xl font-bold text-[#C5A059] mb-4">404</h1>
    <p className="text-gray-400 mb-8">Page not found.</p>
    <a href="/" className="text-white underline hover:text-[#C5A059]">Return to Dashboard</a>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* PROTECTED LAYOUT ROUTES */}
        {/* The Layout component wraps these pages, providing the Navbar */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/plans" element={<PlansManager />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;