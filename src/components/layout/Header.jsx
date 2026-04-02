import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import { Badge, Notifications } from '../common'
import {
  Menu,
  X,
  Home,
  Package,
  DollarSign,
  Users,
  BarChart3,
  BookOpen,
  Settings,
  LogOut,
  Moon,
  Sun,
  RefreshCw,
} from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const { user, profile, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home },
    { name: 'Inventario', href: '/app/inventory', icon: Package },
    { name: 'Ventas', href: '/app/sales', icon: DollarSign },
    { name: 'Contactos', href: '/app/contacts', icon: Users },
    { name: 'Reportes', href: '/app/reports', icon: BarChart3 },
    { name: 'Catálogos', href: '/app/catalogs', icon: BookOpen },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/app/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-neo bg-gradient-to-br from-primary-500 to-primary-600 shadow-neo-primary dark:shadow-neo-primary-dark flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">NegociPro</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                  {profile?.business_name || 'Mi Negocio'}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="btn-neo-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
              >
                <span className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Notifications />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="icon-btn-neo-sm"
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
              aria-label="Cambiar tema"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Settings */}
            <Link
              to="/app/settings"
              className="icon-btn-neo-sm hidden sm:flex"
              title="Configuración"
            >
              <Settings className="h-4 w-4" />
            </Link>

            {/* User menu */}
            <div className="relative hidden sm:block">
              <button className="flex items-center gap-2 px-3 py-2 btn-neo-sm">
                <div className="w-7 h-7 rounded-neo-sm bg-gradient-to-br from-accent-500 to-accent-600 shadow-neo-accent dark:shadow-neo-accent-dark flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profile?.full_name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <span className="hidden lg:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                  {profile?.full_name?.split(' ')[0] || 'Usuario'}
                </span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="icon-btn-neo-sm lg:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-2 backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
          <div className="px-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 card-neo-sm"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}

            <div className="divider-neo my-3" />

            <Link
              to="/app/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 card-neo-sm"
            >
              <Settings className="h-5 w-5" />
              Configuración
            </Link>

            <Link
              to="/app/sync"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400 card-neo-sm"
            >
              <RefreshCw className="h-5 w-5" />
              Sincronización
            </Link>

            <button
              onClick={() => {
                handleSignOut()
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-danger-600 dark:text-danger-400 card-neo-sm"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
