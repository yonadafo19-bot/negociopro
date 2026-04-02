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
  PaymentMethodBreakdown,
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
  const [greeting, setGreeting] = useState({ text: '', icon: '', date: '', time: '' })

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

  // Actualizar saludo, fecha y hora (Chile)
  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date()

      // Hora en Chile
      const chileTime = new Intl.DateTimeFormat('es-CL', {
        timeZone: 'America/Santiago',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now)

      // Día de la semana y fecha
      const dateStr = new Intl.DateTimeFormat('es-CL', {
        timeZone: 'America/Santiago',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(now)

      // Determinar saludo según la hora
      const hour = now.getHours()
      let greetingText = 'Buenas noches 🌙'
      let greetingIcon = '🌙'

      if (hour >= 5 && hour < 12) {
        greetingText = 'Buenos días ☀️'
        greetingIcon = '☀️'
      } else if (hour >= 12 && hour < 19) {
        greetingText = 'Buenas tardes 🌤️'
        greetingIcon = '🌤️'
      }

      setGreeting({
        text: greetingText,
        icon: greetingIcon,
        date: dateStr,
        time: chileTime
      })
    }

    updateGreeting()
    const interval = setInterval(updateGreeting, 60000) // Actualizar cada minuto

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  // Preparar datos para el gráfico de ventas
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

  // Calcular ventas por método de pago
  const salesByPaymentMethod = useMemo(() => {
    const paymentMethods = {}
    const sales = (transactions || []).filter(t => t.transaction_type === 'sale')

    sales.forEach(transaction => {
      const method = transaction.payment_method || 'sin_registro'

      if (!paymentMethods[method]) {
        paymentMethods[method] = {
          method,
          amount: 0,
          count: 0,
        }
      }

      paymentMethods[method].amount += parseFloat(transaction.total_amount || 0)
      paymentMethods[method].count += 1
    })

    return Object.values(paymentMethods).sort((a, b) => b.amount - a.amount)
  }, [transactions])

  // Los returns condicionales
  if (loading) {
    return <PageLoader text="Cargando dashboard..." />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-neo-lg p-8 text-center max-w-md">
          <div className="icon-btn-neo-lg mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-danger-500 dark:text-danger-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Error al cargar el dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Por favor, intenta recargar la página
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-neo-primary"
          >
            Recargar
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Welcome Section con saludo, fecha y hora */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {greeting.text}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {profile?.full_name?.split(' ')[0] || 'Usuario'} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              <span className="font-semibold text-primary-500 dark:text-primary-400">{profile?.business_name || 'NegociPro'}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
              {greeting.date}
            </p>
            <p className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 tabular-nums">
              {greeting.time}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard
          title="Productos"
          value={totalProducts}
          change={`${lowStockCount} con stock bajo`}
          changeType={lowStockCount > 0 ? 'negative' : 'neutral'}
          icon={Package}
          color="primary"
          loading={loadingInventory}
        />

        <StatCard
          title="Ventas"
          value={formatCurrency(totalSales)}
          change={`${salesCount} ventas`}
          changeType="positive"
          icon={TrendingUp}
          color="success"
          loading={loadingSales}
        />

        <StatCard
          title="Clientes"
          value={customersCount}
          change="Registrados"
          changeType="neutral"
          icon={Users}
          color="accent"
        />

        <StatCard
          title="Balance"
          value={formatCurrency(totalSales - totalExpenses)}
          change="Mes actual"
          changeType={totalSales - totalExpenses >= 0 ? 'positive' : 'negative'}
          icon={DollarSign}
          color={totalSales - totalExpenses >= 0 ? 'success' : 'danger'}
          loading={loadingSales}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Payment Method Breakdown */}
      <div className="mb-8">
        <PaymentMethodBreakdown salesByPaymentMethod={salesByPaymentMethod} totalSales={totalSales} />
      </div>

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
