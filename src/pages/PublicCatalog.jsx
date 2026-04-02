import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCatalogs } from '../hooks/useCatalogs'
import { Loader, AlertCircle, Mail, MessageCircle, Phone, MapPin } from 'lucide-react'

const PublicCatalogPage = () => {
  const { shareLink } = useParams()
  const navigate = useNavigate()
  const { getPublicCatalog } = useCatalogs()
  const [catalog, setCatalog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCatalog()
  }, [shareLink])

  const loadCatalog = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPublicCatalog(shareLink)
      setCatalog(data)
    } catch (err) {
      console.error('Error loading catalog:', err)
      setError(err.message)
    } finally {
      setLoading(false)
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
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader className="h-12 w-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando catálogo...</p>
        </div>
      </div>
    )
  }

  if (error || !catalog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-neo shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Catálogo no encontrado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            El catálogo que buscas no existe o ha sido eliminado.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-neo transition-colors"
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    )
  }

  const products = catalog.catalog_products?.map(cp => cp.products).filter(Boolean) || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className={`bg-gradient-to-br ${getThemeGradient(catalog.theme)} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3">{catalog.name}</h1>
            {catalog.description && (
              <p className="text-xl text-white/90 max-w-2xl mx-auto">{catalog.description}</p>
            )}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                📦 {products.length} productos
              </span>
              <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                👁️ {catalog.view_count || 0} vistas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Business info */}
      {catalog.profiles && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {catalog.profiles.business_name || 'Negocio'}
                </h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {catalog.profiles.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {catalog.profiles.phone}
                    </span>
                  )}
                  {catalog.profiles.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {catalog.profiles.address}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {catalog.profiles.phone && (
                  <a
                    href={`https://wa.me/${catalog.profiles.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-neo transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
                <a
                  href={`mailto:${catalog.profiles.email || ''}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-neo transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Este catálogo no tiene productos aún
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => {
              const isOutOfStock = product.stock_quantity <= 0
              const isLowStock = product.stock_quantity <= product.min_stock_alert && !isOutOfStock

              return (
                <div
                  key={product.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all ${
                    isOutOfStock ? 'opacity-60' : ''
                  }`}
                >
                  {/* Product image */}
                  <div className="relative h-56 bg-gray-100 dark:bg-gray-700">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl">📦</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                      {isOutOfStock && (
                        <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full shadow">
                          Agotado
                        </span>
                      )}
                      {isLowStock && (
                        <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-full shadow">
                          ¡Últimos!
                        </span>
                      )}
                      <span className="px-3 py-1 bg-gray-900/50 text-white text-xs rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h3>

                    {product.sku && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                        SKU: {product.sku}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {formatCurrency(product.selling_price)}
                        </p>
                        {product.cost_price && product.cost_price < product.selling_price && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 line-through">
                            {formatCurrency(product.cost_price)}
                          </p>
                        )}
                      </div>
                      {product.stock_quantity > 0 && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Stock: {product.stock_quantity}
                        </span>
                      )}
                    </div>

                    {!isOutOfStock ? (
                      <button
                        onClick={() => contactViaWhatsApp(product)}
                        className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-neo transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Pedir por WhatsApp
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 font-semibold rounded-neo cursor-not-allowed"
                      >
                        Producto agotado
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Compartido con ❤️ desde NegociPro</p>
            <p className="mt-1">
              Powered by{' '}
              <a
                href="https://negociopro.com"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                NegociPro
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicCatalogPage
