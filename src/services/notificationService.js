/**
 * Servicio de Notificaciones para el Usuario
 *
 * Proporciona toast de éxito y error
 * Cachea las notificaciones para evitar duplicados
 */

// Estado de notificaciones
const notificationState = {
  success: new Set(),
  error: new Set(),
  loading: new Set(),
}

const showNotification = (message, type = 'success') => {
  // Buscar un callback de toast existente
  const event = new CustomEvent('notification', { detail: message, type })
  window.dispatchEvent(event)

}

const showErrorNotification = (message) => {
  const event = new CustomEvent('notification', { detail: message, type: 'error' })
  window.dispatchEvent(event)
}

const showLoadingNotification = () => {
  const event = new CustomEvent('loading', {})
  window.dispatchEvent(event)
}

const hideLoadingNotification = () => {
  const event = new CustomEvent('loading-hide', {})
  window.dispatchEvent(event)
}

// Cache para evitar notificaciones duplicadas
const sentNotifications = new Set()

// Función para mostrar notificación
export function notify(message, type = 'success', duration = 5000) {
  // Verificar si ya se mostró esta notificación recientemente
  const cacheKey = `${type}_${message}`
  if (sentNotifications.has(cacheKey)) {
    return // Ya se mostró, no duplicar
  }

  // Marcar como enviada
  sentNotifications.add(cacheKey)

  // Emitir evento
  const event = new CustomEvent('notification', {
    detail: message,
    type,
  duration,
  timeout: duration,
  })

  window.dispatchEvent(event)

  // Auto ocultar después de la duración
  setTimeout(() => {
    sentNotifications.delete(cacheKey)
  }, duration)
}

// Función para mostrar error
export function notifyError(message, details = {}) {
  const cacheKey = `error_${message}`

  if (sentNotifications.has(cacheKey)) return

  sentNotifications.add(cacheKey)

  const event = new CustomEvent('notification', {
    detail: message,
    type: 'error',
    details,
  })

  window.dispatchEvent(event)

  setTimeout(() => {
    sentNotifications.delete(cacheKey)
  }, 3000)
}

// Función para mostrar loading
export function notifyLoading(message) {
  const event = new CustomEvent('loading', { detail: message })
  window.dispatchEvent(event)
}

export function hideLoading() {
  const event = new CustomEvent('loading-hide', {})
  window.dispatchEvent(event)
}

export default {
  notify,
  notifyError,
  notifyLoading,
  hideLoading,
  notificationState,
}
