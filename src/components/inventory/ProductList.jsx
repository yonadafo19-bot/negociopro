import { useState } from 'react'
import { Card, Input, Badge, Button } from '../common'
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
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory

    // Filtrar por stock bajo
    const matchesLowStock =
      !showLowStockOnly || product.stock_quantity <= product.min_stock_alert

    return matchesSearch && matchesCategory && matchesLowStock
  })

  const lowStockCount = products.filter((p) => p.stock_quantity <= p.min_stock_alert).length

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
              className="w-full px-4 py-2 bg-light-base dark:bg-dark-bg-alt border border-gray-300 dark:border-gray-700 rounded-neo focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-primary dark:focus:ring-offset-gray-900 text-gray-800 dark:text-gray-100 shadow-neo-light-inset dark:shadow-neo-dark-inset transition-all duration-200"
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
          <Button
            variant={showLowStockOnly ? 'warning' : 'secondary'}
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Stock bajo</span>
            {lowStockCount > 0 && (
              <Badge variant="warning" size="sm" className="bg-white text-neo-warning border border-neo-warning/30">
                {lowStockCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Active filters */}
        {(searchTerm || selectedCategory !== 'all' || showLowStockOnly) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-300 dark:border-gray-700 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Filtros activos:
            </span>

            {searchTerm && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setSearchTerm('')}
              >
                "{searchTerm}" ✕
              </Badge>
            )}

            {selectedCategory !== 'all' && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setSelectedCategory('all')}
              >
                {selectedCategory} ✕
              </Badge>
            )}

            {showLowStockOnly && (
              <Badge
                variant="warning"
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
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
              className="text-sm text-primary-500 dark:text-primary-400 hover:text-neo-primary-light dark:hover:text-dark-primary-light ml-2"
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
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {filteredProducts.length}
          </span>{' '}
          de{' '}
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {products.length}
          </span>{' '}
          productos
        </p>

        {lowStockCount > 0 && !showLowStockOnly && (
          <button
            onClick={() => setShowLowStockOnly(true)}
            className="text-sm text-warning-500 dark:text-warning-400 hover:text-neo-warning-light dark:hover:text-dark-warning-light flex items-center gap-1"
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
              <div className="h-32 bg-light-base dark:bg-dark-bg-alt rounded-neo mb-3 shadow-neo-light-inset dark:shadow-neo-dark-inset"></div>
              <div className="h-4 bg-light-base dark:bg-dark-bg-alt rounded mb-2 shadow-neo-light-inset dark:shadow-neo-dark-inset"></div>
              <div className="h-4 bg-light-base dark:bg-dark-bg-alt rounded w-2/3 shadow-neo-light-inset dark:shadow-neo-dark-inset"></div>
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
            <Package className="h-16 w-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
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
