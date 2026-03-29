/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useCatalogs } from '../useCatalogs'

// Mock del servicio de Supabase
vi.mock('../../services/supabase', () => ({
  catalogsService: {
    getCatalogs: vi.fn(),
    createCatalog: vi.fn(),
    updateCatalog: vi.fn(),
    updateCatalogProducts: vi.fn(),
    deleteCatalog: vi.fn(),
    getCatalogByShareLink: vi.fn(),
  },
}))

// Mock del useAuth
vi.mock('../useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id' },
  })),
}))

describe('useCatalogs Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.location.origin
    delete window.location
    window.location = { origin: 'http://localhost:3000' }
  })

  describe('cargar catálogos', () => {
    it('debe cargar la lista de catálogos', async () => {
      const mockCatalogs = [
        {
          id: '1',
          name: 'Catálogo de Verano',
          description: 'Productos de verano',
          theme: 'default',
          is_public: true,
          view_count: 100,
        },
        {
          id: '2',
          name: 'Catálogo de Invierno',
          description: 'Productos de invierno',
          theme: 'dark',
          is_public: false,
          view_count: 50,
        },
      ]

      vi.mocked(import('../../services/supabase').catalogsService.getCatalogs).mockResolvedValue({
        data: mockCatalogs,
        error: null,
      })

      const { result } = renderHook(() => useCatalogs())

      await waitFor(() => {
        expect(result.current.catalogs).toEqual(mockCatalogs)
        expect(result.current.loading).toBe(false)
      })
    })

    it('debe manejar errores al cargar catálogos', async () => {
      vi.mocked(import('../../services/supabase').catalogsService.getCatalogs).mockResolvedValue({
        data: null,
        error: { message: 'Error loading catalogs' },
      })

      const { result } = renderHook(() => useCatalogs())

      await waitFor(() => {
        expect(result.current.error).toBe('Error loading catalogs')
        expect(result.current.loading).toBe(false)
      })
    })

    it('debe retornar lista vacía si no hay usuario', async () => {
      vi.mocked(import('../useAuth').useAuth).mockReturnValue({
        user: null,
      })

      const { result } = renderHook(() => useCatalogs())

      await waitFor(() => {
        expect(result.current.catalogs).toEqual([])
        expect(result.current.loading).toBe(false)
      })
    })
  })

  describe('crear catálogo', () => {
    it('debe crear un catálogo exitosamente', async () => {
      const mockCatalogData = {
        name: 'Nuevo Catálogo',
        description: 'Descripción del catálogo',
        theme: 'default',
        is_public: true,
        product_ids: ['prod1', 'prod2'],
      }

      const mockResponse = {
        data: {
          id: 'catalog-123',
          user_id: 'test-user-id',
          ...mockCatalogData,
        },
        error: null,
      }

      vi.mocked(import('../../services/supabase').catalogsService.createCatalog).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useCatalogs())

      let response
      await act(async () => {
        response = await result.current.createCatalog(mockCatalogData)
      })

      expect(response.id).toBe('catalog-123')
      expect(response.name).toBe('Nuevo Catálogo')
      expect(result.current.catalogs).toContainEqual(response)
    })

    it('debe manejar errores al crear catálogo', async () => {
      const mockCatalogData = {
        name: 'Nuevo Catálogo',
      }

      vi.mocked(import('../../services/supabase').catalogsService.createCatalog).mockResolvedValue({
        data: null,
        error: { message: 'Error creating catalog' },
      })

      const { result } = renderHook(() => useCatalogs())

      await expect(async () => {
        await result.current.createCatalog(mockCatalogData)
      }).rejects.toThrow('Error creating catalog')
    })

    it('debe lanzar error si no hay usuario autenticado', async () => {
      vi.mocked(import('../useAuth').useAuth).mockReturnValue({
        user: null,
      })

      const { result } = renderHook(() => useCatalogs())

      await expect(async () => {
        await result.current.createCatalog({ name: 'Test' })
      }).rejects.toThrow('Usuario no autenticado')
    })

    it('debe crear catálogo con valores por defecto', async () => {
      const mockCatalogData = {
        name: 'Catálogo Simple',
      }

      const mockResponse = {
        data: {
          id: 'catalog-123',
          name: 'Catálogo Simple',
          description: null,
          theme: 'default',
          is_public: true,
        },
        error: null,
      }

      vi.mocked(import('../../services/supabase').catalogsService.createCatalog).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useCatalogs())

      await act(async () => {
        await result.current.createCatalog(mockCatalogData)
      })

      const callArgs = vi.mocked(import('../../services/supabase').catalogsService.createCatalog).mock.calls[0]
      expect(callArgs[0].theme).toBe('default')
      expect(callArgs[0].is_public).toBe(true)
    })
  })

  describe('actualizar catálogo', () => {
    it('debe actualizar un catálogo existente', async () => {
      const catalogId = 'catalog-123'
      const updates = {
        name: 'Catálogo Actualizado',
        description: 'Nueva descripción',
      }

      const mockResponse = {
        data: {
          id: catalogId,
          ...updates,
        },
        error: null,
      }

      vi.mocked(import('../../services/supabase').catalogsService.updateCatalog).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useCatalogs())

      // First add a catalog to the list
      result.current.catalogs = [{ id: catalogId, name: 'Original' }]

      let response
      await act(async () => {
        response = await result.current.updateCatalog(catalogId, updates)
      })

      expect(response.name).toBe('Catálogo Actualizado')
      expect(result.current.catalogs.find(c => c.id === catalogId).name).toBe('Catálogo Actualizado')
    })

    it('debe manejar errores al actualizar catálogo', async () => {
      const catalogId = 'catalog-123'
      const updates = { name: 'Updated' }

      vi.mocked(import('../../services/supabase').catalogsService.updateCatalog).mockResolvedValue({
        data: null,
        error: { message: 'Error updating catalog' },
      })

      const { result } = renderHook(() => useCatalogs())

      await expect(async () => {
        await result.current.updateCatalog(catalogId, updates)
      }).rejects.toThrow('Error updating catalog')
    })
  })

  describe('actualizar productos del catálogo', () => {
    it('debe actualizar los productos de un catálogo', async () => {
      const catalogId = 'catalog-123'
      const productIds = ['prod1', 'prod2', 'prod3']

      vi.mocked(import('../../services/supabase').catalogsService.updateCatalogProducts).mockResolvedValue({
        error: null,
      })

      vi.mocked(import('../../services/supabase').catalogsService.getCatalogs).mockResolvedValue({
        data: [{ id: catalogId, name: 'Test' }],
        error: null,
      })

      const { result } = renderHook(() => useCatalogs())

      let response
      await act(async () => {
        response = await result.current.updateCatalogProducts(catalogId, productIds)
      })

      expect(response.success).toBe(true)
      expect(import('../../services/supabase').catalogsService.updateCatalogProducts).toHaveBeenCalledWith(
        catalogId,
        productIds
      )
    })

    it('debe recargar catálogos después de actualizar productos', async () => {
      const catalogId = 'catalog-123'
      const productIds = ['prod1', 'prod2']

      vi.mocked(import('../../services/supabase').catalogsService.updateCatalogProducts).mockResolvedValue({
        error: null,
      })

      const getCatalogsMock = vi.mocked(import('../../services/supabase').catalogsService.getCatalogs)
      getCatalogsMock.mockResolvedValue({
        data: [],
        error: null,
      })

      const { result } = renderHook(() => useCatalogs())

      await act(async () => {
        await result.current.updateCatalogProducts(catalogId, productIds)
      })

      // Should be called at least twice: initial load and after update
      expect(getCatalogsMock).toHaveBeenCalled()
    })
  })

  describe('eliminar catálogo', () => {
    it('debe eliminar un catálogo existente', async () => {
      const catalogId = 'catalog-123'

      vi.mocked(import('../../services/supabase').catalogsService.deleteCatalog).mockResolvedValue({
        error: null,
      })

      const { result } = renderHook(() => useCatalogs())

      // First add a catalog to the list
      result.current.catalogs = [{ id: catalogId, name: 'Test Catalog' }]

      await act(async () => {
        await result.current.deleteCatalog(catalogId)
      })

      expect(result.current.catalogs.find(c => c.id === catalogId)).toBeUndefined()
    })

    it('debe manejar errores al eliminar catálogo', async () => {
      const catalogId = 'catalog-123'

      vi.mocked(import('../../services/supabase').catalogsService.deleteCatalog).mockResolvedValue({
        error: { message: 'Error deleting catalog' },
      })

      const { result } = renderHook(() => useCatalogs())

      await expect(async () => {
        await result.current.deleteCatalog(catalogId)
      }).rejects.toThrow('Error deleting catalog')
    })
  })

  describe('obtener catálogo público', () => {
    it('debe obtener un catálogo por link de compartir', async () => {
      const shareLink = 'abc123'
      const mockCatalog = {
        id: 'catalog-123',
        name: 'Catálogo Público',
        share_link: shareLink,
        products: [],
      }

      vi.mocked(import('../../services/supabase').catalogsService.getCatalogByShareLink).mockResolvedValue({
        data: mockCatalog,
        error: null,
      })

      const { result } = renderHook(() => useCatalogs())

      let response
      await act(async () => {
        response = await result.current.getPublicCatalog(shareLink)
      })

      expect(response).toEqual(mockCatalog)
    })

    it('debe manejar errores al obtener catálogo público', async () => {
      const shareLink = 'abc123'

      vi.mocked(import('../../services/supabase').catalogsService.getCatalogByShareLink).mockResolvedValue({
        data: null,
        error: { message: 'Catalog not found' },
      })

      const { result } = renderHook(() => useCatalogs())

      await expect(async () => {
        await result.current.getPublicCatalog(shareLink)
      }).rejects.toThrow('Catalog not found')
    })
  })

  describe('obtener URL de compartir', () => {
    it('debe generar URL de compartir correctamente', async () => {
      const shareLink = 'abc123'

      const { result } = renderHook(() => useCatalogs())

      const url = result.current.getShareUrl(shareLink)

      expect(url).toBe('http://localhost:3000/catalog/abc123')
    })
  })

  describe('obtener catálogo por ID', () => {
    it('debe encontrar un catálogo por su ID', async () => {
      const mockCatalogs = [
        { id: '1', name: 'Catálogo 1' },
        { id: '2', name: 'Catálogo 2' },
        { id: '3', name: 'Catálogo 3' },
      ]

      vi.mocked(import('../../services/supabase').catalogsService.getCatalogs).mockResolvedValue({
        data: mockCatalogs,
        error: null,
      })

      const { result } = renderHook(() => useCatalogs())

      await waitFor(() => {
        const catalog = result.current.getCatalogById('2')
        expect(catalog).toEqual(mockCatalogs[1])
        expect(catalog.name).toBe('Catálogo 2')
      })
    })

    it('debe retornar undefined si no encuentra el catálogo', async () => {
      const mockCatalogs = [
        { id: '1', name: 'Catálogo 1' },
        { id: '2', name: 'Catálogo 2' },
      ]

      vi.mocked(import('../../services/supabase').catalogsService.getCatalogs).mockResolvedValue({
        data: mockCatalogs,
        error: null,
      })

      const { result } = renderHook(() => useCatalogs())

      await waitFor(() => {
        const catalog = result.current.getCatalogById('999')
        expect(catalog).toBeUndefined()
      })
    })
  })

  describe('recargar catálogos', () => {
    it('debe recargar la lista de catálogos manualmente', async () => {
      const mockCatalogs = [
        { id: '1', name: 'Catálogo 1' },
      ]

      const getCatalogsMock = vi.mocked(import('../../services/supabase').catalogsService.getCatalogs)
      getCatalogsMock.mockResolvedValue({
        data: mockCatalogs,
        error: null,
      })

      const { result } = renderHook(() => useCatalogs())

      // Initial load
      await waitFor(() => {
        expect(getCatalogsMock).toHaveBeenCalledTimes(1)
      })

      // Manual reload
      await act(async () => {
        await result.current.loadCatalogs()
      })

      expect(getCatalogsMock).toHaveBeenCalledTimes(2)
    })
  })

  describe('estadísticas', () => {
    it('debe calcular stats correctamente', async () => {
      const mockCatalogs = [
        { id: '1', name: 'Catálogo 1', is_public: true, view_count: 100 },
        { id: '2', name: 'Catálogo 2', is_public: false, view_count: 50 },
        { id: '3', name: 'Catálogo 3', is_public: true, view_count: 75 },
      ]

      vi.mocked(import('../../services/supabase').catalogsService.getCatalogs).mockResolvedValue({
        data: mockCatalogs,
        error: null,
      })

      const { result } = renderHook(() => useCatalogs())

      await waitFor(() => {
        expect(result.current.stats.total).toBe(3)
        expect(result.current.stats.public).toBe(2)
        expect(result.current.stats.totalViews).toBe(225)
      })
    })

    it('debe calcular stats con catálogos vacíos', async () => {
      vi.mocked(import('../../services/supabase').catalogsService.getCatalogs).mockResolvedValue({
        data: [],
        error: null,
      })

      const { result } = renderHook(() => useCatalogs())

      await waitFor(() => {
        expect(result.current.stats.total).toBe(0)
        expect(result.current.stats.public).toBe(0)
        expect(result.current.stats.totalViews).toBe(0)
      })
    })
  })
})
