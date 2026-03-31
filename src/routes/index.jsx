import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Layout } from '../components/layout'
import LoginPage from '../pages/Auth/LoginPage'
import RegisterPage from '../pages/Auth/RegisterPage'
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage'
import DashboardPage from '../pages/Dashboard'
import InventoryPage from '../pages/Inventory'
import SalesPage from '../pages/Sales'
import ContactsPage from '../pages/Contacts'
import ReportsPage from '../pages/Reports'
import CatalogsPage from '../pages/Catalogs'
import SettingsPage from '../pages/Settings'
import SyncSettingsPage from '../pages/SyncSettings'
import PublicCatalogPage from '../pages/PublicCatalog'
import LandingPage from '../pages/LandingPage'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page (public) */}
      <Route path="/" element={<LandingPage />} />

      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />

      {/* Public catalog (no auth required) */}
      <Route path="/catalog/:shareLink" element={<PublicCatalogPage />} />

      {/* Protected routes with Layout */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="catalogs" element={<CatalogsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="sync" element={<SyncSettingsPage />} />
      </Route>

      {/* Default protected route redirect */}
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/inventory" element={<Navigate to="/app/inventory" replace />} />
      <Route path="/sales" element={<Navigate to="/app/sales" replace />} />
      <Route path="/contacts" element={<Navigate to="/app/contacts" replace />} />
      <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
      <Route path="/catalogs" element={<Navigate to="/app/catalogs" replace />} />
      <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
      <Route path="/sync" element={<Navigate to="/app/sync" replace />} />

      {/* 404 */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}

export default AppRoutes
