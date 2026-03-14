import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { syncQueue, queueOperations } from '../services/syncQueue'

const ConnectionContext = createContext({})

export const useConnection = () => {
  const context = useContext(ConnectionContext)
  if (!context) {
    throw new Error('useConnection must be used within ConnectionProvider')
  }
  return context
}

export const ConnectionProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingSync, setPendingSync] = useState(0)
  const [lastSyncTime, setLastSyncTime] = useState(null)

  // Initialize sync queue
  useEffect(() => {
    syncQueue.init().then(() => {
      updatePendingCount()
    })
  }, [])

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingItems()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Update pending sync count
  const updatePendingCount = async () => {
    try {
      const stats = await syncQueue.getStats()
      setPendingSync(stats.total)
    } catch (error) {
      console.error('Error getting sync stats:', error)
    }
  }

  // Sync all pending items
  const syncPendingItems = useCallback(async () => {
    if (!isOnline || isSyncing) return

    try {
      setIsSyncing(true)
      const items = await syncQueue.getAllItems()

      for (const item of items) {
        try {
          await syncItem(item)
          await syncQueue.removeItem(item.id)
        } catch (error) {
          console.error('Failed to sync item:', item.id, error)
        }
      }

      setLastSyncTime(new Date())
      await updatePendingCount()
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setIsSyncing(false)
    }
  }, [isOnline, isSyncing])

  // Sync individual item
  const syncItem = async (item) => {
    const { resourceType, operation, data, resourceId } = item

    switch (resourceType) {
      case 'product':
        await syncProduct(operation, data, resourceId)
        break
      case 'transaction':
        await syncTransaction(data)
        break
      case 'contact':
        await syncContact(operation, data, resourceId)
        break
      case 'catalog':
        await syncCatalog(data)
        break
      default:
        console.warn('Unknown resource type:', resourceType)
    }
  }

  // Sync product operations
  const syncProduct = async (operation, data, resourceId) => {
    const { productsService } = await import('../services/supabase')

    switch (operation) {
      case 'create':
        await productsService.createProduct(data)
        break
      case 'update':
        await productsService.updateProduct(resourceId, data)
        break
      case 'delete':
        await productsService.deleteProduct(resourceId)
        break
    }
  }

  // Sync transaction
  const syncTransaction = async (data) => {
    const { transactionsService } = await import('../services/supabase')
    await transactionsService.createTransaction(data.transaction, data.items)
  }

  // Sync contact operations
  const syncContact = async (operation, data, resourceId) => {
    const { contactsService } = await import('../services/supabase')

    switch (operation) {
      case 'create':
        await contactsService.createContact(data)
        break
      case 'update':
        await contactsService.updateContact(resourceId, data)
        break
    }
  }

  // Sync catalog
  const syncCatalog = async (data) => {
    const { catalogsService } = await import('../services/supabase')
    await catalogsService.createCatalog(data.catalog, data.productIds)
  }

  // Manual sync trigger
  const manualSync = async () => {
    if (!isOnline) {
      throw new Error('No hay conexión a internet')
    }
    await syncPendingItems()
  }

  // Clear all pending items
  const clearPending = async () => {
    await syncQueue.clear()
    await updatePendingCount()
  }

  const value = {
    isOnline,
    isSyncing,
    pendingSync,
    lastSyncTime,
    manualSync,
    clearPending,
    queueOperations,
  }

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  )
}
