import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventory } from '../hooks/useInventory'
import { useSales } from '../hooks/useSales'
import { useContacts } from '../hooks/useContacts'
import { useAuth } from '../hooks/useAuth'
import {
  StatCard,
  RecentSales,
  LowStockProducts,
  SalesChart,
  QuickActions,
} from '../components/dashboard'
import { PageLoader } from '../components/common'
import { Package, TrendingUp, Users, DollarSign, AlertTriangle } from 'lucide-react'

const DashboardPage = () => {
  const { profile } = useAuth()
  const {
    products,
    loading: loadingInventory,
    totalProducts,
    lowStockCount,
    getLowStockProducts,
  } = useInventory()

  const { transactions, loading: loadingSales, totalSales, salesCount, totalExpenses } = useSales()

  const { customersCount } = useContacts('customer')

  const [lowStockProducts, setLowStockProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar productos con stock bajo
  useEffect(() => {
    const loadLowStock = async () => {
      try {
        setLoading(true)
        const allProducts = await getLowStockProducts()
        // Filtrar productos con stock bajo
        const lowStock = allProducts.filter((p) => p.stock_quantity <= p.min_stock_alert)
        setLowStockProducts(lowStock)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    loadLowStock()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  // Preparar datos para el gráfico de ventas - ANTES de cualquier return
  const salesChartData = useMemo(() => {
    const last7Days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const daySales = (transactions || []).filter(
        (t) => {
          const tDate = new Date(t.transaction_date)
          return t.transaction_type === 'sale' && tDate.toDateString() === date.toDateString()
        }
      )

      const total = daySales.reduce(
        (sum, t) => sum + parseFloat(t.total_amount || 0),
        0
      )

      last7Days.push({
        name: date.toLocaleDateString('es-CL', { weekday: 'short' }),
        amount: total,
      })
    }

    return last7Days
  }, [transactions])

  // Ahora sí, los returns condicionales
  if (loading) {
    return <PageLoader text="Cargando dashboard..." />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neo-bg dark:bg-dark-bg">
        <div className="card-neo p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-neo-danger dark:text-dark-danger mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neo-text dark:text-dark-text mb-2">
            Error al cargar el dashboard
          </h2>
          <p className="text-neo-text-muted dark:text-dark-text-muted mb-4">
            Por favor, intenta recargar la página
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-neo-primary px-6 py-2 rounded-neo"
          >
            Recargar
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neo-text dark:text-dark-text mb-2">
          ¡Hola, {profile?.full_name?.split(' ')[0] || 'Usuario'}! 👋
        </h1>
        <p className="text-neo-text-muted dark:text-dark-text-muted">
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
              window.location.href = '/app/inventory'
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
