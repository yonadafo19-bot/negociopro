import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { Home, Package, DollarSign, Users, BarChart3, BookOpen, Settings } from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home, color: 'from-violet-500 to-purple-600' },
    { name: 'Inventario', href: '/app/inventory', icon: Package, color: 'from-blue-500 to-cyan-600' },
    { name: 'Ventas', href: '/app/sales', icon: DollarSign, color: 'from-emerald-500 to-green-600' },
    { name: 'Contactos', href: '/app/contacts', icon: Users, color: 'from-amber-500 to-orange-600' },
    { name: 'Reportes', href: '/app/reports', icon: BarChart3, color: 'from-rose-500 to-pink-600' },
    { name: 'Catálogos', href: '/app/catalogs', icon: BookOpen, color: 'from-indigo-500 to-blue-600' },
  ]

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 border-r border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 px-6 border-b border-gray-200 dark:border-gray-700">
        <Link to="/app/dashboard" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-neo-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-neo-primary dark:shadow-neo-primary-dark flex items-center justify-center">
            <Package className="h-7 w-7 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">NegociPro</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Enterprise POS</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'group flex items-center gap-4 px-5 py-4 text-base font-semibold rounded-neo-lg transition-all duration-300',
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-neo-primary dark:shadow-neo-primary-dark translate-x-1`
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-1 hover:shadow-neo-sm'
              )}
            >
              <div className={clsx(
                'p-2.5 rounded-neo-lg transition-all duration-300',
                isActive ? 'bg-white/20' : `bg-gradient-to-br ${item.color} bg-opacity-10 group-hover:bg-opacity-20`
              )}>
                <item.icon className="h-6 w-6" />
              </div>
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Settings link */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/app/settings"
          className="flex items-center gap-4 px-5 py-4 text-base font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-neo-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-1 hover:shadow-neo-sm transition-all duration-300"
        >
          <div className="p-2.5 rounded-neo-lg bg-gradient-to-br from-gray-500 to-gray-600">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <span className="flex-1">Configuración</span>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
