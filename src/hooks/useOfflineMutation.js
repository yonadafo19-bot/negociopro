import { useConnection } from '../context/ConnectionContext'

/**
 * Hook para manejar mutaciones que funcionan offline
 * @param {Function} onlineFn - Función a ejecutar cuando hay conexión
 * @param {Function} queueFn - Función para agregar a la cola cuando no hay conexión
 * @returns {Function} - Función de mutación que maneja ambos estados
 */
export const useOfflineMutation = (onlineFn, queueFn) => {
  const { isOnline, queueOperations } = useConnection()

  return async (...args) => {
    if (isOnline) {
      // Ejecutar directamente si hay conexión
      return await onlineFn(...args)
    } else {
      // Agregar a la cola si no hay conexión
      await queueFn(...args)
      return { queued: true }
    }
  }
}

/**
 * Hook especial para crear productos offline
 */
export const useOfflineCreateProduct = () => {
  const { isOnline } = useConnection()

  return async (product) => {
    const { productsService } = await import('../services/supabase')
    const { queueOperations } = await import('../services/syncQueue')

    if (isOnline) {
      return await productsService.createProduct(product)
    } else {
      await queueOperations.queueCreateProduct(product)
      return { queued: true, offline: true }
    }
  }
}

/**
 * Hook especial para crear transacciones (ventas/gastos) offline
 */
export const useOfflineCreateTransaction = () => {
  const { isOnline } = useConnection()

  return async (transaction, items) => {
    const { transactionsService } = await import('../services/supabase')
    const { queueOperations } = await import('../services/syncQueue')

    if (isOnline) {
      return await transactionsService.createTransaction(transaction, items)
    } else {
      await queueOperations.queueTransaction(transaction, items)
      return { queued: true, offline: true }
    }
  }
}

/**
 * Hook especial para crear contactos offline
 */
export const useOfflineCreateContact = () => {
  const { isOnline } = useConnection()

  return async (contact) => {
    const { contactsService } = await import('../services/supabase')
    const { queueOperations } = await import('../services/syncQueue')

    if (isOnline) {
      return await contactsService.createContact(contact)
    } else {
      await queueOperations.queueCreateContact(contact)
      return { queued: true, offline: true }
    }
  }
}

/**
 * Hook especial para actualizar productos offline
 */
export const useOfflineUpdateProduct = () => {
  const { isOnline } = useConnection()

  return async (productId, updates) => {
    const { productsService } = await import('../services/supabase')
    const { queueOperations } = await import('../services/syncQueue')

    if (isOnline) {
      return await productsService.updateProduct(productId, updates)
    } else {
      await queueOperations.queueUpdateProduct(productId, updates)
      return { queued: true, offline: true }
    }
  }
}

/**
 * Hook para obtener estadísticas de sincronización
 */
export const useSyncStats = () => {
  const { pendingSync, isOnline, isSyncing, lastSyncTime } = useConnection()

  return {
    pendingSync,
    isOnline,
    isSyncing,
    lastSyncTime,
    hasPending: pendingSync > 0,
    canSync: isOnline && pendingSync > 0 && !isSyncing,
  }
}
