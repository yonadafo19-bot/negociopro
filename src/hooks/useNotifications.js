import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { notificationService, notify } from '../services/notificationsService'

export const useNotifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Cargar notificaciones
  const loadNotifications = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const [allNotifs, unreadNotifs] = await Promise.all([
        notificationService.getAll(user.id, 50),
        notificationService.getUnread(user.id),
      ])

      setNotifications(allNotifs)
      setUnreadCount(unreadNotifs.length)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Recargar notificaciones
  const refresh = useCallback(() => {
    loadNotifications()
  }, [loadNotifications])

  // Marcar como leída
  const markAsRead = useCallback(async (notificationId) => {
    await notificationService.markAsRead(notificationId)
    refresh()
  }, [refresh])

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    if (!user) return
    await notificationService.markAllAsRead(user.id)
    refresh()
  }, [user, refresh])

  // Eliminar notificación
  const deleteNotification = useCallback(async (notificationId) => {
    await notificationService.delete(notificationId)
    refresh()
  }, [refresh])

  // Cargar al montar y recargar periódicamente
  useEffect(() => {
    loadNotifications()

    const interval = setInterval(loadNotifications, 30000) // Cada 30 segundos
    return () => clearInterval(interval)
  }, [loadNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    notify, // Helpers para crear notificaciones
  }
}

export default useNotifications
