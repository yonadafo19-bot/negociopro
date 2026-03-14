import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventory } from '../hooks/useInventory'
import { useSales } from '../hooks/useSales'
import { useContacts } from '../hooks/useContacts'
import { useAuth } from '../hooks/useAuth'
import { StatCard, RecentSales, LowStockProducts, SalesChart, QuickActions } from '../components/dashboard'
import {
  Package,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
} from 'lucide-react'

const DashboardPage = () => {
  const { profile } = useAuth()
  const {
    products,
    loading: loadingInventory,
    totalProducts,
    lowStockCount,
    getLowStockProducts,
  } = useInventory()

  const {
    transactions,
    loading: loadingSales,
    totalSales,
    salesCount,
    totalExpenses,
  } = useSales()

  const { customersCount } = useContacts('customer')

  const [lowStockProducts, setLowStockProducts] = useState([])

  // Cargar productos con stock bajo
  useEffect(() => {
    const loadLowStock = async () => {
      const products = await getLowStockProducts()
      setLowStockProducts(products)
    }
    loadLowStock()
  }, [products])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  // Preparar datos para el gráfico de ventas
  // Agrupar ventas por día (últimos 7 días)
  const salesChartData = useMemo(() => {
    const last7Days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const daySales = transactions.filter((t) => {
        const tDate = new Date(t.transaction_date)
        return (
          t.transaction_type === 'sale' &&
          tDate.toDateString() === date.toDateString()
        )
      })

      const total = daySales.reduce((sum, t) => sum + parseFloat(t.total_amount), 0)

      last7Days.push({
        name: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        amount: total,
      })
    }

    return last7Days
  }, [transactions])

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          ¡Hola, {profile?.full_name?.split(' ')[0] || 'Usuario'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido a {profile?.business_name || 'NegociPro'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Productos en Inventario"
          value={totalProducts}
          change={`${lowStockCount} con stock bajo`}
          changeType={lowStockCount > 0 ? 'negative' : 'neutral'}
          icon={Package}
          color="primary"
          loading={loadingInventory}
        />

        <StatCard
          title="Ventas Totales"
          value={formatCurrency(totalSales)}
          change={`${salesCount} ventas`}
          changeType="positive"
          icon={TrendingUp}
          color="success"
          loading={loadingSales}
        />

        <StatCard
          title="Clientes Registrados"
          value={customersCount}
          change="Activos"
          changeType="neutral"
          icon={Users}
          color="secondary"
        />

        <StatCard
          title="Balance del Mes"
          value={formatCurrency(totalSales - totalExpenses)}
          change="Ingresos - Gastos"
          changeType={totalSales - totalExpenses >= 0 ? 'positive' : 'negative'}
          icon={DollarSign}
          color={totalSales - totalExpenses >= 0 ? 'success' : 'danger'}
          loading={loadingSales}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <SalesChart data={salesChartData} loading={loadingSales} />
        </div>

        {/* Low Stock Alerts */}
        <div>
          <LowStockProducts
            products={lowStockProducts}
            loading={loadingInventory}
            onViewAll={() => {
              // Navigate to inventory page
              window.location.href = '/inventory'
            }}
          />
        </div>
      </div>

      {/* Recent Sales */}
      <div>
        <RecentSales sales={transactions} loading={loadingSales} />
      </div>
    </>
  )
}

export default DashboardPage
