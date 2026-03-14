import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  Home,
  Package,
  DollarSign,
  Users,
  BarChart3,
  BookOpen,
  Settings,
} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Inventario', href: '/inventory', icon: Package },
    { name: 'Ventas', href: '/sales', icon: DollarSign },
    { name: 'Contactos', href: '/contacts', icon: Users },
    { name: 'Reportes', href: '/reports', icon: BarChart3 },
    { name: 'Catálogos', href: '/catalogs', icon: BookOpen },
  ]

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-500 rounded-kawaii flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            NegociPro
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-kawaii transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Settings link */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-kawaii transition-colors"
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          Configuración
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
