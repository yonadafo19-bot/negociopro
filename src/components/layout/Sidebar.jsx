import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { Home, Package, DollarSign, Users, BarChart3, BookOpen, Settings } from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home },
    { name: 'Inventario', href: '/app/inventory', icon: Package },
    { name: 'Ventas', href: '/app/sales', icon: DollarSign },
    { name: 'Contactos', href: '/app/contacts', icon: Users },
    { name: 'Reportes', href: '/app/reports', icon: BarChart3 },
    { name: 'Catálogos', href: '/app/catalogs', icon: BookOpen },
  ]

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-neo-surface dark:bg-dark-surface border-r border-neo-border dark:border-dark-border shadow-neo-sm">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-neo-border dark:border-dark-border">
        <Link to="/app/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-neo-primary dark:bg-dark-primary rounded-neo flex items-center justify-center shadow-neo">
            <Package className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-neo-text dark:text-dark-text">NegociPro</span>
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
                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-neo transition-all duration-200 shadow-sm',
                isActive
                  ? 'bg-neo-primary dark:bg-dark-primary text-white shadow-neo'
                  : 'text-neo-text dark:text-dark-text hover:bg-neo-bg dark:hover:bg-dark-bg-alt hover:shadow-neo-sm'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Settings link */}
      <div className="p-3 border-t border-neo-border dark:border-dark-border">
        <Link
          to="/app/settings"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neo-text dark:text-dark-text hover:bg-neo-bg dark:hover:bg-dark-bg-alt rounded-neo transition-all duration-200 shadow-sm hover:shadow-neo-sm"
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          Configuración
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
