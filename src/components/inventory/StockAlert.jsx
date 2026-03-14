import { Card, Button } from '../common'
import { AlertTriangle, Package } from 'lucide-react'

const StockAlert = ({ products = [], onViewAll }) => {
  if (products.length === 0) return null

  return (
    <Card
      padding="md"
      className="border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-500 rounded-full">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>

          <div>
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-1">
              Alerta de Stock Bajo
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-500">
              {products.length} {products.length === 1 ? 'producto' : 'productos'}{' '}
              necesitan reabastecimiento
            </p>

            {/* Lista de productos */}
            <div className="mt-3 space-y-1">
              {products.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between text-xs bg-white dark:bg-gray-800 px-3 py-2 rounded-kawaii"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </span>
                  <span className="text-yellow-600 dark:text-yellow-400">
                    {product.stock_quantity} / {product.min_stock_alert}
                  </span>
                </div>
              ))}
            </div>

            {products.length > 3 && (
              <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-2">
                Y {products.length - 3} más...
              </p>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onViewAll}
          icon={Package}
          className="shrink-0"
        >
          Ver todos
        </Button>
      </div>
    </Card>
  )
}

export default StockAlert
