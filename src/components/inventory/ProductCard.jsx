import { Card, Badge, Button } from '../common'
import {
  Package,
  Edit,
  Trash2,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'

const ProductCard = ({ product, onEdit, onDelete, lowStock = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const isLowStock = product.stock_quantity <= product.min_stock_alert

  return (
    <Card
      padding="md"
      hover
      className={`transition-all duration-200 ${
        isLowStock
          ? 'border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10'
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
              className="w-16 h-16 object-cover rounded-kawaii mb-2"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-kawaii flex items-center justify-center mb-2">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          )}

          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
            {product.name}
          </h3>

          {product.sku && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
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
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {product.stock_quantity} unidades
          </span>
        </div>

        {isLowStock && (
          <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="h-3 w-3" />
            <span>Stock bajo (mín: {product.min_stock_alert})</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
          <div
            className={`h-2 rounded-full transition-all ${
              isLowStock
                ? 'bg-yellow-500'
                : product.stock_quantity > product.min_stock_alert * 2
                ? 'bg-green-500'
                : 'bg-blue-500'
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
        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-kawaii">
          <p className="text-xs text-gray-600 dark:text-gray-400">Costo</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(product.cost_price)}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-kawaii">
          <p className="text-xs text-gray-600 dark:text-gray-400">Venta</p>
          <p className="font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(product.selling_price)}
          </p>
        </div>
      </div>

      {/* Profit margin */}
      {product.cost_price > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <TrendingUp className="h-3 w-3" />
          <span>
            Margen:{' '}
            {(
              ((product.selling_price - product.cost_price) /
                product.cost_price) *
              100
            ).toFixed(0)}
            %
          </span>
        </div>
      )}
    </Card>
  )
}

export default ProductCard
