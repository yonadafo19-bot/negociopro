/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useReports } from '../useReports'

// Mock de los hooks
vi.mock('../useSales', () => ({
  useSales: vi.fn(),
}))

vi.mock('../useInventory', () => ({
  useInventory: vi.fn(),
}))

vi.mock('../useContacts', () => ({
  useContacts: vi.fn(),
}))

describe('useReports Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockTransactions = [
    {
      id: '1',
      transaction_type: 'sale',
      total_amount: 100,
      transaction_date: '2024-01-15T10:00:00Z',
      contact_id: 'customer1',
      contacts: { name: 'Cliente 1' },
      transaction_items: [
        { product_id: 'prod1', quantity: 2, unit_price: 50, subtotal: 100 },
      ],
    },
    {
      id: '2',
      transaction_type: 'sale',
      total_amount: 75,
      transaction_date: '2024-01-16T11:00:00Z',
      contact_id: 'customer2',
      contacts: { name: 'Cliente 2' },
      transaction_items: [
        { product_id: 'prod2', quantity: 1, unit_price: 75, subtotal: 75 },
      ],
    },
    {
      id: '3',
      transaction_type: 'expense',
      total_amount: 50,
      transaction_date: '2024-01-17T12:00:00Z',
      transaction_items: [],
    },
    {
      id: '4',
      transaction_type: 'sale',
      total_amount: 200,
      transaction_date: '2024-01-18T13:00:00Z',
      contact_id: 'customer1',
      contacts: { name: 'Cliente 1' },
      transaction_items: [
        { product_id: 'prod1', quantity: 4, unit_price: 50, subtotal: 200 },
      ],
    },
  ]

  const mockProducts = [
    { id: 'prod1', name: 'Producto 1', category: 'Electrónica' },
    { id: 'prod2', name: 'Producto 2', category: 'Ropa' },
    { id: 'prod3', name: 'Producto 3', category: 'Electrónica' },
  ]

  const mockCustomers = [
    { id: 'customer1', name: 'Cliente 1', email: 'cliente1@example.com' },
    { id: 'customer2', name: 'Cliente 2', email: 'cliente2@example.com' },
  ]

  describe('top products', () => {
    it('debe calcular los productos más vendidos', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        expect(result.current.topProducts).toHaveLength(2)
        expect(result.current.topProducts[0].product_id).toBe('prod1')
        expect(result.current.topProducts[0].quantity).toBe(6) // 2 + 4
        expect(result.current.topProducts[0].revenue).toBe(300) // 100 + 200
      })
    })

    it('debe limitar a los top 10 productos', async () => {
      const manyTransactions = Array.from({ length: 15 }, (_, i) => ({
        id: `sale-${i}`,
        transaction_type: 'sale',
        transaction_items: [{ product_id: `prod${i}`, quantity: 1, unit_price: 10, subtotal: 10 }],
      }))

      const manyProducts = Array.from({ length: 15 }, (_, i) => ({
        id: `prod${i}`,
        name: `Producto ${i}`,
        category: 'Test',
      }))

      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: manyTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: manyProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: [] })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        expect(result.current.topProducts.length).toBeLessThanOrEqual(10)
      })
    })

    it('debe manejar productos sin nombre', async () => {
      const transactionsWithUnknownProduct = [
        {
          transaction_type: 'sale',
          transaction_items: [{ product_id: 'unknown', quantity: 1, unit_price: 10, subtotal: 10 }],
        },
      ]

      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: transactionsWithUnknownProduct })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: [] })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: [] })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        expect(result.current.topProducts[0].product_name).toBe('Desconocido')
      })
    })
  })

  describe('sales by period', () => {
    it('debe agrupar ventas por fecha', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        expect(result.current.salesByPeriod.length).toBeGreaterThan(0)
        const firstDay = result.current.salesByPeriod[0]
        expect(firstDay.date).toBe('2024-01-15')
        expect(firstDay.amount).toBe(100)
        expect(firstDay.count).toBe(1)
      })
    })

    it('debe ordenar ventas por fecha cronológicamente', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        const dates = result.current.salesByPeriod.map(s => s.date)
        const sortedDates = [...dates].sort()
        expect(dates).toEqual(sortedDates)
      })
    })

    it('debe excluir transacciones que no son ventas', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        const totalSales = result.current.salesByPeriod.reduce((sum, s) => sum + s.amount, 0)
        expect(totalSales).toBe(375) // 100 + 75 + 200 (excluding expense)
      })
    })
  })

  describe('sales by category', () => {
    it('debe agrupar ventas por categoría', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        expect(result.current.salesByCategory.length).toBeGreaterThan(0)
        const electronicsCategory = result.current.salesByCategory.find(c => c.category === 'Electrónica')
        expect(electronicsCategory).toBeDefined()
        expect(electronicsCategory.amount).toBe(300) // All prod1 sales
      })
    })

    it('debe ordenar categorías por monto descendente', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        const amounts = result.current.salesByCategory.map(c => c.amount)
        const sortedAmounts = [...amounts].sort((a, b) => b - a)
        expect(amounts).toEqual(sortedAmounts)
      })
    })

    it('debe manejar productos sin categoría', async () => {
      const productsWithoutCategory = [
        { id: 'prod1', name: 'Producto 1' }, // No category
      ]

      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: productsWithoutCategory })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        const noCategory = result.current.salesByCategory.find(c => c.category === 'Sin categoría')
        expect(noCategory).toBeDefined()
      })
    })
  })

  describe('top customers', () => {
    it('debe calcular los mejores clientes', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        expect(result.current.topCustomers.length).toBeGreaterThan(0)
        const topCustomer = result.current.topCustomers[0]
        expect(topCustomer.customer_id).toBe('customer1')
        expect(topCustomer.total_spent).toBe(300) // 100 + 200
        expect(topCustomer.purchase_count).toBe(2)
      })
    })

    it('debe limitar a los top 10 clientes', async () => {
      const manyCustomers = Array.from({ length: 15 }, (_, i) => ({
        id: `customer${i}`,
        name: `Cliente ${i}`,
      }))

      const manyTransactions = manyCustomers.map(customer => ({
        transaction_type: 'sale',
        contact_id: customer.id,
        total_amount: 10,
      }))

      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: manyTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: [] })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: manyCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        expect(result.current.topCustomers.length).toBeLessThanOrEqual(10)
      })
    })

    it('debe excluir ventas sin contacto', async () => {
      const transactionsWithoutContact = [
        { transaction_type: 'sale', contact_id: null, total_amount: 100 },
        { transaction_type: 'sale', contact_id: 'customer1', total_amount: 50 },
      ]

      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: transactionsWithoutContact })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: [] })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        expect(result.current.topCustomers.length).toBe(1)
        expect(result.current.topCustomers[0].customer_id).toBe('customer1')
      })
    })
  })

  describe('performance metrics', () => {
    it('debe calcular métricas de rendimiento', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        const metrics = result.current.performanceMetrics
        expect(metrics.totalRevenue).toBe(375) // 100 + 75 + 200
        expect(metrics.totalExpenses).toBe(50)
        expect(metrics.profit).toBe(325) // 375 - 50
        expect(metrics.salesCount).toBe(3)
      })
    })

    it('debe calcular margen de profit correctamente', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        const metrics = result.current.performanceMetrics
        const expectedMargin = (325 / 375) * 100 // profit / revenue * 100
        expect(metrics.profitMargin).toBeCloseTo(expectedMargin, 2)
      })
    })

    it('debe calcular ticket promedio', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        const metrics = result.current.performanceMetrics
        const expectedAvgTicket = 375 / 3 // totalRevenue / salesCount
        expect(metrics.avgTicketSize).toBeCloseTo(expectedAvgTicket, 2)
      })
    })

    it('debe retornar 0 para ticket promedio si no hay ventas', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: [] })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: [] })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: [] })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        expect(result.current.performanceMetrics.avgTicketSize).toBe(0)
      })
    })

    it('debe calcular métricas de hoy', async () => {
      const today = new Date().toISOString().split('T')[0]
      const todayTransaction = {
        transaction_type: 'sale',
        total_amount: 100,
        transaction_date: `${today}T10:00:00Z`,
      }

      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: [todayTransaction] })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: [] })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: [] })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        const metrics = result.current.performanceMetrics
        expect(metrics.todayRevenue).toBe(100)
        expect(metrics.todaySalesCount).toBe(1)
      })
    })
  })

  describe('comparisons', () => {
    it('debe calcular comparaciones vs periodo anterior', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        const comparisons = result.current.comparisons
        expect(comparisons).toHaveProperty('todayVsYesterday')
        expect(comparisons).toHaveProperty('thisWeekVsLast')
        expect(comparisons).toHaveProperty('thisMonthVsLast')
      })
    })

    it('debe manejar comparaciones cuando no hay datos del periodo anterior', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        const comparisons = result.current.comparisons
        // Should not throw and should return numbers
        expect(typeof comparisons.todayVsYesterday).toBe('number')
        expect(typeof comparisons.thisWeekVsLast).toBe('number')
        expect(typeof comparisons.thisMonthVsLast).toBe('number')
      })
    })
  })

  describe('hasData helper', () => {
    it('debe retornar true si hay transacciones', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        expect(result.current.hasData).toBe(true)
      })
    })

    it('debe retornar false si no hay transacciones', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: [] })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: [] })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: [] })

      const { result } = renderHook(() => useReports())

      await waitFor(() => {
        expect(result.current.hasData).toBe(false)
      })
    })
  })

  describe('exportToExcel', () => {
    it('debe exportar datos a Excel', async () => {
      vi.mocked(import('../useSales').useSales).mockReturnValue({ transactions: mockTransactions })
      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      // Mock XLSX library
      const mockXLSX = {
        utils: {
          book_new: vi.fn(() => ({ SheetNames: [], Sheets: {} })),
          json_to_sheet: vi.fn(() => ({})),
          book_append_sheet: vi.fn(),
        },
        writeFile: vi.fn(),
      }

      vi.doMock('xlsx', () => mockXLSX)

      const { result } = renderHook(() => useReports())

      await waitFor(async () => {
        await result.current.exportToExcel()
        // Should not throw
        expect(true).toBe(true)
      })
    })
  })

  describe('with filters', () => {
    it('debe pasar filtros al hook useSales', async () => {
      const filters = { transaction_type: 'sale' }

      vi.mocked(import('../useSales').useSales).mockImplementation((f) => {
        expect(f).toEqual(filters)
        return { transactions: mockTransactions }
      })

      vi.mocked(import('../useInventory').useInventory).mockReturnValue({ products: mockProducts })
      vi.mocked(import('../useContacts').useContacts).mockReturnValue({ contacts: mockCustomers })

      renderHook(() => useReports(filters))

      waitFor(() => {
        expect(import('../useSales').useSales).toHaveBeenCalledWith(filters)
      })
    })
  })
})
