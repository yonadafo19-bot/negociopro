import { useState, useEffect } from 'react'
import { Input, Button, Card } from '../common'
import { validatePrice, validateStock, validateRequired } from '../../utils/validators'
import { Package, DollarSign, Barcode, Hash, AlertCircle } from 'lucide-react'

const ProductForm = ({ product = null, onSubmit, onCancel, loading = false }) => {
  const isEditing = !!product

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    category: '',
    cost_price: '',
    selling_price: '',
    stock_quantity: '',
    min_stock_alert: '5',
    image_url: '',
  })

  const [errors, setErrors] = useState({})

  // Cargar datos si es edición
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        category: product.category || '',
        cost_price: product.cost_price?.toString() || '',
        selling_price: product.selling_price?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '0',
        min_stock_alert: product.min_stock_alert?.toString() || '5',
        image_url: product.image_url || '',
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    const nameError = validateRequired(formData.name, 'Nombre')
    if (nameError) newErrors.name = nameError

    const costError = validatePrice(formData.cost_price, 'Costo')
    if (costError) newErrors.cost_price = costError

    const priceError = validatePrice(formData.selling_price, 'Precio de venta')
    if (priceError) newErrors.selling_price = priceError

    const stockError = validateStock(formData.stock_quantity, 'Stock')
    if (stockError) newErrors.stock_quantity = stockError

    const minStockError = validateStock(formData.min_stock_alert, 'Stock mínimo')
    if (minStockError) newErrors.min_stock_alert = minStockError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      sku: formData.sku.trim() || null,
      barcode: formData.barcode.trim() || null,
      category: formData.category.trim() || null,
      cost_price: parseFloat(formData.cost_price),
      selling_price: parseFloat(formData.selling_price),
      stock_quantity: parseInt(formData.stock_quantity),
      min_stock_alert: parseInt(formData.min_stock_alert),
      image_url: formData.image_url.trim() || null,
    }

    onSubmit(productData)
  }

  const categories = [
    'Alimentos',
    'Bebidas',
    'Limpieza',
    'Higiene',
    'Electrónica',
    'Ropa',
    'Hogar',
    'Juguetes',
    'Oficina',
    'Otro',
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Información básica */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Información Básica
        </h3>

        <div className="space-y-4">
          <Input
            label="Nombre del producto *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Ej: Café Premium 1kg"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del producto..."
              rows={3}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU (opcional)"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              error={errors.sku}
              icon={Hash}
              placeholder="CAF-001"
            />

            <Input
              label="Código de barras (opcional)"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              error={errors.barcode}
              icon={Barcode}
              placeholder="7501234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Precios */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Precios
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Costo *"
            type="number"
            step="0.01"
            min="0"
            name="cost_price"
            value={formData.cost_price}
            onChange={handleChange}
            error={errors.cost_price}
            placeholder="0.00"
            required
          />

          <Input
            label="Precio de venta *"
            type="number"
            step="0.01"
            min="0"
            name="selling_price"
            value={formData.selling_price}
            onChange={handleChange}
            error={errors.selling_price}
            placeholder="0.00"
            required
          />
        </div>

        {formData.cost_price && formData.selling_price && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-kawaii">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Margen de ganancia:
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {(
                  ((parseFloat(formData.selling_price) -
                    parseFloat(formData.cost_price)) /
                    parseFloat(formData.cost_price)) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Inventario */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventario
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Cantidad en stock *"
            type="number"
            min="0"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            error={errors.stock_quantity}
            placeholder="0"
            required
          />

          <Input
            label="Alerta de stock bajo *"
            type="number"
            min="0"
            name="min_stock_alert"
            value={formData.min_stock_alert}
            onChange={handleChange}
            error={errors.min_stock_alert}
            placeholder="5"
            required
            helperText="Notificar cuando el stock sea menor a este valor"
          />
        </div>
      </div>

      {/* Imagen */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Imagen del producto
        </h3>

        <div className="flex items-center gap-4">
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt="Vista previa"
              className="w-20 h-20 object-cover rounded-kawaii border-2 border-gray-200 dark:border-gray-700"
            />
          )}

          <Input
            label="URL de imagen"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            error={errors.image_url}
            placeholder="https://ejemplo.com/imagen.jpg"
            helperText="Pega la URL de la imagen del producto"
          />
        </div>
      </div>

      {/* Error general */}
      {Object.keys(errors).length > 0 && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-kawaii flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Hay errores en el formulario
            </p>
            <p className="text-xs text-red-500 dark:text-red-500">
              Por favor, corrige los errores marcados
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1"
          loading={loading}
          disabled={loading}
        >
          {isEditing ? 'Actualizar' : 'Crear'} Producto
        </Button>
      </div>
    </form>
  )
}

export default ProductForm
