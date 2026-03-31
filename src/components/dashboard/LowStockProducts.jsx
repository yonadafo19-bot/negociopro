import { Card, CardHeader, CardTitle, CardContent, Button } from '../common'
import { AlertTriangle, Package } from 'lucide-react'

const LowStockProducts = ({ products = [], loading = false, onViewAll }) => {
  return (
    <Card className="border-neo-warning dark:border-dark-warning bg-neo-warning/5 dark:bg-dark-warning/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neo-text dark:text-dark-text">
          <AlertTriangle className="h-5 w-5 text-neo-warning dark:text-dark-warning" />
          Alertas de Stock
          {products.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-neo-warning dark:bg-dark-warning text-white text-xs rounded-neo shadow-neo-sm">
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
                <div className="w-12 h-12 bg-neo-bg dark:bg-dark-bg-alt rounded-neo shadow-inner-shadow"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neo-bg dark:bg-dark-bg-alt rounded mb-1 shadow-inner-shadow"></div>
                  <div className="h-3 bg-neo-bg dark:bg-dark-bg-alt rounded w-2/3 shadow-inner-shadow"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-neo-surface dark:bg-dark-surface rounded-neo border border-neo-border dark:border-dark-border shadow-neo-sm"
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-neo border border-neo-border dark:border-dark-border"
                  />
                ) : (
                  <div className="w-12 h-12 bg-neo-bg dark:bg-dark-bg-alt rounded-neo flex items-center justify-center border border-neo-border dark:border-dark-border shadow-inner-shadow">
                    <Package className="h-6 w-6 text-neo-text-muted dark:text-dark-text-muted" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neo-text dark:text-dark-text truncate">
                    {product.name}
                  </p>

                  {product.category && (
                    <p className="text-xs text-neo-text-muted dark:text-dark-text-muted">
                      {product.category}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <AlertTriangle className="h-3 w-3 text-neo-warning dark:text-dark-warning" />
                    <span className="text-sm font-bold text-neo-warning dark:text-dark-warning">
                      {product.stock_quantity}
                    </span>
                    <span className="text-xs text-neo-text-muted dark:text-dark-text-muted">
                      {' '}
                      / {product.min_stock_alert}
                    </span>
                  </div>
                  <p className="text-xs text-neo-text-muted dark:text-dark-text-muted">
                    unidades
                  </p>
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
            <AlertTriangle className="h-12 w-12 text-neo-success dark:text-dark-success mx-auto mb-3" />
            <p className="text-neo-text-muted dark:text-dark-text-muted">
              ¡Excelente! No hay productos con stock bajo
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default LowStockProducts
