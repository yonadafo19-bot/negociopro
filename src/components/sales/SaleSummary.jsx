import { Card, CardContent } from '../common'
import { DollarSign, ShoppingCart, Percent, Receipt } from 'lucide-react'

const SaleSummary = ({ items = [], subtotal = 0, tax = 0, discount = 0, total = 0 }) => {
  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  return (
    <Card className="bg-gray-100 dark:bg-gray-800 shadow-neo">
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-300 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <div className="p-2 bg-primary-500 dark:bg-primary-600 rounded-neo shadow-neo">
              <Receipt className="h-4 w-4 text-white" />
            </div>
            Resumen de Venta
          </h3>
          <span className="px-3 py-1 bg-light-base dark:bg-dark-bg-alt rounded-neo text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 shadow-neo-light-inset dark:shadow-neo-dark-inset">
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {/* Items preview */}
        {items.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto p-3 bg-light-base dark:bg-dark-bg-alt rounded-neo border border-gray-300 dark:border-gray-700 shadow-neo-light-inset dark:shadow-neo-dark-inset">
            {items.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-800 dark:text-gray-100"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">{formatCurrency(item.quantity * item.unit_price)}</span>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-sm text-gray-500 dark:text-gray-500 italic pt-2 border-t border-gray-300/50 dark:border-gray-700/50">
                Y {items.length - 3} productos más...
              </p>
            )}
          </div>
        )}

        {/* Totals */}
        <div className="space-y-3 pt-4 border-t border-gray-300 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {formatCurrency(subtotal)}
            </span>
          </div>

          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Percent className="h-3 w-3" />
                IVA (19%)
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {formatCurrency(tax)}
              </span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Descuento</span>
              <span className="font-medium text-success-500 dark:text-success-400">
                -{formatCurrency(discount)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-300 dark:border-gray-700">
            <span className="text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <div className="p-2 bg-success-500 dark:bg-success-600 rounded-neo shadow-neo">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              Total
            </span>
            <span className="text-primary-500 dark:text-primary-400">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SaleSummary
