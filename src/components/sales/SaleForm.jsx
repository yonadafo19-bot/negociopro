import { useState, useEffect } from 'react'
import { Card, Input, Button, Badge, Modal } from '../common'
import { DollarSign, User, Plus, CheckCircle, ShoppingCart, Package, X, Mail, Phone } from 'lucide-react'
import { CartItem, SaleSummary, ProductSelector } from '.'
import { useInventory } from '../../hooks/useInventory'
import { useContacts } from '../../hooks/useContacts'
import { useAuth } from '../../hooks/useAuth'
import { notify } from '../../services/notificationService'

const SaleForm = ({ onSubmit, onCancel, loading = false }) => {
  const { user } = useAuth()
  const { products } = useInventory()
  const { contacts: customers, createContact } = useContacts('customer')

  const [cart, setCart] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')

  // Estado para modal de nuevo cliente
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [customerErrors, setCustomerErrors] = useState({})
  const [creatingCustomer, setCreatingCustomer] = useState(false)

  // Cálculos del carrito
  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  const tax = 0
  const discount = 0
  const total = subtotal + tax - discount

  const handleAddToCart = product => {
    const existingIndex = cart.findIndex(item => item.product_id === product.product_id)

    if (existingIndex >= 0) {
      const updatedCart = [...cart]
      const newItem = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + 1,
      }

      if (newItem.quantity <= product.stock_quantity) {
        updatedCart[existingIndex] = newItem
        setCart(updatedCart)
      }
    } else {
      setCart([...cart, { ...product, quantity: 1, max_stock: product.stock_quantity }])
    }
  }

  const handleUpdateCartItem = updatedItem => {
    setCart(cart.map(item => (item.product_id === updatedItem.product_id ? updatedItem : item)))
  }

  const handleRemoveFromCart = itemToRemove => {
    setCart(cart.filter(item => item.product_id !== itemToRemove.product_id))
  }

  // Crear nuevo cliente
  const handleCreateCustomer = async () => {
    const errors = {}

    if (!newCustomer.name.trim()) {
      errors.name = 'El nombre es requerido'
    }

    if (Object.keys(errors).length > 0) {
      setCustomerErrors(errors)
      return
    }

    setCustomerErrors({})
    setCreatingCustomer(true)

    try {
      const result = await createContact({
        name: newCustomer.name.trim(),
        email: newCustomer.email.trim() || null,
        phone: newCustomer.phone.trim() || null,
        contact_type: 'customer',
        is_active: true,
      })

      if (result) {
        // Seleccionar el nuevo cliente
        setSelectedCustomer(result.id)

        // Notificar
        await notify.customer.created(user.id, {
          name: result.name,
          email: result.email,
          phone: result.phone,
        })

        // Cerrar modal y limpiar
        setShowNewCustomerModal(false)
        setNewCustomer({ name: '', email: '', phone: '' })
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      setCustomerErrors({ general: 'Error al crear el cliente. Intenta nuevamente.' })
    } finally {
      setCreatingCustomer(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (cart.length === 0) {
      return
    }

    const saleData = {
      items: cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price,
        name: item.name,
      })),
      total,
      contact_id: selectedCustomer || null,
      notes,
      payment_method: paymentMethod,
    }

    console.log('Enviando venta con método de pago:', paymentMethod)
    console.log('Datos completos:', saleData)

    await onSubmit(saleData)
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Product selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer selection */}
          <Card padding="lg" className="card-neo bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-neo bg-gradient-to-br from-primary-500 to-primary-600 shadow-neo-primary dark:shadow-neo-primary-dark">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Cliente</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowNewCustomerModal(true)}
                icon={Plus}
              >
                Nuevo Cliente
              </Button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <select
                  value={selectedCustomer}
                  onChange={e => setSelectedCustomer(e.target.value)}
                  className="input-neo pr-10"
                >
                  <option value="">🛒 Venta general (sin cliente)</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                      {customer.email && ` (${customer.email})`}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Notas (opcional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Notas sobre la venta..."
                size="sm"
              />
            </div>
          </Card>

          {/* Product selector */}
          <Card padding="lg" className="card-neo bg-gradient-to-br from-accent-50 to-accent-100/50 dark:from-accent-900/20 dark:to-accent-800/20 border-accent-200 dark:border-accent-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-neo bg-gradient-to-br from-accent-500 to-accent-600 shadow-neo-accent dark:shadow-neo-accent-dark">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Seleccionar Productos</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 dark:from-accent-600 dark:to-accent-700 text-white text-sm font-bold shadow-md">
                {products.filter(p => p.is_active && p.stock_quantity > 0).length} disponibles
              </span>
            </div>

            <ProductSelector products={products} onAddToCart={handleAddToCart} cartItems={cart} />
          </Card>
        </div>

        {/* Right column - Summary and actions */}
        <div className="space-y-6">
          {/* Payment method */}
          <Card padding="lg" className="card-neo">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Método de Pago</h3>

            <div className="space-y-3">
              {[
                { value: 'cash', label: 'Efectivo', icon: '💵', color: 'from-green-500 to-emerald-600', border: 'border-green-300 dark:border-green-600', bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' },
                { value: 'card', label: 'Tarjeta', icon: '💳', color: 'from-blue-500 to-cyan-600', border: 'border-blue-300 dark:border-blue-600', bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' },
                { value: 'transfer', label: 'Transferencia', icon: '🏦', color: 'from-purple-500 to-violet-600', border: 'border-purple-300 dark:border-purple-600', bg: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20' },
              ].map(method => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={`w-full p-4 rounded-neo text-left transition-all duration-300 border-2 ${
                    paymentMethod === method.value
                      ? `bg-gradient-to-r ${method.color} text-white shadow-neo-primary dark:shadow-neo-primary-dark -translate-y-0.5 border-transparent`
                      : `bg-gradient-to-br ${method.bg} ${method.border} text-gray-800 dark:text-gray-200 hover:-translate-y-0.5 hover:shadow-md`
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium">{method.label}</span>
                    {paymentMethod === method.value && (
                      <CheckCircle className="h-5 w-5 text-white ml-auto" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Summary */}
          <Card padding="lg" className="card-neo bg-gradient-to-br from-success-50 to-success-100/50 dark:from-success-900/30 dark:to-success-800/30 border-success-200 dark:border-success-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success-500 dark:text-success-400" />
              Resumen
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-bold text-gray-800 dark:text-gray-100">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">IVA</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100">
                    {formatCurrency(tax)}
                  </span>
                </div>
              )}

              <div className="divider-neo my-3" />

              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-800 dark:text-gray-100">Total</span>
                <span className="text-success-700 dark:text-success-300 text-xl">{formatCurrency(total)}</span>
              </div>

              <div className="card-neo-inset-sm p-3 text-center bg-white dark:bg-gray-800">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  📦 {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3 sticky bottom-0">
            <Button
              type="submit"
              className="w-full"
              disabled={cart.length === 0 || loading}
              loading={loading}
              icon={DollarSign}
              size="lg"
            >
              {loading ? 'Procesando...' : `Completar Venta ${formatCurrency(total)}`}
            </Button>

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

        {/* Cart items - Full width at the bottom */}
        {cart.length > 0 && (
          <div className="lg:col-span-3">
            <Card padding="lg" className="card-neo bg-gradient-to-br from-success-50 to-success-100/50 dark:from-success-900/30 dark:to-success-800/30 border-success-200 dark:border-success-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-neo bg-gradient-to-br from-success-500 to-success-600 shadow-neo-success dark:shadow-neo-success-dark">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">Productos en el Carrito</h3>
                  <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-success-700 dark:text-success-300 font-bold text-sm border-2 border-success-300 dark:border-success-600">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                  </span>
                </div>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCart([])}
                    className="text-sm px-3 py-1.5 rounded-neo bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 hover:bg-danger-200 dark:hover:bg-danger-900/50 font-medium border border-danger-300 dark:border-danger-700 transition-colors"
                  >
                    Limpiar todo
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
        )}
      </form>

      {/* Modal para nuevo cliente */}
      {showNewCustomerModal && (
        <Modal
          isOpen={showNewCustomerModal}
          onClose={() => {
            setShowNewCustomerModal(false)
            setNewCustomer({ name: '', email: '', phone: '' })
            setCustomerErrors({})
          }}
          title="Nuevo Cliente"
          size="md"
        >
          <div className="space-y-4">
            {customerErrors.general && (
              <div className="p-3 rounded-neo bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-sm text-danger-700 dark:text-danger-300">
                {customerErrors.general}
              </div>
            )}

            <Input
              label="Nombre del cliente *"
              value={newCustomer.name}
              onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
              error={customerErrors.name}
              placeholder="Juan Pérez"
              icon={User}
              required
            />

            <Input
              label="Correo electrónico"
              type="email"
              value={newCustomer.email}
              onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
              placeholder="cliente@ejemplo.com"
              icon={Mail}
            />

            <Input
              label="Teléfono"
              type="tel"
              value={newCustomer.phone}
              onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              placeholder="+56 9 1234 5678"
              icon={Phone}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowNewCustomerModal(false)
                  setNewCustomer({ name: '', email: '', phone: '' })
                  setCustomerErrors({})
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleCreateCustomer}
                loading={creatingCustomer}
                className="flex-1"
                icon={Plus}
              >
                Crear Cliente
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default SaleForm
