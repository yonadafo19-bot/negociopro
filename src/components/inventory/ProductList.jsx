import { useState } from 'react'
import { Card, Input, Badge } from '../common'
import { Search, SlidersHorizontal, Package, AlertTriangle } from 'lucide-react'
import ProductCard from './ProductCard'

const ProductList = ({
  products = [],
  loading = false,
  onEdit,
  onDelete,
  categories = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    // Buscar por término
    const matchesSearch =
      !searchTerm ||
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtrar por categoría
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory

    // Filtrar por stock bajo
    const matchesLowStock =
      !showLowStockOnly ||
      product.stock_quantity <= product.min_stock_alert

    return matchesSearch && matchesCategory && matchesLowStock
  })

  const lowStockCount = products.filter(
    (p) => p.stock_quantity <= p.min_stock_alert
  ).length

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, SKU o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Category filter */}
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Low stock filter */}
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`px-4 py-2 rounded-kawaii border-2 transition-colors flex items-center gap-2 ${
              showLowStockOnly
                ? 'bg-yellow-50 border-yellow-500 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Stock bajo</span>
            {lowStockCount > 0 && (
              <Badge variant="warning" size="sm">
                {lowStockCount}
              </Badge>
            )}
          </button>
        </div>

        {/* Active filters */}
        {(searchTerm || selectedCategory !== 'all' || showLowStockOnly) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Filtros activos:
            </span>

            {searchTerm && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSearchTerm('')}
              >
                "{searchTerm}" ✕
              </Badge>
            )}

            {selectedCategory !== 'all' && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedCategory('all')}
              >
                {selectedCategory} ✕
              </Badge>
            )}

            {showLowStockOnly && (
              <Badge
                variant="warning"
                className="cursor-pointer"
                onClick={() => setShowLowStockOnly(false)}
              >
                Stock bajo ✕
              </Badge>
            )}

            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setShowLowStockOnly(false)
              }}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Limpiar todos
            </button>
          </div>
        )}
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredProducts.length}
          </span>{' '}
          de{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {products.length}
          </span>{' '}
          productos
        </p>

        {lowStockCount > 0 && !showLowStockOnly && (
          <button
            onClick={() => setShowLowStockOnly(true)}
            className="text-sm text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 flex items-center gap-1"
          >
            <AlertTriangle className="h-4 w-4" />
            Ver {lowStockCount} con stock bajo
          </button>
        )}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} padding="md" className="animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-kawaii mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
              lowStock={product.stock_quantity <= product.min_stock_alert}
            />
          ))}
        </div>
      ) : (
        <Card padding="lg">
          <div className="text-center py-8">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || selectedCategory !== 'all' || showLowStockOnly
                ? 'No se encontraron productos'
                : 'No hay productos aún'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedCategory !== 'all' || showLowStockOnly
                ? 'Intenta con otros filtros'
                : 'Empieza agregando tu primer producto'}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ProductList
