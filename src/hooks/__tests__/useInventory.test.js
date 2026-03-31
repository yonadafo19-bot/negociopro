/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useInventory } from '../useInventory'

// Simple mock services
const mockProducts = [
  {
    id: '1',
    name: 'Producto 1',
    stock_quantity: 10,
    cost_price: 100,
    selling_price: 150,
    is_active: true,
  },
  {
    id: '2',
    name: 'Producto 2',
    stock_quantity: 5,
    cost_price: 50,
    selling_price: 80,
    is_active: true,
  },
]

const mockServices = {
  getProducts: vi.fn().mockResolvedValue({ data: mockProducts, error: null }),
  getProduct: vi.fn(),
  createProduct: vi.fn().mockResolvedValue({
    data: { id: 'new-1', name: 'New Product', ...mockProducts[0] },
    error: null,
  }),
  updateProduct: vi.fn().mockResolvedValue({
    data: { id: '1', name: 'Updated Product', ...mockProducts[0] },
    error: null,
  }),
  deleteProduct: vi.fn().mockResolvedValue({ error: null }),
  getLowStockProducts: vi.fn().mockResolvedValue({ data: mockProducts, error: null }),
}

vi.mock('../../services/supabase', () => ({
  productsService: mockServices,
}))

// Mock useAuth
const mockUser = { id: 'test-user-id' }
vi.mock('../useAuth', () => ({
  useAuth: vi.fn(() => ({ user: mockUser })),
}))

describe('useInventory Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('cargar productos', () => {
    it('debe cargar la lista de productos', async () => {
      const { result } = renderHook(() => useInventory())

      await waitFor(() => {
        expect(result.current.products).toEqual(mockProducts)
        expect(result.current.loading).toBe(false)
      })

      expect(mockServices.getProducts).toHaveBeenCalledWith('test-user-id')
    })

    it('debe manejar errores al cargar productos', async () => {
      mockServices.getProducts.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error loading products' },
      })

      const { result } = renderHook(() => useInventory())

      await waitFor(() => {
        expect(result.current.error).toBe('Error loading products')
      })
    })

    it('debe usar mock data cuando no hay productos', async () => {
      mockServices.getProducts.mockResolvedValueOnce({ data: [], error: null })

      const { result } = renderHook(() => useInventory())

      await waitFor(() => {
        expect(result.current.products).toBeDefined()
        expect(result.current.isDemoMode).toBe(true)
      })
    })
  })

  describe('crear producto', () => {
    it('debe crear un producto exitosamente', async () => {
      const { result } = renderHook(() => useInventory())

      let response
      await act(async () => {
        response = await result.current.createProduct({
          name: 'New Product',
          sku: 'SKU123',
          category: 'Test',
          cost_price: 100,
          selling_price: 150,
          stock_quantity: 10,
        })
      })

      expect(response.error).toBeNull()
      expect(response.data.id).toBe('new-1')
    })

    it('debe manejar errores al crear producto', async () => {
      mockServices.createProduct.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error creating product' },
      })

      const { result } = renderHook(() => useInventory())

      const response = await result.current.createProduct({ name: 'Test' })

      expect(response.data).toBeNull()
      expect(response.error.message).toBe('Error creating product')
    })
  })

  describe('actualizar producto', () => {
    it('debe actualizar un producto existente', async () => {
      const { result } = renderHook(() => useInventory())

      const response = await result.current.updateProduct('1', {
        name: 'Updated Product',
      })

      expect(response.error).toBeNull()
      expect(response.data.name).toBe('Updated Product')
    })

    it('debe manejar errores al actualizar producto', async () => {
      mockServices.updateProduct.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error updating product' },
      })

      const { result } = renderHook(() => useInventory())

      const response = await result.current.updateProduct('1', { name: 'Updated' })

      expect(response.data).toBeNull()
      expect(response.error.message).toBe('Error updating product')
    })
  })

  describe('eliminar producto', () => {
    it('debe eliminar un producto existente', async () => {
      const { result } = renderHook(() => useInventory())

      const response = await result.current.deleteProduct('1')

      expect(response.error).toBeNull()
    })

    it('debe manejar errores al eliminar producto', async () => {
      mockServices.deleteProduct.mockResolvedValueOnce({
        error: { message: 'Error deleting product' },
      })

      const { result } = renderHook(() => useInventory())

      const response = await result.current.deleteProduct('1')

      expect(response.error.message).toBe('Error deleting product')
    })
  })

  describe('helpers', () => {
    it('debe buscar productos correctamente', async () => {
      const { result } = renderHook(() => useInventory())

      await waitFor(() => {
        const results = result.current.searchProducts('Producto 1')
        expect(results).toHaveLength(1)
        expect(results[0].name).toBe('Producto 1')
      })
    })

    it('debe filtrar por categoría', async () => {
      const { result } = renderHook(() => useInventory())

      await waitFor(() => {
        const allProducts = result.current.filterByCategory('all')
        expect(allProducts).toHaveLength(2)
      })
    })

    it('debe calcular helpers correctamente', async () => {
      const { result } = renderHook(() => useInventory())

      await waitFor(() => {
        expect(result.current.totalProducts).toBe(2)
        expect(result.current.isEmpty).toBe(false)
      })
    })
  })
})
