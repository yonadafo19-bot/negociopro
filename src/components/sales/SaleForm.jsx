import { useState, useEffect } from 'react'
import { Card, Input, Button, Badge } from '../common'
import { DollarSign, User, CheckCircle } from 'lucide-react'
import { CartItem, SaleSummary, ProductSelector } from '.'
import { useInventory } from '../../hooks/useInventory'
import { useContacts } from '../../hooks/useContacts'

const SaleForm = ({ onSubmit, onCancel, loading = false }) => {
  const { products } = useInventory()
  const { contacts: customers } = useContacts('customer')

  const [cart, setCart] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')

  // Cálculos del carrito
  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  const tax = subtotal * 0.16 // 16% IVA
  const discount = 0 // Por ahora sin descuentos
  const total = subtotal + tax - discount

  const handleAddToCart = product => {
    // Verificar si ya existe en el carrito
    const existingIndex = cart.findIndex(item => item.product_id === product.product_id)

    if (existingIndex >= 0) {
      // Actualizar cantidad
      const updatedCart = [...cart]
      const newItem = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + 1,
      }

      // Verificar stock
      if (newItem.quantity <= newItem.max_stock) {
        updatedCart[existingIndex] = newItem
        setCart(updatedCart)
      }
    } else {
      // Agregar nuevo item
      setCart([...cart, product])
    }
  }

  const handleUpdateCartItem = updatedItem => {
    setCart(cart.map(item => (item.product_id === updatedItem.product_id ? updatedItem : item)))
  }

  const handleRemoveFromCart = itemToRemove => {
    setCart(cart.filter(item => item.product_id !== itemToRemove.product_id))
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (cart.length === 0) {
      return // No hay productos
    }

    const saleData = {
      items: cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      total,
      contact_id: selectedCustomer || null,
      notes,
      payment_method: paymentMethod,
    }

    onSubmit(saleData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - Product selector */}
      <div className="lg:col-span-2 space-y-6">
        {/* Customer selection */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <User className="h-5 w-5" />
            Cliente
          </h3>

          <select
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Venta general (sin cliente)</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
                {customer.email && ` (${customer.email})`}
              </option>
            ))}
          </select>

          <Input
            label="Notas (opcional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notas sobre la venta..."
            className="mt-3"
          />
        </Card>

        {/* Product selector */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Seleccionar Productos
          </h3>

          <ProductSelector products={products} onAddToCart={handleAddToCart} cartItems={cart} />
        </Card>

        {/* Cart items */}
        {cart.length > 0 && (
          <Card padding="md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Productos en el Carrito
            </h3>

            <div className="space-y-3">
              {cart.map((item, index) => (
                <CartItem
                  key={`${item.product_id}-${index}`}
                  item={item}
                  onUpdate={handleUpdateCartItem}
                  onRemove={handleRemoveFromCart}
                />
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Right column - Summary and actions */}
      <div className="space-y-6">
        {/* Payment method */}
        <Card padding="md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Método de Pago</h3>

          <div className="space-y-2">
            {[
              { value: 'cash', label: 'Efectivo', icon: '💵' },
              { value: 'card', label: 'Tarjeta', icon: '💳' },
              { value: 'transfer', label: 'Transferencia', icon: '🏦' },
            ].map(method => (
              <button
                key={method.value}
                type="button"
                onClick={() => setPaymentMethod(method.value)}
                className={`w-full p-3 rounded-kawaii border-2 text-left transition-all ${
                  paymentMethod === method.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{method.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{method.label}</span>
                  {paymentMethod === method.value && (
                    <CheckCircle className="h-4 w-4 text-primary-600 dark:text-primary-400 ml-auto" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Summary */}
        <SaleSummary items={cart} subtotal={subtotal} tax={tax} discount={discount} total={total} />

        {/* Actions */}
        <div className="space-y-3">
          <Button
            type="submit"
            className="w-full"
            disabled={cart.length === 0 || loading}
            loading={loading}
            icon={DollarSign}
          >
            Completar Venta
          </Button>

          {cart.length > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCart([])}
              className="w-full"
              disabled={loading}
            >
              Limpiar Carrito
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="w-full"
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </form>
  )
}

export default SaleForm
