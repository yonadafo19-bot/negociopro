import { useState } from 'react'
import { Button, Input } from '../common'
import { Minus, Plus, Trash2, Package } from 'lucide-react'

const CartItem = ({ item, onUpdate, onRemove, maxStock = null }) => {
  const [quantity, setQuantity] = useState(item.quantity)

  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
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

  const handleQuantityChange = e => {
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
    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-kawaii">
      {/* Product info */}
      <div className="flex-1">
        <div className="flex items-start gap-3">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-kawaii"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-kawaii flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h4>

            {item.sku && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">SKU: {item.sku}</p>
            )}

            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(item.unit_price)} c/u
            </p>

            {maxStock && quantity >= maxStock && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Máximo disponible: {maxStock}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="p-2"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Input
          type="number"
          min="1"
          max={maxStock || undefined}
          value={quantity}
          onChange={handleQuantityChange}
          className="w-20 text-center"
        />

        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrement}
          disabled={maxStock ? quantity >= maxStock : false}
          className="p-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Subtotal and remove */}
      <div className="flex items-center gap-4">
        <div className="text-right w-24">
          <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(subtotal)}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
          title="Eliminar del carrito"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default CartItem
