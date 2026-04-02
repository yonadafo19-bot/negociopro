import { useState, useMemo } from 'react'
import { Input, Card, Badge } from '../common'
import { Search, Package, Plus } from 'lucide-react'

const ProductSelector = ({ products = [], onAddToCart, cartItems = [] }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Productos que ya están en el carrito
  const cartProductIds = cartItems.map(item => item.product_id)

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean))
    return ['all', ...Array.from(cats)]
  }, [products])

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Filtrar por activo y stock
      if (!p.is_active || p.stock_quantity <= 0) return false

      // Filtrar por categoría
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false

      // Filtrar por búsqueda
      const searchLower = searchTerm.toLowerCase()
      return (
        p.name?.toLowerCase().includes(searchLower) ||
        p.sku?.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower)
      )
    })
  }, [products, searchTerm, selectedCategory])

  // Contar productos por categoría
  const getCategoryCount = (cat) => {
    if (cat === 'all') {
      return products.filter(p => p.is_active && p.stock_quantity > 0).length
    }
    return products.filter(p => p.is_active && p.stock_quantity > 0 && p.category === cat).length
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  const handleAddToCart = (e, product) => {
    e.stopPropagation() // Evitar que se propague el click
    const cartItem = cartItems.find(item => item.product_id === product.id)
    const quantityInCart = cartItem ? cartItem.quantity : 0
    const availableQuantity = product.stock_quantity - quantityInCart

    if (availableQuantity <= 0) return

    onAddToCart({
      product_id: product.id,
      name: product.name,
      sku: product.sku,
      image_url: product.image_url,
      unit_price: product.selling_price,
      quantity: 1,
      max_stock: product.stock_quantity,
    })
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
        <Input
          placeholder="Buscar por nombre, SKU o categoría..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white shadow-neo-primary dark:shadow-neo-primary-dark scale-105 border-2 border-primary-400 dark:border-primary-500'
                : 'card-neo bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            {category === 'all' ? '📦 Todos' : category}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              selectedCategory === category
                ? 'bg-white/25 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
            }`}>
              {getCategoryCount(category)}
            </span>
          </button>
        ))}
      </div>

      {/* Products grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredProducts.map(product => {
            const cartItem = cartItems.find(item => item.product_id === product.id)
            const quantityInCart = cartItem ? cartItem.quantity : 0
            const availableQuantity = product.stock_quantity - quantityInCart
            const isOutOfStock = availableQuantity <= 0

            return (
              <button
                key={product.id}
                type="button"
                onClick={(e) => !isOutOfStock && handleAddToCart(e, product)}
                disabled={isOutOfStock}
                className={`
                  group relative p-3 rounded-xl border-2 text-left transition-all duration-200
                  ${isOutOfStock
                    ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg'
                  }
                `}
              >
                {/* Product image */}
                <div className="aspect-square mb-2 overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight">
                    {product.name}
                  </h4>

                  {product.sku && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                      {product.sku}
                    </p>
                  )}

                  {/* Stock badge */}
                  <div className="pt-1">
                    <Badge
                      variant={availableQuantity <= 5 ? 'danger' : 'success'}
                      size="sm"
                      className="text-[10px] px-1.5 py-0.5"
                    >
                      Stock: {availableQuantity}
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="pt-1">
                    <p className="font-bold text-primary-600 dark:text-primary-400 text-base">
                      {formatCurrency(product.selling_price)}
                    </p>
                  </div>

                  {/* Category tag */}
                  {product.category && (
                    <div className="pt-1">
                      <span className="inline-block text-[9px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md">
                        {product.category}
                      </span>
                    </div>
                  )}

                  {/* In cart indicator */}
                  {quantityInCart > 0 && (
                    <div className="absolute top-2 right-2 bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                      +{quantityInCart}
                    </div>
                  )}

                  {/* Add button */}
                  {!isOutOfStock && (
                    <div className="absolute bottom-2 right-2 bg-success-500 hover:bg-success-600 text-white p-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package className="h-8 w-8 text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {searchTerm || selectedCategory !== 'all'
              ? 'No se encontraron productos'
              : 'No hay productos disponibles'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductSelector
