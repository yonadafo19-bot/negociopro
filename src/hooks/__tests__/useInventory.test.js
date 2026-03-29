/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useInventory } from '../useInventory'

// Mock del servicio de Supabase
vi.mock('../../services/supabase', () => ({
  productsService: {
    getProducts: vi.fn(),
    getProduct: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    getLowStockProducts: vi.fn(),
  },
}))

describe('useInventory Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('cargar productos', () => {
    it('debe cargar la lista de productos', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Producto 1',
          stock_quantity: 10,
          sale_price: 100,
          is_active: true,
        },
        {
          id: '2',
          name: 'Producto 2',
          stock_quantity: 5,
          sale_price: 50,
          is_active: true,
        },
      ]

      vi.mocked(import('../../services/supabase').productsService.getProducts).mockResolvedValue({
        data: mockProducts,
        error: null,
      })

      const { result } = renderHook(() => useInventory())

      await waitFor(() => {
        expect(result.current.products).toEqual(mockProducts)
        expect(result.current.loading).toBe(false)
      })
    })

    it('debe manejar errores al cargar productos', async () => {
      vi.mocked(import('../../services/supabase').productsService.getProducts).mockResolvedValue({
        data: null,
        error: { message: 'Error loading products' },
      })

      const { result } = renderHook(() => useInventory())

      await waitFor(() => {
        expect(result.current.error).toBe('Error loading products')
      })
    })
  })

  describe('crear producto', () => {
    it('debe crear un producto exitosamente', async () => {
      const mockProduct = {
        name: 'Nuevo Producto',
        stock_quantity: 20,
        sale_price: 150,
        cost_price: 100,
        sku: 'SKU-001',
      }

      vi.mocked(import('../../services/supabase').productsService.createProduct).mockResolvedValue({
        data: { ...mockProduct, id: '123' },
        error: null,
      })

      const { result } = renderHook(() => useInventory())

      const { data, error } = await result.current.createProduct(mockProduct)

      expect(error).toBeNull()
      expect(data.id).toBe('123')
      expect(data.name).toBe('Nuevo Producto')
    })
  })

  describe('actualizar producto', () => {
    it('debe actualizar un producto existente', async () => {
      const productId = '123'
      const updates = {
        name: 'Producto Actualizado',
        stock_quantity: 15,
      }

      vi.mocked(import('../../services/supabase').productsService.updateProduct).mockResolvedValue({
        data: { ...updates, id: productId },
        error: null,
      })

      const { result } = renderHook(() => useInventory())

      const { data, error } = await result.current.updateProduct(productId, updates)

      expect(error).toBeNull()
      expect(data.id).toBe(productId)
      expect(data.name).toBe('Producto Actualizado')
    })
  })

  describe('eliminar producto (soft delete)', () => {
    it('debe marcar un producto como inactivo', async () => {
      const productId = '123'

      vi.mocked(import('../../services/supabase').productsService.deleteProduct).mockResolvedValue({
        data: null,
        error: null,
      })

      const { result } = renderHook(() => useInventory())

      const { error } = await result.current.deleteProduct(productId)

      expect(error).toBeNull()
    })
  })

  describe('productos con stock bajo', () => {
    it('debe obtener productos con stock bajo', async () => {
      const lowStockProducts = [
        {
          id: '1',
          name: 'Producto Bajo Stock',
          stock_quantity: 2,
          min_stock_alert: 5,
        },
      ]

      vi.mocked(
        import('../../services/supabase').productsService.getLowStockProducts
      ).mockResolvedValue({
        data: lowStockProducts,
        error: null,
      })

      const { result } = renderHook(() => useInventory())

      await waitFor(async () => {
        const products = await result.current.fetchLowStockProducts()
        expect(products).toEqual(lowStockProducts)
        expect(products[0].stock_quantity).toBeLessThan(products[0].min_stock_alert)
      })
    })
  })
})
