import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { transactionsService } from '../services/supabase'
import { mockSales } from '../data/mockData'
import { notify } from '../services/notificationsService'

/**
 * Hook personalizado para gestión de ventas y transacciones
 * Usa datos mock cuando no hay conexión a Supabase (modo demo)
 *
 * @example
 * const { transactions, createSale } = useSales()
 */
export const useSales = (filters = {}) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Cargar transacciones
  const fetchTransactions = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await transactionsService.getTransactions(user.id, filters)

      if (error) throw error

      // Si no hay transacciones, usar datos mock
      setTransactions(data && data.length > 0 ? data : mockSales)
      setIsDemoMode(data && data.length > 0 ? false : true)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching transactions:', err)
      // En caso de error, usar datos mock
      setTransactions(mockSales)
      setIsDemoMode(true)
    } finally {
      setLoading(false)
    }
  }

  // Crear venta
  const createSale = async (saleData) => {
    if (!user) return { error: new Error('No autenticado') }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await transactionsService.createTransaction(
        {
          user_id: user.id,
          transaction_type: 'sale',
          total_amount: saleData.total,
          contact_id: saleData.contact_id || null,
          notes: saleData.notes || null,
          transaction_date: new Date().toISOString(),
          payment_method: saleData.payment_method || 'cash',
        },
        saleData.items
      )

      if (error) throw error

      // Actualizar lista localmente
      const newSale = {
        id: `sale-${Date.now()}`,
        user_id: user.id,
        transaction_date: new Date().toISOString(),
        transaction_type: 'sale',
        total_amount: saleData.total,
        payment_method: saleData.payment_method || 'cash',
        status: 'completed',
        transaction_items: saleData.items.map(item => ({
          ...item,
          products: { name: item.name },
        })),
        contacts: saleData.contact ? [saleData.contact] : [],
        notes: saleData.notes || '',
      }

      setTransactions(prev => [newSale, ...prev])

      // Notificar venta creada
      await notify.sale.created(user.id, newSale)

      return { data: newSale, error: null }
    } catch (err) {
      setError(err.message)
      // En caso de error, agregar venta mock a la lista
      const newSale = {
        id: `sale-mock-${Date.now()}`,
        user_id: user.id,
        transaction_date: new Date().toISOString(),
        transaction_type: 'sale',
        total_amount: saleData.total,
        payment_method: saleData.payment_method || 'cash',
        status: 'completed',
        transaction_items: saleData.items.map(item => ({
          ...item,
          products: { name: item.name },
        })),
        contacts: saleData.contact ? [saleData.contact] : [],
        notes: saleData.notes || '',
      }
      setTransactions(prev => [newSale, ...prev])
      setIsDemoMode(true)

      // Notificar incluso en modo demo
      await notify.sale.created(user.id, newSale)

      return { data: newSale, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Crear gasto
  const createExpense = async (expenseData) => {
    if (!user) return { error: new Error('No autenticado') }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await transactionsService.createTransaction(
        {
          user_id: user.id,
          transaction_type: 'expense',
          total_amount: expenseData.amount,
          contact_id: expenseData.supplier_id || null,
          notes: expenseData.notes || null,
          transaction_date: new Date().toISOString(),
        },
        []
      )

      if (error) throw error

      // Actualizar lista localmente
      const newExpense = {
        id: `expense-${Date.now()}`,
        user_id: user.id,
        transaction_date: new Date().toISOString(),
        transaction_type: 'expense',
        total_amount: expenseData.amount,
        status: 'completed',
        transaction_items: [],
        contacts: expenseData.supplier ? [expenseData.supplier] : [],
        notes: expenseData.notes || '',
      }

      setTransactions(prev => [newExpense, ...prev])

      return { data: newExpense, error: null }
    } catch (err) {
      setError(err.message)
      // En caso de error, agregar gasto mock
      const newExpense = {
        id: `expense-mock-${Date.now()}`,
        user_id: user.id,
        transaction_date: new Date().toISOString(),
        transaction_type: 'expense',
        total_amount: expenseData.amount,
        status: 'completed',
        transaction_items: [],
        contacts: expenseData.supplier ? [expenseData.supplier] : [],
        notes: expenseData.notes || '',
      }
      setTransactions(prev => [newExpense, ...prev])
      setIsDemoMode(true)
      return { data: newExpense, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Cargar transacciones al montar
  useEffect(() => {
    fetchTransactions()
  }, [user])

  // Recargar cuando cambien los filtros
  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [JSON.stringify(filters)])

  return {
    // Estado
    transactions,
    loading,
    error,
    isDemoMode,

    // Métodos
    fetchTransactions,
    createSale,
    createExpense,

    // Helpers
    isEmpty: transactions.length === 0,
    totalTransactions: transactions.length,
    totalSales: transactions
      .filter((t) => t.transaction_type === 'sale')
      .reduce((sum, t) => sum + parseFloat(t.total_amount), 0),
    totalExpenses: transactions
      .filter((t) => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.total_amount), 0),
    salesCount: transactions.filter((t) => t.transaction_type === 'sale').length,
  }
}

export default useSales
