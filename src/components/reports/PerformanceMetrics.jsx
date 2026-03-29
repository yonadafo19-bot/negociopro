import { Card, CardHeader, CardTitle, CardContent, Button } from '../common'
import { FileSpreadsheet, Download } from 'lucide-react'

const PerformanceMetrics = ({ metrics = {}, comparisons = {}, loading = false }) => {
  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const formatPercent = value => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const data = [
    {
      title: 'Ingresos Totales',
      value: formatCurrency(metrics.totalRevenue || 0),
      icon: '💰',
      color: 'green',
    },
    {
      title: 'Gastos Totales',
      value: formatCurrency(metrics.totalExpenses || 0),
      icon: '💸',
      color: 'red',
    },
    {
      title: 'Utilidad',
      value: formatCurrency(metrics.profit || 0),
      icon: '📈',
      color: metrics.profit >= 0 ? 'green' : 'red',
    },
    {
      title: 'Margen de Utilidad',
      value: `${metrics.profitMargin?.toFixed(1) || 0}%`,
      icon: '📊',
      color: metrics.profitMargin >= 0 ? 'green' : 'red',
    },
    {
      title: 'Ticket Promedio',
      value: formatCurrency(metrics.avgTicketSize || 0),
      icon: '🎫',
      color: 'blue',
    },
  ]

  const comparisonsData = [
    {
      title: 'Hoy vs Ayer',
      value: formatPercent(comparisons.todayVsYesterday || 0),
      icon: comparisons.todayVsYesterday >= 0 ? '📈' : '📉',
      color: comparisons.todayVsYesterday >= 0 ? 'green' : 'red',
    },
    {
      title: 'Esta Semana vs Semana Pasada',
      value: formatPercent(comparisons.thisWeekVsLast || 0),
      icon: comparisons.thisWeekVsLast >= 0 ? '📈' : '📉',
      color: comparisons.thisWeekVsLast >= 0 ? 'green' : 'red',
    },
    {
      title: 'Este Mes vs Mes Pasado',
      value: formatPercent(comparisons.thisMonthVsLast || 0),
      icon: comparisons.thisMonthVsLast >= 0 ? '📈' : '📉',
      color: comparisons.thisMonthVsLast >= 0 ? 'green' : 'red',
    },
  ]

  return (
    <>
      {/* Main metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {data.map((item, index) => (
          <Card
            key={index}
            padding="md"
            className={`border-l-4 ${
              item.color === 'green'
                ? 'border-l-green-500'
                : item.color === 'red'
                  ? 'border-l-red-500'
                  : 'border-l-blue-500'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">{item.title}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
          </Card>
        ))}
      </div>

      {/* Comparisons */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Comparativas de Rendimiento</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {comparisonsData.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-kawaii ${
                  item.color === 'green'
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    item.color === 'green'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ventas Hoy</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(metrics.todayRevenue || 0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {metrics.todaySalesCount || 0} transacciones
            </p>
          </div>
        </Card>

        <Card padding="md">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ventas Esta Semana</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(metrics.weekRevenue || 0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {metrics.weekSalesCount || 0} transacciones
            </p>
          </div>
        </Card>

        <Card padding="md">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ventas Este Mes</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(metrics.monthRevenue || 0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {metrics.monthSalesCount || 0} transacciones
            </p>
          </div>
        </Card>
      </div>
    </>
  )
}

export default PerformanceMetrics
