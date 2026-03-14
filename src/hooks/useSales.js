import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { transactionsService } from '../services/supabase'

/**
 * Hook personalizado para gestión de ventas y transacciones
 *
 * @example
 * const { transactions, loading, createSale, createExpense } = useSales()
 */
export const useSales = (filters = {}) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar transacciones
  const fetchTransactions = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await transactionsService.getTransactions(
        user.id,
        filters
      )

      if (error) throw error

      setTransactions(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching transactions:', err)
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
        },
        saleData.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.quantity * item.unit_price,
        }))
      )

      if (error) throw error

      // Actualizar lista localmente
      setTransactions((prev) => [data, ...prev])

      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
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
      setTransactions((prev) => [data, ...prev])

      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Crear ingreso (no relacionado con productos)
  const createIncome = async (incomeData) => {
    if (!user) return { error: new Error('No autenticado') }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await transactionsService.createTransaction(
        {
          user_id: user.id,
          transaction_type: 'income',
          total_amount: incomeData.amount,
          notes: incomeData.notes || null,
          transaction_date: new Date().toISOString(),
        },
        []
      )

      if (error) throw error

      // Actualizar lista localmente
      setTransactions((prev) => [data, ...prev])

      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
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

    // Métodos
    fetchTransactions,
    createSale,
    createExpense,
    createIncome,

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
