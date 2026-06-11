// ============================================
// DermaScan — App Root with Router
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OfflineProvider } from './contexts/OfflineContext';
import OfflineBanner from './components/ui/OfflineBanner';
import OfflineSyncManager from './components/ui/OfflineSyncManager';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import Welcome from './pages/Welcome';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import ForgotPassword from './pages/auth/ForgotPassword';
import Onboarding from './pages/auth/Onboarding';
import Home from './pages/Home';
import NewScan from './pages/scan/NewScan';
import AnalyzingScan from './pages/scan/AnalyzingScan';
import Results from './pages/scan/Results';
import History from './pages/History';
import Profile from './pages/Profile';
import ProductScanner from './pages/scan/ProductScanner';
import Scanner from './pages/scan/Scanner';
import Shop from './pages/Shop';
import Consult from './pages/Consult';
import Library from './pages/Library';
import DermChat from './pages/chat/DermChat';
import type { ReactNode } from 'react';

// Protected route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f5ef', color: '#0d6b5e', fontWeight: 600 }}>
        Loading session...
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// Public-only route wrapper (redirect if already logged in)
function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f5ef', color: '#0d6b5e', fontWeight: 600 }}>
        Loading session...
      </div>
    );
  }
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes (auth) */}
      <Route element={
        <PublicRoute>
          <AuthLayout />
        </PublicRoute>
      }>
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected routes with bottom nav */}
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/consult" element={<Consult />} />
        <Route path="/library" element={<Library />} />
      </Route>

      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } />

      <Route path="/scan" element={
        <ProtectedRoute>
          <Scanner />
        </ProtectedRoute>
      } />
      <Route path="/scan/new" element={
        <ProtectedRoute>
          <NewScan />
        </ProtectedRoute>
      } />
      <Route path="/scan/analyzing" element={
        <ProtectedRoute>
          <AnalyzingScan />
        </ProtectedRoute>
      } />
      <Route path="/scan/results/:id" element={
        <ProtectedRoute>
          <Results />
        </ProtectedRoute>
      } />
      <Route path="/scan/product" element={
        <ProtectedRoute>
          <ProductScanner />
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
          <DermChat />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <OfflineProvider>
        <OfflineSyncManager />
        <OfflineBanner />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </OfflineProvider>
    </BrowserRouter>
  );
}
