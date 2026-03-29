import { Card, CardHeader, CardTitle, CardContent, Badge } from '../common'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'

const RecentSales = ({ sales = [], loading = false }) => {
  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    if (isToday) {
      return `Hoy, ${date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    }

    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Ventas Recientes
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sales.length > 0 ? (
          <div className="space-y-3">
            {sales.slice(0, 5).map(sale => (
              <div
                key={sale.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-kawaii hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {sale.contacts?.name || 'Venta general'}
                    </p>
                    <Badge variant="success" size="sm">
                      Completado
                    </Badge>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(sale.transaction_date)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(sale.total_amount)}
                  </p>
                  {sale.transaction_items && sale.transaction_items.length > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {sale.transaction_items.length}{' '}
                      {sale.transaction_items.length === 1 ? 'producto' : 'productos'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No hay ventas registradas aún</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentSales
