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
              className="w-16 h-16 object-cover rounded-neo border border-neo-border dark:border-dark-border shadow-neo-sm mb-2"
            />
          ) : (
            <div className="w-16 h-16 bg-neo-bg dark:bg-dark-bg-alt rounded-neo flex items-center justify-center mb-2 border border-neo-border dark:border-dark-border shadow-inner-shadow">
              <Package className="h-8 w-8 text-neo-text-muted dark:text-dark-text-muted" />
            </div>
          )}

          <h3 className="font-semibold text-neo-text dark:text-dark-text mb-1 line-clamp-2">
            {product.name}
          </h3>

          {product.sku && (
            <p className="text-xs text-neo-text-light dark:text-dark-text-light">
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
            className="text-neo-danger dark:text-dark-danger hover:bg-neo-danger/10 dark:hover:bg-dark-danger/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stock */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-neo-text-muted dark:text-dark-text-muted">Stock:</span>
          <span
            className={`font-semibold ${
              isLowStock
                ? 'text-neo-warning dark:text-dark-warning'
                : 'text-neo-text dark:text-dark-text'
            }`}
          >
            {product.stock_quantity} unidades
          </span>
        </div>

        {isLowStock && (
          <div className="flex items-center gap-1 text-xs text-neo-warning dark:text-dark-warning">
            <AlertTriangle className="h-3 w-3" />
            <span>Stock bajo (mín: {product.min_stock_alert})</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full bg-neo-bg dark:bg-dark-bg-alt rounded-neo h-2 mt-1 shadow-inner-shadow">
          <div
            className={`h-2 rounded-neo transition-all shadow-neo-sm ${
              isLowStock
                ? 'bg-neo-warning dark:bg-dark-warning'
                : product.stock_quantity > product.min_stock_alert * 2
                  ? 'bg-neo-success dark:bg-dark-success'
                  : 'bg-neo-primary dark:bg-dark-primary'
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
        <div className="bg-neo-bg dark:bg-dark-bg-alt p-2 rounded-neo border border-neo-border dark:border-dark-border shadow-inner-shadow">
          <p className="text-xs text-neo-text-muted dark:text-dark-text-muted">Costo</p>
          <p className="font-semibold text-neo-text dark:text-dark-text">
            {formatCurrency(product.cost_price)}
          </p>
        </div>

        <div className="bg-neo-success/10 dark:bg-dark-success/10 p-2 rounded-neo border border-neo-success/30 dark:border-dark-success/30">
          <p className="text-xs text-neo-text-muted dark:text-dark-text-muted">Venta</p>
          <p className="font-semibold text-neo-success dark:text-dark-success">
            {formatCurrency(product.selling_price)}
          </p>
        </div>
      </div>

      {/* Profit margin */}
      {product.cost_price > 0 && (
        <div className="flex items-center gap-1 text-xs text-neo-text-muted dark:text-dark-text-muted">
          <TrendingUp className="h-3 w-3 text-neo-primary dark:text-dark-primary" />
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
