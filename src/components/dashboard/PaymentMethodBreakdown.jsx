import { DollarSign, CreditCard, Wallet, Banknote } from 'lucide-react'

const PaymentMethodBreakdown = ({ salesByPaymentMethod = [], totalSales = 0 }) => {
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

  const methodConfig = {
    cash: {
      label: 'Efectivo',
      icon: Banknote,
      color: 'from-green-500 to-emerald-600',
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30',
      border: 'border-green-300 dark:border-green-600',
      text: 'text-green-700 dark:text-green-300',
      emoji: '💵'
    },
    card: {
      label: 'Tarjeta',
      icon: CreditCard,
      color: 'from-blue-500 to-cyan-600',
      bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30',
      border: 'border-blue-300 dark:border-blue-600',
      text: 'text-blue-700 dark:text-blue-300',
      emoji: '💳'
    },
    transfer: {
      label: 'Transferencia',
      icon: Wallet,
      color: 'from-purple-500 to-violet-600',
      bg: 'from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30',
      border: 'border-purple-300 dark:border-purple-600',
      text: 'text-purple-700 dark:text-purple-300',
      emoji: '🏦'
    },
    sin_registro: {
      label: 'Sin registro',
      icon: Wallet,
      color: 'from-gray-500 to-gray-600',
      bg: 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700',
      border: 'border-gray-300 dark:border-gray-600',
      text: 'text-gray-700 dark:text-gray-300',
      emoji: '❓'
    }
  }

  if (salesByPaymentMethod.length === 0) {
    return null
  }

  return (
    <div className="card-neo bg-white dark:bg-gray-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-neo bg-gradient-to-br from-accent-500 to-accent-600 shadow-neo-accent dark:shadow-neo-accent-dark">
          <DollarSign className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Ventas por Método de Pago</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Distribución de tus ventas</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {salesByPaymentMethod.map((method) => {
          const config = methodConfig[method.method] || methodConfig.sin_registro
          const percentage = totalSales > 0 ? (method.amount / totalSales) * 100 : 0

          return (
            <div
              key={method.method}
              className={`relative p-4 rounded-xl border-2 bg-gradient-to-br ${config.bg} ${config.border} transition-all hover:scale-105 hover:shadow-lg`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{config.emoji}</span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {config.label}
                  </span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/60 dark:bg-black/20 ${config.text}`}>
                  {formatPercent(percentage)}
                </span>
              </div>

              {/* Amount */}
              <div className="mb-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total vendido</p>
                <p className={`text-xl font-bold ${config.text}`}>
                  {formatCurrency(method.amount)}
                </p>
              </div>

              {/* Count */}
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{method.count} {method.count === 1 ? 'venta' : 'ventas'}</span>
                <config.icon className="h-4 w-4" />
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${config.color} opacity-80`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PaymentMethodBreakdown
