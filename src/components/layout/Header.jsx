import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import { Button, Badge } from '../common'
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
    <header className="bg-neo-surface dark:bg-dark-surface border-b border-neo-border dark:border-dark-border shadow-neo-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-neo-primary dark:bg-dark-primary rounded-neo flex items-center justify-center shadow-neo">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neo-text dark:text-dark-text">NegociPro</h1>
                <p className="text-xs text-neo-text-muted dark:text-dark-text-muted">
                  {profile?.business_name || 'Mi Negocio'}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="px-3 py-2 text-sm font-medium text-neo-text dark:text-dark-text hover:text-neo-primary dark:hover:text-dark-primary hover:bg-neo-bg dark:hover:bg-dark-bg-alt rounded-neo transition-all duration-200 shadow-sm hover:shadow-neo-sm"
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
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-neo-text dark:text-dark-text hover:text-neo-primary dark:hover:text-dark-primary hover:bg-neo-bg dark:hover:bg-dark-bg-alt rounded-neo transition-all duration-200 shadow-neo-sm"
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
              aria-label="Cambiar tema"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Settings */}
            <Link
              to="/app/settings"
              className="hidden sm:flex p-2 text-neo-text dark:text-dark-text hover:text-neo-primary dark:hover:text-dark-primary hover:bg-neo-bg dark:hover:bg-dark-bg-alt rounded-neo transition-all duration-200 shadow-neo-sm"
              title="Configuración"
            >
              <Settings className="h-5 w-5" />
            </Link>

            {/* User menu */}
            <div className="relative hidden sm:block">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neo-text dark:text-dark-text hover:bg-neo-bg dark:hover:bg-dark-bg-alt rounded-neo transition-all duration-200 shadow-neo-sm">
                <div className="w-8 h-8 bg-neo-accent dark:bg-dark-accent rounded-neo flex items-center justify-center text-white font-bold shadow-neo-sm">
                  {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden lg:inline">{profile?.full_name || 'Usuario'}</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neo-text dark:text-dark-text hover:text-neo-primary dark:hover:text-dark-primary hover:bg-neo-bg dark:hover:bg-dark-bg-alt rounded-neo transition-all duration-200 shadow-neo-sm"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neo-border dark:border-dark-border py-2 bg-neo-surface dark:bg-dark-surface">
          <div className="px-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-base font-medium text-neo-text dark:text-dark-text hover:text-neo-primary dark:hover:text-dark-primary hover:bg-neo-bg dark:hover:bg-dark-bg-alt rounded-neo transition-all duration-200"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}

            <div className="border-t border-neo-border dark:border-dark-border pt-2 mt-2">
              <Link
                to="/app/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-base font-medium text-neo-text dark:text-dark-text hover:text-neo-primary dark:hover:text-dark-primary hover:bg-neo-bg dark:hover:bg-dark-bg-alt rounded-neo transition-all duration-200"
              >
                <Settings className="h-5 w-5" />
                Configuración
              </Link>

              <Link
                to="/app/sync"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-base font-medium text-neo-text dark:text-dark-text hover:text-neo-primary dark:hover:text-dark-primary hover:bg-neo-bg dark:hover:bg-dark-bg-alt rounded-neo transition-all duration-200"
              >
                <RefreshCw className="h-5 w-5" />
                Sincronización
              </Link>

              <button
                onClick={() => {
                  handleSignOut()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium text-neo-danger dark:text-dark-danger hover:bg-neo-bg dark:hover:bg-dark-bg-alt rounded-neo transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
