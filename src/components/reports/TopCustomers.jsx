import { Card, CardHeader, CardTitle, CardContent } from '../common'
import { Users, DollarSign, TrendingUp } from 'lucide-react'

const TopCustomers = ({ customers = [], loading = false }) => {
  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-secondary-500" />
          Mejores Clientes
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
        ) : customers.length > 0 ? (
          <div className="space-y-3">
            {customers.map((customer, index) => (
              <div
                key={customer.customer_id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-kawaii"
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0
                      ? 'bg-yellow-500'
                      : index === 1
                        ? 'bg-gray-400'
                        : index === 2
                          ? 'bg-orange-400'
                          : 'bg-secondary-500'
                  }`}
                >
                  {customer.customer_name?.charAt(0).toUpperCase() || 'U'}
                </div>

                {/* Customer info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {customer.customer_name}
                  </p>

                  {customer.email && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {customer.email}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(customer.total_spent)}
                    </span>

                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {customer.purchase_count}{' '}
                      {customer.purchase_count === 1 ? 'compra' : 'compras'}
                    </span>
                  </div>
                </div>

                {/* Total spent */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(customer.total_spent)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total gastado</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay clientes con compras registradas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TopCustomers
