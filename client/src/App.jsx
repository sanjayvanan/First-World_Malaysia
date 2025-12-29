import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NetworkPage from './pages/NetworkPage'; // Created above
import KycPage from './pages/KycPage';
import AdminPage from './pages/AdminPage'; 

// Layouts
import DashboardLayout from './components/DashboardLayout';

// Placeholder Pages for broken links (Create these files later to fully fix)
const DonatePage = () => <div className="text-white text-xl p-10">Donate Page Coming Soon</div>;
const PlansPage = () => <div className="text-white text-xl p-10">Plans Page Coming Soon</div>;
const SettingsPage = () => <div className="text-white text-xl p-10">Settings Page Coming Soon</div>;
const HelpPage = () => <div className="text-white text-xl p-10">Help Page Coming Soon</div>;

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* LAYOUT ROUTE: Parent for all dashboard pages */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
            {/* Index maps to /dashboard */}
            <Route index element={<DashboardPage />} />
            
            {/* Sub-routes map to /dashboard/network, /dashboard/donate, etc. */}
            <Route path="network" element={<NetworkPage />} />
            <Route path="donate" element={<DonatePage />} />
            <Route path="plans" element={<PlansPage />} />
            <Route path="kyc" element={<KycPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpPage />} />
        </Route>

        <Route path="/admin" element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;