import { Card, Badge, Button } from '../common'
import { Package, Edit, Trash2, TrendingUp, AlertTriangle } from 'lucide-react'

const ProductCard = ({ product, onEdit, onDelete, lowStock = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  const isLowStock = product.stock_quantity <= product.min_stock_alert

  return (
    <Card
      padding="md"
      hover
      className={`transition-all duration-200 ${
        isLowStock
          ? 'border-neo-warning dark:border-dark-warning bg-neo-warning/5 dark:bg-dark-warning/5'
          : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-neo border border-gray-300 dark:border-gray-700 shadow-neo-sm mb-2"
            />
          ) : (
            <div className="w-16 h-16 bg-light-base dark:bg-dark-bg-alt rounded-neo flex items-center justify-center mb-2 border border-gray-300 dark:border-gray-700 shadow-neo-light-inset dark:shadow-neo-dark-inset">
              <Package className="h-8 w-8 text-gray-600 dark:text-gray-400" />
            </div>
          )}

          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 line-clamp-2">
            {product.name}
          </h3>

          {product.sku && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              SKU: {product.sku}
            </p>
          )}

          {product.category && (
            <Badge variant="secondary" size="sm" className="mt-2">
              {product.category}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product)}
            title="Eliminar"
            className="text-danger-500 dark:text-danger-400 hover:bg-danger-500/10 dark:hover:bg-danger-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stock */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Stock:</span>
          <span
            className={`font-semibold ${
              isLowStock
                ? 'text-warning-500 dark:text-warning-400'
                : 'text-gray-800 dark:text-gray-100'
            }`}
          >
            {product.stock_quantity} unidades
          </span>
        </div>

        {isLowStock && (
          <div className="flex items-center gap-1 text-xs text-warning-500 dark:text-warning-400">
            <AlertTriangle className="h-3 w-3" />
            <span>Stock bajo (mín: {product.min_stock_alert})</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full bg-light-base dark:bg-dark-bg-alt rounded-neo h-2 mt-1 shadow-neo-light-inset dark:shadow-neo-dark-inset">
          <div
            className={`h-2 rounded-neo transition-all shadow-neo-sm ${
              isLowStock
                ? 'bg-warning-500 dark:bg-warning-600'
                : product.stock_quantity > product.min_stock_alert * 2
                  ? 'bg-success-500 dark:bg-success-600'
                  : 'bg-primary-500 dark:bg-primary-600'
            }`}
            style={{
              width: `${Math.min(
                (product.stock_quantity / (product.min_stock_alert * 3)) * 100,
                100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-light-base dark:bg-dark-bg-alt p-2 rounded-neo border border-gray-300 dark:border-gray-700 shadow-neo-light-inset dark:shadow-neo-dark-inset">
          <p className="text-xs text-gray-600 dark:text-gray-400">Costo</p>
          <p className="font-semibold text-gray-800 dark:text-gray-100">
            {formatCurrency(product.cost_price)}
          </p>
        </div>

        <div className="bg-success-500/10 dark:bg-success-500/10 p-2 rounded-neo border border-success-500/30 dark:border-success-500/30">
          <p className="text-xs text-gray-600 dark:text-gray-400">Venta</p>
          <p className="font-semibold text-success-500 dark:text-success-400">
            {formatCurrency(product.selling_price)}
          </p>
        </div>
      </div>

      {/* Profit margin */}
      {product.cost_price > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <TrendingUp className="h-3 w-3 text-primary-500 dark:text-primary-400" />
          <span>
            Margen:{' '}
            {(((product.selling_price - product.cost_price) / product.cost_price) *
              100).toFixed(0)}
            %
          </span>
        </div>
      )}
    </Card>
  )
}

export default ProductCard
