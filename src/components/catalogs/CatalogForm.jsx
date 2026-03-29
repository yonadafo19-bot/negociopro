import { useState, useEffect } from 'react'
import { Modal, Input, Button, Toggle } from '../common'
import ProductSelector from './ProductSelector'
import { useInventory } from '../../hooks/useInventory'

const CatalogForm = ({ catalog, onSubmit, onCancel }) => {
  const { products } = useInventory()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    theme: 'default',
    is_public: true,
    product_ids: [],
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (catalog) {
      setFormData({
        name: catalog.name || '',
        description: catalog.description || '',
        theme: catalog.theme || 'default',
        is_public: catalog.is_public !== undefined ? catalog.is_public : true,
        product_ids: catalog.catalog_products?.map(cp => cp.product_id) || [],
      })
    }
  }, [catalog])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (formData.product_ids.length === 0) {
      newErrors.products = 'Selecciona al menos un producto'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting catalog:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const themes = [
    { value: 'default', label: 'Por defecto', color: 'from-primary-500 to-primary-600' },
    { value: 'blue', label: 'Azul', color: 'from-blue-500 to-blue-600' },
    { value: 'green', label: 'Verde', color: 'from-green-500 to-green-600' },
    { value: 'purple', label: 'Morado', color: 'from-purple-500 to-purple-600' },
    { value: 'orange', label: 'Naranja', color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={catalog ? 'Editar Catálogo' : 'Nuevo Catálogo'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre del Catálogo *
            </label>
            <Input
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Ej: Catálogo de Verano 2024"
              error={errors.name}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Describe tu catálogo..."
              rows={3}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-kawaii text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Theme selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tema del Catálogo
            </label>
            <div className="grid grid-cols-5 gap-3">
              {themes.map(theme => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => handleChange('theme', theme.value)}
                  className={`relative h-20 bg-gradient-to-br ${theme.color} rounded-kawaii border-2 transition-all ${
                    formData.theme === theme.value
                      ? 'border-white dark:border-gray-900 ring-2 ring-primary-500'
                      : 'border-transparent hover:border-white/50'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white drop-shadow-md">
                      {theme.label}
                    </span>
                  </div>
                  {formData.theme === theme.value && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Public toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-kawaii">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Catálogo Público</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Permitir que cualquiera con el enlace pueda verlo
              </p>
            </div>
            <Toggle
              checked={formData.is_public}
              onChange={checked => handleChange('is_public', checked)}
            />
          </div>

          {/* Product selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Productos * ({formData.product_ids.length} seleccionados)
            </label>
            <ProductSelector
              products={products}
              selectedIds={formData.product_ids}
              onChange={ids => handleChange('product_ids', ids)}
            />
            {errors.products && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.products}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {catalog ? 'Guardar Cambios' : 'Crear Catálogo'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CatalogForm
