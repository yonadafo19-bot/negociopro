import { Card } from '../common'
import { DollarSign, TrendingUp } from 'lucide-react'

const PaymentMethodMetrics = ({ salesByPaymentMethod = [], totalRevenue = 0 }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`
  }

  const methodColors = {
    cash: {
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30',
      border: 'border-green-300 dark:border-green-600',
      text: 'text-green-700 dark:text-green-300',
      icon: '💵'
    },
    card: {
      bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30',
      border: 'border-blue-300 dark:border-blue-600',
      text: 'text-blue-700 dark:text-blue-300',
      icon: '💳'
    },
    transfer: {
      bg: 'from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30',
      border: 'border-purple-300 dark:border-purple-600',
      text: 'text-purple-700 dark:text-purple-300',
      icon: '🏦'
    },
    sin_registro: {
      bg: 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700',
      border: 'border-gray-300 dark:border-gray-600',
      text: 'text-gray-700 dark:text-gray-300',
      icon: '❓'
    }
  }

  if (salesByPaymentMethod.length === 0) {
    return null
  }

  return (
    <Card padding="lg" className="card-neo">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-neo bg-gradient-to-br from-accent-500 to-accent-600 shadow-neo-accent dark:shadow-neo-accent-dark">
          <DollarSign className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Ventas por Método de Pago</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Distribución de ventas por forma de pago</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {salesByPaymentMethod.map((method) => {
          const colors = methodColors[method.method] || methodColors.sin_registro
          const percentage = totalRevenue > 0 ? (method.amount / totalRevenue) * 100 : 0

          return (
            <div
              key={method.method}
              className={`p-4 rounded-xl border-2 bg-gradient-to-br ${colors.bg} ${colors.border} transition-all hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{colors.icon}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/50 dark:bg-black/20 ${colors.text}`}>
                  {formatPercent(percentage)}
                </span>
              </div>

              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                {method.label}
              </h4>

              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Total:</span>
                  <span className={`text-lg font-bold ${colors.text}`}>
                    {formatCurrency(method.amount)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Ventas:</span>
                  <span className={`font-semibold ${colors.text}`}>
                    {method.count} {method.count === 1 ? 'venta' : 'ventas'}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-2 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${colors.text.replace('text-', 'from-')} to-current opacity-80 transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Total general */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total de ventas registradas</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalRevenue)}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default PaymentMethodMetrics
