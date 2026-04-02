import { Card, CardHeader, CardTitle, CardContent, Badge } from '../common'
import { DollarSign, Calendar } from 'lucide-react'

const RecentSales = ({ sales = [], loading = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  const formatDate = (dateString) => {
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
    <Card padding="lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <DollarSign className="h-5 w-5 text-success-500 dark:text-success-400" />
          Ventas Recientes
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 card-neo-inset-sm"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 card-neo-inset-sm w-3/4"></div>
                  <div className="h-3 card-neo-inset-sm w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sales.length > 0 ? (
          <div className="space-y-3">
            {sales.slice(0, 5).map((sale) => (
              <div
                key={sale.id}
                className="card-neo-sm p-4 hover:-translate-y-0.5 transition-transform duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-neo bg-gradient-to-br from-success-500/10 to-success-600/10 dark:from-success-400/10 dark:to-success-500/10 flex items-center justify-center border-2 border-success-500/30 dark:border-success-400/30">
                    <DollarSign className="h-6 w-6 text-success-600 dark:text-success-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {sale.contacts?.name || 'Venta general'}
                      </p>
                      <Badge variant="success" size="sm">
                        Completado
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(sale.transaction_date)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800 dark:text-gray-100">
                      {formatCurrency(sale.total_amount)}
                    </p>
                    {sale.transaction_items && sale.transaction_items.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {sale.transaction_items.length}{' '}
                        {sale.transaction_items.length === 1 ? 'producto' : 'productos'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="icon-btn-neo-lg mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              No hay ventas registradas aún
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentSales
