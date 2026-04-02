import { useState } from 'react'
import { Input } from '../common'
import { Minus, Plus, Trash2, Package } from 'lucide-react'

const CartItem = ({ item, onUpdate, onRemove, maxStock = null }) => {
  const [quantity, setQuantity] = useState(item.quantity)

  // Calcular cantidad disponible
  const cartItem = item // El item ya viene del carrito
  const quantityInCart = quantity
  const availableQuantity = maxStock ? maxStock - quantityInCart : 999

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  const handleIncrement = () => {
    const newQuantity = quantity + 1

    // Verificar stock disponible
    if (maxStock && newQuantity > maxStock) {
      return // No exceder stock disponible
    }

    setQuantity(newQuantity)
    onUpdate({ ...item, quantity: newQuantity })
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onUpdate({ ...item, quantity: newQuantity })
    }
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1

    if (value < 1) return

    // Verificar stock disponible
    if (maxStock && value > maxStock) {
      setQuantity(maxStock)
      onUpdate({ ...item, quantity: maxStock })
      return
    }

    setQuantity(value)
    onUpdate({ ...item, quantity: value })
  }

  const subtotal = quantity * item.unit_price

  return (
    <div className="card-neo bg-white dark:bg-gray-800 p-3 space-y-2">
      {/* Header - Product name and image */}
      <div className="flex items-start gap-2">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-600 flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600 flex-shrink-0">
            <Package className="h-6 w-6 sm:h-7 sm:w-7 text-gray-500 dark:text-gray-400" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm mb-0.5 line-clamp-1">
            {item.name}
          </h4>

          <div className="flex items-center gap-2 flex-wrap">
            {item.sku && (
              <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
                {item.sku}
              </span>
            )}

            <span className="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400">
              {formatCurrency(item.unit_price)}
            </span>
          </div>
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={() => onRemove(item)}
          className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 hover:text-danger-600 dark:hover:text-danger-400 transition-colors flex-shrink-0"
          title="Eliminar"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* Middle row - Quantity and subtotal */}
      <div className="space-y-2">
        {/* Quantity controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            className="p-2 sm:p-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-danger-50 dark:hover:bg-danger-900/20 hover:text-danger-600 hover:border-danger-300 dark:hover:border-danger-600 transition-all disabled:opacity-50 active:scale-95 shadow-sm hover:shadow-md"
            onClick={handleDecrement}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <div className="w-14 h-9 sm:w-16 sm:h-10 card-neo-inset-sm flex items-center justify-center bg-white dark:bg-gray-800">
            <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{quantity}</span>
          </div>

          <button
            type="button"
            className="p-2 sm:p-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-success-50 dark:hover:bg-success-900/20 hover:text-success-600 hover:border-success-300 dark:hover:border-success-600 transition-all disabled:opacity-50 active:scale-95 shadow-sm hover:shadow-md"
            onClick={handleIncrement}
            disabled={maxStock ? quantity >= maxStock : false}
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Subtotal - full width */}
        <div className="text-center bg-success-50 dark:bg-success-900/20 rounded-lg py-1.5 px-2 border border-success-200 dark:border-success-700">
          <p className="text-[10px] text-gray-600 dark:text-gray-400">Subtotal</p>
          <p className="text-base sm:text-lg font-bold text-success-700 dark:text-success-300">
            {formatCurrency(subtotal)}
          </p>
        </div>
      </div>

      {/* Footer - Stock indicator */}
      <div className="flex items-center justify-between text-[10px]">
        <span className={`${availableQuantity <= 3 ? 'text-danger-600 dark:text-danger-400' : 'text-gray-500 dark:text-gray-400'}`}>
          📦 Stock: {availableQuantity}
        </span>

        {maxStock && quantity >= maxStock && (
          <span className="text-warning-600 dark:text-warning-400 font-medium">
            ⚠️ Máximo
          </span>
        )}
      </div>
    </div>
  )
}

export default CartItem
