import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Inquiries from './pages/Inquiries';
import Reviews from './pages/Reviews';
import PlotBookings from './pages/PlotBookings';

function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)' }}>
      Loading…
    </div>
  );
  return admin ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <PrivateRoute>
          <Layout>
            <Routes>
              <Route path="/"              element={<Dashboard />} />
              <Route path="/properties"   element={<Properties />} />
              <Route path="/inquiries"    element={<Inquiries />} />
              <Route path="/reviews"      element={<Reviews />} />
              <Route path="/plot-bookings" element={<PlotBookings />} />
              <Route path="*"             element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
