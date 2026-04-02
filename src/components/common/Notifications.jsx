import { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, Trash2, Package, User, DollarSign, BookOpen, AlertTriangle, Settings, CreditCard, ShoppingCart, Eye } from 'lucide-react'
import { notificationService } from '../../services/notificationsService'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const Notifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  // Cargar notificaciones
  const loadNotifications = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [allNotifs, unreadNotifs] = await Promise.all([
        notificationService.getAll(user.id, 20),
        notificationService.getUnread(user.id),
      ])

      setNotifications(allNotifs)
      setUnreadCount(unreadNotifs.length)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar notificaciones al montar
  useEffect(() => {
    loadNotifications()

    // Recargar cada 30 segundos
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [user])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Marcar como leída
  const markAsRead = async (notificationId, e) => {
    e.stopPropagation()
    await notificationService.markAsRead(notificationId)
    loadNotifications()
  }

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    if (!user) return
    await notificationService.markAllAsRead(user.id)
    loadNotifications()
  }

  // Eliminar notificación
  const deleteNotification = async (notificationId, e) => {
    e.stopPropagation()
    await notificationService.delete(notificationId)
    loadNotifications()
  }

  // Obtener icono según tipo
  const getIcon = (type) => {
    const icons = {
      product_created: Package,
      product_updated: Package,
      product_deleted: Package,
      stock_low: AlertTriangle,
      stock_out: AlertTriangle,
      stock_added: Package,
      stock_removed: Package,

      customer_created: User,
      customer_updated: User,
      customer_deleted: User,

      sale_created: DollarSign,
      sale_refunded: DollarSign,
      payment_received: CreditCard,

      catalog_created: BookOpen,
      catalog_updated: BookOpen,
      catalog_deleted: BookOpen,
      catalog_shared: BookOpen,
      catalog_viewed: Eye,

      expense_created: ShoppingCart,
      expense_updated: ShoppingCart,
      expense_deleted: ShoppingCart,

      user_login: Settings,
      user_logout: Settings,
      settings_updated: Settings,
    }

    return icons[type] || Bell
  }

  // Obtener color según tipo
  const getColor = (type) => {
    const colors = {
      product_created: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400',
      product_updated: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
      product_deleted: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
      stock_low: 'text-warning-600 bg-warning-50 dark:bg-warning-900/20 dark:text-warning-400',
      stock_out: 'text-danger-600 bg-danger-50 dark:bg-danger-900/20 dark:text-danger-400',
      stock_added: 'text-success-600 bg-success-50 dark:bg-success-900/20 dark:text-success-400',
      stock_removed: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',

      customer_created: 'text-accent-600 bg-accent-50 dark:bg-accent-900/20 dark:text-accent-400',
      customer_updated: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400',
      customer_deleted: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',

      sale_created: 'text-success-600 bg-success-50 dark:bg-success-900/20 dark:text-success-400',
      sale_refunded: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
      payment_received: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',

      catalog_created: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400',
      catalog_updated: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
      catalog_deleted: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
      catalog_shared: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400',
      catalog_viewed: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400',

      expense_created: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
      expense_updated: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400',
      expense_deleted: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',

      user_login: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400',
      user_logout: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400',
      settings_updated: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400',
    }

    return colors[type] || 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de notificaciones */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="icon-btn-neo-sm relative"
        title="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center px-1 text-xs font-bold text-white bg-gradient-to-br from-danger-500 to-danger-600 rounded-full shadow-neo-danger dark:shadow-neo-danger-dark">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] card-neo-lg z-50 shadow-neo-light-xl dark:shadow-neo-dark-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Notificaciones</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {unreadCount} sin leer
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="icon-btn-neo-sm"
                  title="Marcar todas como leídas"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Cargando...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No tienes notificaciones
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => {
                  const Icon = getIcon(notification.type)
                  const color = getColor(notification.type)

                  return (
                    <div
                      key={notification.id}
                      className={clsx(
                        'p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer',
                        !notification.is_read && 'bg-primary-50/50 dark:bg-primary-900/10'
                      )}
                    >
                      <div className="flex gap-3">
                        {/* Icono */}
                        <div className={clsx('flex-shrink-0 w-10 h-10 rounded-neo flex items-center justify-center', color)}>
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </p>
                        </div>

                        {/* Acciones */}
                        <div className="flex flex-col gap-1">
                          {!notification.is_read && (
                            <button
                              onClick={(e) => markAsRead(notification.id, e)}
                              className="p-1 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                              title="Marcar como leída"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => deleteNotification(notification.id, e)}
                            className="p-1 text-gray-400 hover:text-danger-500 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Notifications
