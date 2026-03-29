import { useState } from 'react'
import { Card, Input, Button, Badge } from '../common'
import { TrendingDown, DollarSign, Receipt, CheckCircle } from 'lucide-react'
import { useContacts } from '../../hooks/useContacts'

const ExpenseForm = ({ onSubmit, onCancel, loading = false }) => {
  const { contacts: suppliers } = useContacts('supplier')

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    supplier_id: '',
    payment_method: 'cash',
    invoice: '',
  })

  const [errors, setErrors] = useState({})

  const categories = [
    { value: 'operativo', label: 'Gasto Operativo', icon: '🏢' },
    { value: 'servicios', label: 'Servicios', icon: '⚡' },
    { value: 'insumos', label: 'Insumos', icon: '📦' },
    { value: 'transporte', label: 'Transporte', icon: '🚗' },
    { value: 'combustible', label: 'Combustible', icon: '⛽' },
    { value: 'sueldos', label: 'Sueldos', icon: '💰' },
    { value: 'renta', label: 'Renta', icon: '🏠' },
    { value: 'impuestos', label: 'Impuestos', icon: '📋' },
    { value: 'mantenimiento', label: 'Mantenimiento', icon: '🔧' },
    { value: 'otro', label: 'Otro', icon: '📌' },
  ]

  const paymentMethods = [
    { value: 'cash', label: 'Efectivo', icon: '💵' },
    { value: 'card', label: 'Tarjeta', icon: '💳' },
    { value: 'transfer', label: 'Transferencia', icon: '🏦' },
  ]

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'El monto es requerido y debe ser mayor a 0'
    }

    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit({
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      supplier_id: formData.supplier_id || null,
      payment_method: formData.payment_method,
      invoice: formData.invoice || null,
      notes: `${formData.category}: ${formData.description}${formData.invoice ? ` (Factura: ${formData.invoice})` : ''}`,
    })
  }

  const formatCurrency = amount => {
    if (!amount) return ''
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(parseFloat(amount))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Monto */}
      <Card padding="md" className="border-primary-200 dark:border-primary-800">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Monto del Gasto *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full pl-12 pr-4 py-3 text-2xl font-bold border-2 rounded-kawaii focus:outline-none focus:ring-2 ${
              errors.amount
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-primary-300 focus:border-primary-500 focus:ring-primary-500 dark:border-primary-700 dark:bg-gray-800'
            } dark:text-white`}
          />
        </div>
        {formData.amount && parseFloat(formData.amount) > 0 && (
          <div className="mt-2 text-right">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total: {formatCurrency(formData.amount)}
            </span>
          </div>
        )}
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
        )}
      </Card>

      {/* Categoría */}
      <Card padding="md">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Categoría del Gasto *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map(category => (
            <button
              key={category.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
              className={`p-3 rounded-kawaii border-2 text-center transition-all ${
                formData.category === category.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <span className="text-2xl">{category.icon}</span>
              <p className="text-xs mt-1 font-medium text-gray-900 dark:text-white">
                {category.label}
              </p>
              {formData.category === category.value && (
                <CheckCircle className="h-4 w-4 text-primary-600 dark:text-primary-400 mx-auto mt-1" />
              )}
            </button>
          ))}
        </div>
        {errors.category && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
        )}
      </Card>

      {/* Descripción */}
      <Card padding="md">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descripción del Gasto *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe el gasto (ej: Compra de suministros de limpieza)"
          rows={3}
          className={`w-full px-4 py-3 border-2 rounded-kawaii focus:outline-none focus:ring-2 ${
            errors.description
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800'
          } dark:text-white`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </Card>

      {/* Campos opcionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Proveedor */}
        <Card padding="md">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Proveedor (Opcional)
          </label>
          <select
            name="supplier_id"
            value={formData.supplier_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Sin proveedor</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </Card>

        {/* Factura */}
        <Card padding="md">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            N° Factura (Opcional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Receipt className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="invoice"
              value={formData.invoice}
              onChange={handleChange}
              placeholder="FAC-001"
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </Card>
      </div>

      {/* Método de pago */}
      <Card padding="md">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Método de Pago
        </label>
        <div className="flex gap-2">
          {paymentMethods.map(method => (
            <button
              key={method.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, payment_method: method.value }))}
              className={`flex-1 p-3 rounded-kawaii border-2 text-center transition-all ${
                formData.payment_method === method.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <span className="text-xl">{method.icon}</span>
              <p className="text-xs mt-1 font-medium text-gray-900 dark:text-white">
                {method.label}
              </p>
            </button>
          ))}
        </div>
      </Card>

      {/* Resumen */}
      {formData.amount && (
        <Card padding="md" className="bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gasto a registrar</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {categories.find(c => c.value === formData.category)?.label || 'Sin categoría'}
              </p>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(formData.amount)}
            </p>
          </div>
        </Card>
      )}

      {/* Acciones */}
      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1"
          disabled={!formData.amount || loading}
          loading={loading}
          icon={TrendingDown}
        >
          Registrar Gasto
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="px-6"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default ExpenseForm
