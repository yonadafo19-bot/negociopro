import { Card, CardHeader, CardTitle, CardContent, Button } from '../common'
import { AlertTriangle, Package } from 'lucide-react'

const LowStockProducts = ({ products = [], loading = false, onViewAll }) => {
  return (
    <Card className="border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-400">
          <AlertTriangle className="h-5 w-5" />
          Alertas de Stock
          {products.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
              {products.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-kawaii"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-3">
            {products.slice(0, 5).map(product => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-kawaii"
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-kawaii"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-kawaii flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {product.name}
                  </p>

                  {product.category && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">{product.category}</p>
                  )}
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <AlertTriangle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                      {product.stock_quantity}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      / {product.min_stock_alert}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">unidades</p>
                </div>
              </div>
            ))}

            {products.length > 5 && (
              <Button variant="outline" size="sm" onClick={onViewAll} className="w-full mt-2">
                Ver {products.length - 5} más productos con stock bajo
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              ¡Excelente! No hay productos con stock bajo
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default LowStockProducts
