import { useState } from 'react'
import { Modal, Button } from '../common'
import { X, Mail, MessageCircle, Phone } from 'lucide-react'

const CatalogPreview = ({ catalog, onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState(null)

  const products = catalog.catalog_products?.map(cp => cp.products).filter(Boolean) || []

  const getThemeGradient = theme => {
    switch (theme) {
      case 'blue':
        return 'from-blue-500 to-blue-600'
      case 'green':
        return 'from-green-500 to-green-600'
      case 'purple':
        return 'from-purple-500 to-purple-600'
      case 'orange':
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-primary-500 to-primary-600'
    }
  }

  const contactViaWhatsApp = product => {
    const businessName = catalog.profiles?.business_name || 'Negocio'
    const message = `Hola ${businessName}, me interesa el producto "${product.name}" que vi en tu catálogo.`
    const phone = catalog.profiles?.phone || ''
    const url = phone
      ? `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="" size="xl" showClose={false}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-br ${getThemeGradient(catalog.theme)} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-2">{catalog.name}</h2>
            {catalog.description && <p className="text-white/90">{catalog.description}</p>}
            <div className="flex items-center justify-center gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1">📦 {products.length} productos</span>
              <span className="flex items-center gap-1">👁️ {catalog.view_count || 0} vistas</span>
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 dark:text-gray-400">
                Este catálogo no tiene productos aún
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => {
                const isOutOfStock = product.stock_quantity <= 0
                const isLowStock =
                  product.stock_quantity <= product.min_stock_alert && !isOutOfStock

                return (
                  <div
                    key={product.id}
                    className={`bg-white dark:bg-gray-800 border-2 rounded-kawaii overflow-hidden transition-all hover:shadow-lg ${
                      isOutOfStock
                        ? 'border-gray-200 dark:border-gray-700 opacity-60'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                  >
                    {/* Product image */}
                    <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">📦</span>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                        {isOutOfStock && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                            Agotado
                          </span>
                        )}
                        {isLowStock && (
                          <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                            ¡Últimos!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {product.category}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {formatCurrency(product.sale_price)}
                          </p>
                          {product.cost_price && product.cost_price < product.sale_price && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 line-through">
                              {formatCurrency(product.cost_price)}
                            </p>
                          )}
                        </div>

                        {!isOutOfStock && (
                          <button
                            onClick={() => contactViaWhatsApp(product)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                            title="Contactar por WhatsApp"
                          >
                            <MessageCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>

                      {isOutOfStock && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2 text-center">
                          Producto agotado
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {catalog.profiles?.business_name || 'Negocio'}
              </p>
              {catalog.profiles?.phone && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{catalog.profiles.phone}</p>
              )}
            </div>
            <Button onClick={onClose}>Cerrar Vista Previa</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CatalogPreview
