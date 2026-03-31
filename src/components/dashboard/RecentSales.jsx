import { Card, CardHeader, CardTitle, CardContent, Badge } from '../common'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'

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
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 bg-neo-bg dark:bg-dark-bg-alt rounded-neo shadow-inner-shadow"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neo-bg dark:bg-dark-bg-alt rounded mb-1 shadow-inner-shadow"></div>
                  <div className="h-3 bg-neo-bg dark:bg-dark-bg-alt rounded w-2/3 shadow-inner-shadow"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sales.length > 0 ? (
          <div className="space-y-3">
            {sales.slice(0, 5).map((sale) => (
              <div
                key={sale.id}
                className="flex items-center gap-3 p-3 bg-neo-bg dark:bg-dark-bg-alt rounded-neo border border-neo-border dark:border-dark-border shadow-neo-sm hover:shadow-neo transition-all duration-200"
              >
                <div className="w-10 h-10 bg-neo-success/20 dark:bg-dark-success/20 rounded-neo flex items-center justify-center border border-neo-success dark:border-dark-success">
                  <DollarSign className="h-5 w-5 text-neo-success dark:text-dark-success" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-neo-text dark:text-dark-text truncate">
                      {sale.contacts?.name || 'Venta general'}
                    </p>
                    <Badge variant="success" size="sm">
                      Completado
                    </Badge>
                  </div>

                  <p className="text-xs text-neo-text-muted dark:text-dark-text-muted flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(sale.transaction_date)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-neo-text dark:text-dark-text">
                    {formatCurrency(sale.total_amount)}
                  </p>
                  {sale.transaction_items && sale.transaction_items.length > 0 && (
                    <p className="text-xs text-neo-text-muted dark:text-dark-text-muted">
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
            <DollarSign className="h-12 w-12 text-neo-text-muted dark:text-dark-text-muted mx-auto mb-3" />
            <p className="text-neo-text-muted dark:text-dark-text-muted">
              No hay ventas registradas aún
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentSales
