/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOfflineMutation, useOfflineCreateProduct, useOfflineCreateTransaction, useOfflineCreateContact, useOfflineUpdateProduct, useSyncStats } from '../useOfflineMutation'

// Mock del ConnectionContext
const mockConnectionContext = {
  isOnline: true,
  queueOperations: {
    queueCreateProduct: vi.fn(),
    queueTransaction: vi.fn(),
    queueCreateContact: vi.fn(),
    queueUpdateProduct: vi.fn(),
  },
  pendingSync: 0,
  isSyncing: false,
  lastSyncTime: null,
}

vi.mock('../context/ConnectionContext', () => ({
  useConnection: vi.fn(() => mockConnectionContext),
}))

// Mock de los servicios
vi.mock('../../services/supabase', () => ({
  productsService: {
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
  },
  transactionsService: {
    createTransaction: vi.fn(),
  },
  contactsService: {
    createContact: vi.fn(),
  },
}))

// Mock del syncQueue
vi.mock('../../services/syncQueue', () => ({
  queueOperations: {
    queueCreateProduct: vi.fn(),
    queueTransaction: vi.fn(),
    queueCreateContact: vi.fn(),
    queueUpdateProduct: vi.fn(),
  },
}))

describe('useOfflineMutation Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockConnectionContext.isOnline = true
    mockConnectionContext.pendingSync = 0
    mockConnectionContext.isSyncing = false
    mockConnectionContext.lastSyncTime = null
  })

  describe('useOfflineMutation', () => {
    it('debe ejecutar función online cuando hay conexión', async () => {
      const onlineFn = vi.fn().mockResolvedValue({ success: true })
      const queueFn = vi.fn()

      const { result } = renderHook(() => useOfflineMutation(onlineFn, queueFn))

      let response
      await act(async () => {
        response = await result.current('arg1', 'arg2')
      })

      expect(onlineFn).toHaveBeenCalledWith('arg1', 'arg2')
      expect(queueFn).not.toHaveBeenCalled()
      expect(response).toEqual({ success: true })
    })

    it('debe encolar operación cuando no hay conexión', async () => {
      mockConnectionContext.isOnline = false

      const onlineFn = vi.fn()
      const queueFn = vi.fn().mockResolvedValue(undefined)

      const { result } = renderHook(() => useOfflineMutation(onlineFn, queueFn))

      let response
      await act(async () => {
        response = await result.current('arg1', 'arg2')
      })

      expect(onlineFn).not.toHaveBeenCalled()
      expect(queueFn).toHaveBeenCalledWith('arg1', 'arg2')
      expect(response).toEqual({ queued: true })
    })

    it('debe propagar errores de la función online', async () => {
      const onlineFn = vi.fn().mockRejectedValue(new Error('Network error'))
      const queueFn = vi.fn()

      const { result } = renderHook(() => useOfflineMutation(onlineFn, queueFn))

      await expect(async () => {
        await act(async () => {
          await result.current()
        })
      }).rejects.toThrow('Network error')

      expect(onlineFn).toHaveBeenCalled()
      expect(queueFn).not.toHaveBeenCalled()
    })
  })

  describe('useOfflineCreateProduct', () => {
    it('debe crear producto cuando está online', async () => {
      const mockProduct = { name: 'Test Product', price: 100 }
      const mockResponse = { data: { id: 'prod1', ...mockProduct }, error: null }

      const { productsService } = await import('../../services/supabase')
      vi.mocked(productsService.createProduct).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useOfflineCreateProduct())

      let response
      await act(async () => {
        response = await result.current(mockProduct)
      })

      expect(productsService.createProduct).toHaveBeenCalledWith(mockProduct)
      expect(response).toEqual(mockResponse)
    })

    it('debe encolar producto cuando está offline', async () => {
      mockConnectionContext.isOnline = false

      const mockProduct = { name: 'Test Product', price: 100 }

      const { queueOperations } = await import('../../services/syncQueue')
      vi.mocked(queueOperations.queueCreateProduct).mockResolvedValue(undefined)

      const { result } = renderHook(() => useOfflineCreateProduct())

      let response
      await act(async () => {
        response = await result.current(mockProduct)
      })

      expect(queueOperations.queueCreateProduct).toHaveBeenCalledWith(mockProduct)
      expect(response).toEqual({ queued: true, offline: true })
    })

    it('debe manejar errores al crear producto online', async () => {
      const mockProduct = { name: 'Test Product', price: 100 }

      const { productsService } = await import('../../services/supabase')
      vi.mocked(productsService.createProduct).mockResolvedValue({
        data: null,
        error: { message: 'Error creating product' },
      })

      const { result } = renderHook(() => useOfflineCreateProduct())

      let response
      await act(async () => {
        response = await result.current(mockProduct)
      })

      expect(productsService.createProduct).toHaveBeenCalledWith(mockProduct)
      expect(response.error).toBeDefined()
    })
  })

  describe('useOfflineCreateTransaction', () => {
    it('debe crear transacción cuando está online', async () => {
      const mockTransaction = { total_amount: 100, transaction_type: 'sale' }
      const mockItems = [{ product_id: 'prod1', quantity: 1 }]
      const mockResponse = { data: { id: 'trans1', ...mockTransaction }, error: null }

      const { transactionsService } = await import('../../services/supabase')
      vi.mocked(transactionsService.createTransaction).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useOfflineCreateTransaction())

      let response
      await act(async () => {
        response = await result.current(mockTransaction, mockItems)
      })

      expect(transactionsService.createTransaction).toHaveBeenCalledWith(mockTransaction, mockItems)
      expect(response).toEqual(mockResponse)
    })

    it('debe encolar transacción cuando está offline', async () => {
      mockConnectionContext.isOnline = false

      const mockTransaction = { total_amount: 100, transaction_type: 'sale' }
      const mockItems = [{ product_id: 'prod1', quantity: 1 }]

      const { queueOperations } = await import('../../services/syncQueue')
      vi.mocked(queueOperations.queueTransaction).mockResolvedValue(undefined)

      const { result } = renderHook(() => useOfflineCreateTransaction())

      let response
      await act(async () => {
        response = await result.current(mockTransaction, mockItems)
      })

      expect(queueOperations.queueTransaction).toHaveBeenCalledWith(mockTransaction, mockItems)
      expect(response).toEqual({ queued: true, offline: true })
    })

    it('debe manejar errores al crear transacción online', async () => {
      const mockTransaction = { total_amount: 100, transaction_type: 'sale' }
      const mockItems = []

      const { transactionsService } = await import('../../services/supabase')
      vi.mocked(transactionsService.createTransaction).mockResolvedValue({
        data: null,
        error: { message: 'Error creating transaction' },
      })

      const { result } = renderHook(() => useOfflineCreateTransaction())

      let response
      await act(async () => {
        response = await result.current(mockTransaction, mockItems)
      })

      expect(transactionsService.createTransaction).toHaveBeenCalledWith(mockTransaction, mockItems)
      expect(response.error).toBeDefined()
    })
  })

  describe('useOfflineCreateContact', () => {
    it('debe crear contacto cuando está online', async () => {
      const mockContact = { name: 'Test Contact', email: 'test@example.com' }
      const mockResponse = { data: { id: 'contact1', ...mockContact }, error: null }

      const { contactsService } = await import('../../services/supabase')
      vi.mocked(contactsService.createContact).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useOfflineCreateContact())

      let response
      await act(async () => {
        response = await result.current(mockContact)
      })

      expect(contactsService.createContact).toHaveBeenCalledWith(mockContact)
      expect(response).toEqual(mockResponse)
    })

    it('debe encolar contacto cuando está offline', async () => {
      mockConnectionContext.isOnline = false

      const mockContact = { name: 'Test Contact', email: 'test@example.com' }

      const { queueOperations } = await import('../../services/syncQueue')
      vi.mocked(queueOperations.queueCreateContact).mockResolvedValue(undefined)

      const { result } = renderHook(() => useOfflineCreateContact())

      let response
      await act(async () => {
        response = await result.current(mockContact)
      })

      expect(queueOperations.queueCreateContact).toHaveBeenCalledWith(mockContact)
      expect(response).toEqual({ queued: true, offline: true })
    })

    it('debe manejar errores al crear contacto online', async () => {
      const mockContact = { name: 'Test Contact', email: 'test@example.com' }

      const { contactsService } = await import('../../services/supabase')
      vi.mocked(contactsService.createContact).mockResolvedValue({
        data: null,
        error: { message: 'Error creating contact' },
      })

      const { result } = renderHook(() => useOfflineCreateContact())

      let response
      await act(async () => {
        response = await result.current(mockContact)
      })

      expect(contactsService.createContact).toHaveBeenCalledWith(mockContact)
      expect(response.error).toBeDefined()
    })
  })

  describe('useOfflineUpdateProduct', () => {
    it('debe actualizar producto cuando está online', async () => {
      const productId = 'prod1'
      const updates = { name: 'Updated Product', price: 150 }
      const mockResponse = { data: { id: productId, ...updates }, error: null }

      const { productsService } = await import('../../services/supabase')
      vi.mocked(productsService.updateProduct).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useOfflineUpdateProduct())

      let response
      await act(async () => {
        response = await result.current(productId, updates)
      })

      expect(productsService.updateProduct).toHaveBeenCalledWith(productId, updates)
      expect(response).toEqual(mockResponse)
    })

    it('debe encolar actualización cuando está offline', async () => {
      mockConnectionContext.isOnline = false

      const productId = 'prod1'
      const updates = { name: 'Updated Product', price: 150 }

      const { queueOperations } = await import('../../services/syncQueue')
      vi.mocked(queueOperations.queueUpdateProduct).mockResolvedValue(undefined)

      const { result } = renderHook(() => useOfflineUpdateProduct())

      let response
      await act(async () => {
        response = await result.current(productId, updates)
      })

      expect(queueOperations.queueUpdateProduct).toHaveBeenCalledWith(productId, updates)
      expect(response).toEqual({ queued: true, offline: true })
    })

    it('debe manejar errores al actualizar producto online', async () => {
      const productId = 'prod1'
      const updates = { name: 'Updated Product' }

      const { productsService } = await import('../../services/supabase')
      vi.mocked(productsService.updateProduct).mockResolvedValue({
        data: null,
        error: { message: 'Error updating product' },
      })

      const { result } = renderHook(() => useOfflineUpdateProduct())

      let response
      await act(async () => {
        response = await result.current(productId, updates)
      })

      expect(productsService.updateProduct).toHaveBeenCalledWith(productId, updates)
      expect(response.error).toBeDefined()
    })
  })

  describe('useSyncStats', () => {
    it('debe retornar estadísticas de sincronización', async () => {
      const { result } = renderHook(() => useSyncStats())

      expect(result.current.pendingSync).toBe(0)
      expect(result.current.isOnline).toBe(true)
      expect(result.current.isSyncing).toBe(false)
      expect(result.current.lastSyncTime).toBeNull()
    })

    it('debe calcular hasPending correctamente', async () => {
      mockConnectionContext.pendingSync = 5

      const { result } = renderHook(() => useSyncStats())

      expect(result.current.hasPending).toBe(true)
    })

    it('debe calcular hasPending como false cuando no hay pendientes', async () => {
      mockConnectionContext.pendingSync = 0

      const { result } = renderHook(() => useSyncStats())

      expect(result.current.hasPending).toBe(false)
    })

    it('debe calcular canSync correctamente cuando se puede sincronizar', async () => {
      mockConnectionContext.isOnline = true
      mockConnectionContext.pendingSync = 5
      mockConnectionContext.isSyncing = false

      const { result } = renderHook(() => useSyncStats())

      expect(result.current.canSync).toBe(true)
    })

    it('debe calcular canSync como false cuando está offline', async () => {
      mockConnectionContext.isOnline = false
      mockConnectionContext.pendingSync = 5
      mockConnectionContext.isSyncing = false

      const { result } = renderHook(() => useSyncStats())

      expect(result.current.canSync).toBe(false)
    })

    it('debe calcular canSync como false cuando ya está sincronizando', async () => {
      mockConnectionContext.isOnline = true
      mockConnectionContext.pendingSync = 5
      mockConnectionContext.isSyncing = true

      const { result } = renderHook(() => useSyncStats())

      expect(result.current.canSync).toBe(false)
    })

    it('debe calcular canSync como false cuando no hay pendientes', async () => {
      mockConnectionContext.isOnline = true
      mockConnectionContext.pendingSync = 0
      mockConnectionContext.isSyncing = false

      const { result } = renderHook(() => useSyncStats())

      expect(result.current.canSync).toBe(false)
    })

    it('debe retornar lastSyncTime', async () => {
      const lastSync = new Date('2024-01-15T10:00:00Z')
      mockConnectionContext.lastSyncTime = lastSync

      const { result } = renderHook(() => useSyncStats())

      expect(result.current.lastSyncTime).toBe(lastSync)
    })
  })

  describe('transición entre estados online/offline', () => {
    it('debe cambiar comportamiento cuando cambia el estado de conexión', async () => {
      const onlineFn = vi.fn().mockResolvedValue({ success: true })
      const queueFn = vi.fn()

      const { result, rerender } = renderHook(() => useOfflineMutation(onlineFn, queueFn))

      // Primero está online
      await act(async () => {
        await result.current('test')
      })

      expect(onlineFn).toHaveBeenCalled()
      expect(queueFn).not.toHaveBeenCalled()

      vi.clearAllMocks()

      // Ahora está offline
      mockConnectionContext.isOnline = false
      rerender()

      await act(async () => {
        await result.current('test')
      })

      expect(onlineFn).not.toHaveBeenCalled()
      expect(queueFn).toHaveBeenCalled()
    })
  })
})
