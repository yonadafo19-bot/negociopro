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
              className="w-full px-4 py-2 bg-neo-bg dark:bg-dark-bg-alt border border-neo-border dark:border-dark-border rounded-neo focus:outline-none focus:ring-2 focus:ring-neo-primary dark:focus:ring-dark-primary dark:focus:ring-offset-dark-bg text-neo-text dark:text-dark-text shadow-inner-shadow transition-all duration-200"
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
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neo-border dark:border-dark-border flex-wrap">
            <span className="text-sm text-neo-text-muted dark:text-dark-text-muted">
              Filtros activos:
            </span>

            {searchTerm && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-neo-surface dark:hover:bg-dark-surface"
                onClick={() => setSearchTerm('')}
              >
                "{searchTerm}" ✕
              </Badge>
            )}

            {selectedCategory !== 'all' && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-neo-surface dark:hover:bg-dark-surface"
                onClick={() => setSelectedCategory('all')}
              >
                {selectedCategory} ✕
              </Badge>
            )}

            {showLowStockOnly && (
              <Badge
                variant="warning"
                className="cursor-pointer hover:bg-neo-surface dark:hover:bg-dark-surface"
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
              className="text-sm text-neo-primary dark:text-dark-primary hover:text-neo-primary-light dark:hover:text-dark-primary-light ml-2"
            >
              Limpiar todos
            </button>
          </div>
        )}
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neo-text-muted dark:text-dark-text-muted">
          Mostrando{' '}
          <span className="font-semibold text-neo-text dark:text-dark-text">
            {filteredProducts.length}
          </span>{' '}
          de{' '}
          <span className="font-semibold text-neo-text dark:text-dark-text">
            {products.length}
          </span>{' '}
          productos
        </p>

        {lowStockCount > 0 && !showLowStockOnly && (
          <button
            onClick={() => setShowLowStockOnly(true)}
            className="text-sm text-neo-warning dark:text-dark-warning hover:text-neo-warning-light dark:hover:text-dark-warning-light flex items-center gap-1"
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
              <div className="h-32 bg-neo-bg dark:bg-dark-bg-alt rounded-neo mb-3 shadow-inner-shadow"></div>
              <div className="h-4 bg-neo-bg dark:bg-dark-bg-alt rounded mb-2 shadow-inner-shadow"></div>
              <div className="h-4 bg-neo-bg dark:bg-dark-bg-alt rounded w-2/3 shadow-inner-shadow"></div>
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
            <Package className="h-16 w-16 text-neo-text-muted dark:text-dark-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neo-text dark:text-dark-text mb-2">
              {searchTerm || selectedCategory !== 'all' || showLowStockOnly
                ? 'No se encontraron productos'
                : 'No hay productos aún'}
            </h3>
            <p className="text-neo-text-muted dark:text-dark-text-muted">
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
