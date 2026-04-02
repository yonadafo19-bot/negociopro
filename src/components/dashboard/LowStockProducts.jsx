import { Card, CardHeader, CardTitle, CardContent, Button } from '../common'
import { AlertTriangle, Package } from 'lucide-react'

const LowStockProducts = ({ products = [], loading = false, onViewAll }) => {
  return (
    <Card padding="lg" className="border-2 border-warning-500/30 dark:border-warning-400/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <div className="p-2 rounded-neo bg-gradient-to-br from-warning-500/10 to-warning-600/10">
            <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400" />
          </div>
          Alertas de Stock
          {products.length > 0 && (
            <span className="ml-2 px-2.5 py-0.5 bg-gradient-to-br from-warning-500 to-warning-600 text-white text-xs rounded-neo shadow-neo-warning dark:shadow-neo-warning-dark">
              {products.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 card-neo-inset-sm"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 card-neo-inset-sm w-3/4"></div>
                  <div className="h-3 card-neo-inset-sm w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="card-neo-sm p-3 hover:-translate-y-0.5 transition-transform duration-200"
              >
                <div className="flex items-center gap-3">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-neo border-2 border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-12 h-12 card-neo-inset-sm flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                      {product.name}
                    </p>

                    {product.category && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.category}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end mb-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-warning-600 dark:text-warning-400" />
                      <span className="text-sm font-bold text-warning-600 dark:text-warning-400">
                        {product.stock_quantity}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {' '}
                        / {product.min_stock_alert}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      unidades
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {products.length > 5 && (
              <Button variant="outline" size="sm" onClick={onViewAll} className="w-full mt-3">
                Ver {products.length - 5} más productos con stock bajo
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="icon-btn-neo-lg mx-auto mb-4">
              <Package className="h-8 w-8 text-success-500 dark:text-success-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              ¡Excelente! No hay productos con stock bajo
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default LowStockProducts
