import { useState, useMemo } from 'react'
import { useSales } from './useSales'
import { useInventory } from './useInventory'
import { useContacts } from './useContacts'
import { exportToPDF as exportPDFService } from '../services/exportService'

/**
 * Hook personalizado para reportes y analytics
 *
 * @example
 * const { topProducts, salesByPeriod, topCustomers, exportToExcel } = useReports()
 */
export const useReports = (filters = {}) => {
  const { transactions } = useSales(filters)
  const { products } = useInventory()
  const { contacts: customers } = useContacts('customer')

  // Productos más vendidos
  const topProducts = useMemo(() => {
    const productSales = {}

    transactions
      .filter(t => t.transaction_type === 'sale')
      .forEach(transaction => {
        if (transaction.transaction_items) {
          transaction.transaction_items.forEach(item => {
            if (!productSales[item.product_id]) {
              productSales[item.product_id] = {
                product_id: item.product_id,
                product_name: products.find(p => p.id === item.product_id)?.name || 'Desconocido',
                category: products.find(p => p.id === item.product_id)?.category || 'Sin categoría',
                quantity: 0,
                revenue: 0,
              }
            }
            productSales[item.product_id].quantity += item.quantity
            productSales[item.product_id].revenue +=
              item.subtotal || item.quantity * item.unit_price
          })
        }
      })

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)
  }, [transactions, products])

  // Ventas por periodo
  const salesByPeriod = useMemo(() => {
    const salesByDate = {}

    transactions
      .filter(t => t.transaction_type === 'sale')
      .forEach(transaction => {
        const date = new Date(transaction.transaction_date)
        const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD

        if (!salesByDate[dateKey]) {
          salesByDate[dateKey] = {
            date: dateKey,
            amount: 0,
            count: 0,
          }
        }

        salesByDate[dateKey].amount += parseFloat(transaction.total_amount)
        salesByDate[dateKey].count += 1
      })

    return Object.values(salesByDate).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [transactions])

  // Ventas por categoría
  const salesByCategory = useMemo(() => {
    const categorySales = {}

    transactions
      .filter(t => t.transaction_type === 'sale')
      .forEach(transaction => {
        if (transaction.transaction_items) {
          transaction.transaction_items.forEach(item => {
            const product = products.find(p => p.id === item.product_id)
            const category = product?.category || 'Sin categoría'

            if (!categorySales[category]) {
              categorySales[category] = {
                category,
                amount: 0,
                count: 0,
              }
            }

            categorySales[category].amount += item.subtotal || item.quantity * item.unit_price
            categorySales[category].count += item.quantity
          })
        }
      })

    return Object.values(categorySales).sort((a, b) => b.amount - a.amount)
  }, [transactions, products])

  // Top clientes
  const topCustomers = useMemo(() => {
    const customerSales = {}

    transactions
      .filter(t => t.transaction_type === 'sale' && t.contact_id)
      .forEach(transaction => {
        const customerId = transaction.contact_id
        const customer = customers.find(c => c.id === customerId)

        if (!customerSales[customerId]) {
          customerSales[customerId] = {
            customer_id: customerId,
            customer_name: customer?.name || 'Desconocido',
            email: customer?.email || '',
            total_spent: 0,
            purchase_count: 0,
          }
        }

        customerSales[customerId].total_spent += parseFloat(transaction.total_amount)
        customerSales[customerId].purchase_count += 1
      })

    return Object.values(customerSales)
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 10)
  }, [transactions, customers])

  // Métricas de rendimiento
  const performanceMetrics = useMemo(() => {
    const sales = transactions.filter(t => t.transaction_type === 'sale')
    const expenses = transactions.filter(t => t.transaction_type === 'expense')

    const totalRevenue = sales.reduce((sum, t) => sum + parseFloat(t.total_amount), 0)
    const totalExpenses = expenses.reduce((sum, t) => sum + parseFloat(t.total_amount), 0)
    const profit = totalRevenue - totalExpenses

    const avgTicketSize = sales.length > 0 ? totalRevenue / sales.length : 0

    // Ventas de hoy
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaySales = sales.filter(t => new Date(t.transaction_date) >= today)
    const todayRevenue = todaySales.reduce((sum, t) => sum + parseFloat(t.total_amount), 0)

    // Ventas de esta semana
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekSales = sales.filter(t => new Date(t.transaction_date) >= weekAgo)
    const weekRevenue = weekSales.reduce((sum, t) => sum + parseFloat(t.total_amount), 0)

    // Ventas de este mes
    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    const monthSales = sales.filter(t => new Date(t.transaction_date) >= monthAgo)
    const monthRevenue = monthSales.reduce((sum, t) => sum + parseFloat(t.total_amount), 0)

    return {
      totalRevenue,
      totalExpenses,
      profit,
      profitMargin: totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0,
      avgTicketSize,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      salesCount: sales.length,
      todaySalesCount: todaySales.length,
      weekSalesCount: weekSales.length,
      monthSalesCount: monthSales.length,
    }
  }, [transactions])

  // Comparativas
  const comparisons = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Ayer
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Semana pasada (mismo día de la semana)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)

    // Mes pasado (mismo día del mes)
    const lastMonth = new Date(today)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const todaySales = transactions.filter(t => {
      const tDate = new Date(t.transaction_date)
      return t.transaction_type === 'sale' && tDate >= today
    })

    const yesterdaySales = transactions.filter(t => {
      const tDate = new Date(t.transaction_date)
      return t.transaction_type === 'sale' && tDate >= yesterday && tDate < today
    })

    const lastWeekSales = transactions.filter(t => {
      const tDate = new Date(t.transaction_date)
      const lastWeekDay = new Date(lastWeek)
      const endOfLastWeek = new Date(lastWeekDay)
      endOfLastWeek.setDate(endOfLastWeek.getDate() + 1)
      return t.transaction_type === 'sale' && tDate >= lastWeekDay && tDate < endOfLastWeek
    })

    const lastMonthSales = transactions.filter(t => {
      const tDate = new Date(t.transaction_date)
      const lastMonthDay = new Date(lastMonth)
      const endOfLastMonth = new Date(lastMonthDay)
      endOfLastMonth.setMonth(endOfLastMonth.getMonth() + 1)
      return t.transaction_type === 'sale' && tDate >= lastMonthDay && tDate < endOfLastMonth
    })

    const todayRevenue = todaySales.reduce((sum, t) => sum + parseFloat(t.total_amount), 0)
    const yesterdayRevenue = yesterdaySales.reduce((sum, t) => sum + parseFloat(t.total_amount), 0)
    const lastWeekRevenue = lastWeekSales.reduce((sum, t) => sum + parseFloat(t.total_amount), 0)
    const lastMonthRevenue = lastMonthSales.reduce((sum, t) => sum + parseFloat(t.total_amount), 0)

    // Cálculos de cambio porcentual
    const todayVsYesterday =
      yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0

    const thisWeekVsLast =
      lastWeekRevenue > 0
        ? ((performanceMetrics.weekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100
        : 0

    const thisMonthVsLast =
      lastMonthRevenue > 0
        ? ((performanceMetrics.monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0

    return {
      todayVsYesterday,
      thisWeekVsLast,
      thisMonthVsLast,
    }
  }, [transactions, performanceMetrics])

  // Exportar a Excel
  const exportToExcel = async () => {
    const XLSX = await import('xlsx')

    // Preparar datos de productos más vendidos
    const productsData = topProducts.map((p, i) => ({
      Posición: i + 1,
      Producto: p.product_name,
      Categoría: p.category,
      'Unidades Vendidas': p.quantity,
      'Ingresos Totales': p.revenue,
    }))

    // Preparar datos de ventas
    const salesData = transactions
      .filter(t => t.transaction_type === 'sale')
      .map((t, i) => ({
        '#': i + 1,
        Fecha: new Date(t.transaction_date).toLocaleDateString('es-ES'),
        Cliente: t.contacts?.name || 'Venta general',
        Monto: parseFloat(t.total_amount),
        Productos: t.transaction_items?.length || 0,
      }))

    // Crear workbook
    const wb = XLSX.utils.book_new()

    // Hoja de productos más vendidos
    const ws1 = XLSX.utils.json_to_sheet(productsData)
    XLSX.utils.book_append_sheet(wb, ws1, 'Top Productos')

    // Hoja de ventas
    const ws2 = XLSX.utils.json_to_sheet(salesData)
    XLSX.utils.book_append_sheet(wb, ws2, 'Ventas')

    // Descargar archivo
    XLSX.writeFile(wb, `NegociPro_Reportes_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Exportar a PDF
  const exportToPDF = () => {
    const columns = [
      { header: 'Posición', field: 'index' },
      { header: 'Producto', field: 'product_name' },
      { header: 'Categoría', field: 'category' },
      { header: 'Unidades', field: 'quantity' },
      { header: 'Ingresos', field: 'revenue' },
    ]

    const dataWithIndex = topProducts.map((p, i) => ({
      ...p,
      index: i + 1,
    }))

    exportPDFService(dataWithIndex, {
      title: 'Top 10 Productos Más Vendidos',
      fileName: 'top_productos',
      columns,
    })
  }

  return {
    // Datos procesados
    topProducts,
    salesByPeriod,
    salesByCategory,
    topCustomers,
    performanceMetrics,
    comparisons,

    // Métodos
    exportToExcel,
    exportToPDF,

    // Helpers
    hasData: transactions.length > 0,
  }
}

export default useReports
