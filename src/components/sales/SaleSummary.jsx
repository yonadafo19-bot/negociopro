import { Card, CardContent } from '../common'
import { DollarSign, ShoppingCart, Percent } from 'lucide-react'

const SaleSummary = ({ items = [], subtotal = 0, tax = 0, discount = 0, total = 0 }) => {
  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Resumen de Venta
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {/* Items preview */}
        {items.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {items.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
              >
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>{formatCurrency(item.quantity * item.unit_price)}</span>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                Y {items.length - 3} productos más...
              </p>
            )}
          </div>
        )}

        {/* Totals */}
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(subtotal)}
            </span>
          </div>

          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Percent className="h-3 w-3" />
                IVA (16%)
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(tax)}
              </span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Descuento</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                -{formatCurrency(discount)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Total
            </span>
            <span className="text-primary-600 dark:text-primary-400">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SaleSummary
