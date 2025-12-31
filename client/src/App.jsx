import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <--- Import New Page
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import DashboardLayout from './components/DashboardLayout';
import PlansPage from './pages/PlansPage';
import NetworkPage from './pages/NetworkPage';
import KycPage from './pages/KycPage';
import NotFoundPage from './pages/NotFoundPage';

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
  // Grab token from Redux to determine where root "/" should point
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* <--- Added Route */}

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
          <Route path="*" element={<NotFoundPage />} /> 
        </Route>

        {/* Root Redirect Fix:
            If logged in (token exists), go to Dashboard.
            If not, go to Login.
        */}
        <Route 
          path="/" 
          element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />

        {/* Global Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;