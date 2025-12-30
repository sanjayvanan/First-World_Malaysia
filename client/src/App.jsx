import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import DashboardLayout from './components/DashboardLayout';
import PlansPage from './pages/PlansPage';
import NetworkPage from './pages/NetworkPage';
import KycPage from './pages/KycPage';
import NotFoundPage from './pages/NotFoundPage'; // <--- Import the new page

// Helper: Protects routes and ensures Role separation
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If user has the wrong role, redirect them to their correct home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* --- ADMIN ROUTE --- */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminPage />
            </ProtectedRoute>
          } 
        />

        {/* --- USER ROUTES --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="network" element={<NetworkPage />} />
          <Route path="kyc" element={<KycPage />} />
          {/* Catch 404s INSIDE the dashboard layout (optional) */}
          <Route path="*" element={<NotFoundPage />} /> 
        </Route>

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* --- GLOBAL CATCH-ALL (Fixes the issue) --- */}
        {/* OLD: <Route path="*" element={<Navigate to="/login" replace />} /> */}
        {/* NEW: Shows 404 page instead of logging out */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;