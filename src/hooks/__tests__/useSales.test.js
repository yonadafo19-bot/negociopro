/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useSales } from '../useSales'

// Mock del servicio de Supabase
vi.mock('../../services/supabase', () => ({
  transactionsService: {
    getTransactions: vi.fn(),
    createTransaction: vi.fn(),
  },
}))

// Mock del useAuth
vi.mock('../useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id' },
  })),
}))

describe('useSales Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('cargar transacciones', () => {
    it('debe cargar la lista de transacciones', async () => {
      const mockTransactions = [
        {
          id: '1',
          transaction_type: 'sale',
          total_amount: 100,
          transaction_date: '2024-01-01',
          transaction_items: [],
        },
        {
          id: '2',
          transaction_type: 'expense',
          total_amount: 50,
          transaction_date: '2024-01-02',
          transaction_items: [],
        },
      ]

      vi.mocked(import('../../services/supabase').transactionsService.getTransactions).mockResolvedValue({
        data: mockTransactions,
        error: null,
      })

      const { result } = renderHook(() => useSales())

      await waitFor(() => {
        expect(result.current.transactions).toEqual(mockTransactions)
        expect(result.current.loading).toBe(false)
      })
    })

    it('debe manejar errores al cargar transacciones', async () => {
      vi.mocked(import('../../services/supabase').transactionsService.getTransactions).mockResolvedValue({
        data: null,
        error: { message: 'Error loading transactions' },
      })

      const { result } = renderHook(() => useSales())

      await waitFor(() => {
        expect(result.current.error).toBe('Error loading transactions')
      })
    })

    it('debe cargar transacciones con filtros', async () => {
      const mockTransactions = [
        {
          id: '1',
          transaction_type: 'sale',
          total_amount: 100,
        },
      ]

      vi.mocked(import('../../services/supabase').transactionsService.getTransactions).mockResolvedValue({
        data: mockTransactions,
        error: null,
      })

      const filters = { transaction_type: 'sale' }
      renderHook(() => useSales(filters))

      await waitFor(() => {
        expect(import('../../services/supabase').transactionsService.getTransactions).toHaveBeenCalledWith(
          'test-user-id',
          filters
        )
      })
    })
  })

  describe('crear venta', () => {
    it('debe crear una venta exitosamente', async () => {
      const mockSaleData = {
        total: 150,
        contact_id: 'contact-123',
        notes: 'Test sale',
        items: [
          {
            product_id: 'product-1',
            quantity: 2,
            unit_price: 75,
          },
        ],
      }

      const mockResponse = {
        data: {
          id: 'sale-123',
          transaction_type: 'sale',
          total_amount: 150,
        },
        error: null,
      }

      vi.mocked(import('../../services/supabase').transactionsService.createTransaction).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useSales())

      let response
      await act(async () => {
        response = await result.current.createSale(mockSaleData)
      })

      expect(response.error).toBeNull()
      expect(response.data.id).toBe('sale-123')
      expect(result.current.transactions).toContainEqual(response.data)
    })

    it('debe manejar errores al crear venta', async () => {
      const mockSaleData = {
        total: 150,
        items: [{ product_id: 'product-1', quantity: 1, unit_price: 150 }],
      }

      vi.mocked(import('../../services/supabase').transactionsService.createTransaction).mockResolvedValue({
        data: null,
        error: { message: 'Error creating sale' },
      })

      const { result } = renderHook(() => useSales())

      let response
      await act(async () => {
        response = await result.current.createSale(mockSaleData)
      })

      expect(response.data).toBeNull()
      expect(response.error.message).toBe('Error creating sale')
      expect(result.current.error).toBe('Error creating sale')
    })

    it('debe retornar error si no hay usuario autenticado', async () => {
      vi.mocked(import('../useAuth').useAuth).mockReturnValue({
        user: null,
      })

      const { result } = renderHook(() => useSales())

      const response = await result.current.createSale({ total: 100, items: [] })

      expect(response.error).toBeDefined()
      expect(response.error.message).toBe('No autenticado')
    })
  })

  describe('crear gasto', () => {
    it('debe crear un gasto exitosamente', async () => {
      const mockExpenseData = {
        amount: 50,
        supplier_id: 'supplier-123',
        notes: 'Test expense',
      }

      const mockResponse = {
        data: {
          id: 'expense-123',
          transaction_type: 'expense',
          total_amount: 50,
        },
        error: null,
      }

      vi.mocked(import('../../services/supabase').transactionsService.createTransaction).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useSales())

      let response
      await act(async () => {
        response = await result.current.createExpense(mockExpenseData)
      })

      expect(response.error).toBeNull()
      expect(response.data.transaction_type).toBe('expense')
      expect(result.current.transactions).toContainEqual(response.data)
    })

    it('debe manejar errores al crear gasto', async () => {
      const mockExpenseData = {
        amount: 50,
      }

      vi.mocked(import('../../services/supabase').transactionsService.createTransaction).mockResolvedValue({
        data: null,
        error: { message: 'Error creating expense' },
      })

      const { result } = renderHook(() => useSales())

      let response
      await act(async () => {
        response = await result.current.createExpense(mockExpenseData)
      })

      expect(response.data).toBeNull()
      expect(response.error.message).toBe('Error creating expense')
    })
  })

  describe('crear ingreso', () => {
    it('debe crear un ingreso exitosamente', async () => {
      const mockIncomeData = {
        amount: 200,
        notes: 'Other income',
      }

      const mockResponse = {
        data: {
          id: 'income-123',
          transaction_type: 'income',
          total_amount: 200,
        },
        error: null,
      }

      vi.mocked(import('../../services/supabase').transactionsService.createTransaction).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useSales())

      let response
      await act(async () => {
        response = await result.current.createIncome(mockIncomeData)
      })

      expect(response.error).toBeNull()
      expect(response.data.transaction_type).toBe('income')
      expect(result.current.transactions).toContainEqual(response.data)
    })

    it('debe manejar errores al crear ingreso', async () => {
      const mockIncomeData = {
        amount: 200,
      }

      vi.mocked(import('../../services/supabase').transactionsService.createTransaction).mockResolvedValue({
        data: null,
        error: { message: 'Error creating income' },
      })

      const { result } = renderHook(() => useSales())

      let response
      await act(async () => {
        response = await result.current.createIncome(mockIncomeData)
      })

      expect(response.data).toBeNull()
      expect(response.error.message).toBe('Error creating income')
    })
  })

  describe('helpers y computed values', () => {
    it('debe calcular isEmpty correctamente', async () => {
      vi.mocked(import('../../services/supabase').transactionsService.getTransactions).mockResolvedValue({
        data: [],
        error: null,
      })

      const { result } = renderHook(() => useSales())

      await waitFor(() => {
        expect(result.current.isEmpty).toBe(true)
      })
    })

    it('debe calcular totalTransactions correctamente', async () => {
      const mockTransactions = [
        { id: '1', transaction_type: 'sale', total_amount: 100 },
        { id: '2', transaction_type: 'expense', total_amount: 50 },
        { id: '3', transaction_type: 'sale', total_amount: 75 },
      ]

      vi.mocked(import('../../services/supabase').transactionsService.getTransactions).mockResolvedValue({
        data: mockTransactions,
        error: null,
      })

      const { result } = renderHook(() => useSales())

      await waitFor(() => {
        expect(result.current.totalTransactions).toBe(3)
      })
    })

    it('debe calcular totalSales correctamente', async () => {
      const mockTransactions = [
        { id: '1', transaction_type: 'sale', total_amount: 100 },
        { id: '2', transaction_type: 'expense', total_amount: 50 },
        { id: '3', transaction_type: 'sale', total_amount: 75 },
      ]

      vi.mocked(import('../../services/supabase').transactionsService.getTransactions).mockResolvedValue({
        data: mockTransactions,
        error: null,
      })

      const { result } = renderHook(() => useSales())

      await waitFor(() => {
        expect(result.current.totalSales).toBe(175)
      })
    })

    it('debe calcular totalExpenses correctamente', async () => {
      const mockTransactions = [
        { id: '1', transaction_type: 'sale', total_amount: 100 },
        { id: '2', transaction_type: 'expense', total_amount: 50 },
        { id: '3', transaction_type: 'expense', total_amount: 25 },
      ]

      vi.mocked(import('../../services/supabase').transactionsService.getTransactions).mockResolvedValue({
        data: mockTransactions,
        error: null,
      })

      const { result } = renderHook(() => useSales())

      await waitFor(() => {
        expect(result.current.totalExpenses).toBe(75)
      })
    })

    it('debe calcular salesCount correctamente', async () => {
      const mockTransactions = [
        { id: '1', transaction_type: 'sale', total_amount: 100 },
        { id: '2', transaction_type: 'expense', total_amount: 50 },
        { id: '3', transaction_type: 'sale', total_amount: 75 },
      ]

      vi.mocked(import('../../services/supabase').transactionsService.getTransactions).mockResolvedValue({
        data: mockTransactions,
        error: null,
      })

      const { result } = renderHook(() => useSales())

      await waitFor(() => {
        expect(result.current.salesCount).toBe(2)
      })
    })
  })
})
