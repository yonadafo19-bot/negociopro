import { useState } from 'react'
import { Input } from '../common'
import { Search, Check, Package } from 'lucide-react'
import { Badge } from '../common'

const ProductSelector = ({ products, selectedIds, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleProduct = productId => {
    if (selectedIds.includes(productId)) {
      onChange(selectedIds.filter(id => id !== productId))
    } else {
      onChange([...selectedIds, productId])
    }
  }

  const toggleAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      onChange([])
    } else {
      onChange(filteredProducts.map(p => p.id))
    }
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-kawaii overflow-hidden">
      {/* Search and select all */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={toggleAll}
            className="px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-kawaii transition-colors"
          >
            {selectedIds.length === filteredProducts.length ? 'Deseleccionar' : 'Seleccionar'} Todo
          </button>
        </div>
      </div>

      {/* Product list */}
      <div className="max-h-64 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.map(product => {
              const isSelected = selectedIds.includes(product.id)
              const isOutOfStock = product.stock_quantity <= 0

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => !isOutOfStock && toggleProduct(product.id)}
                  disabled={isOutOfStock}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>

                  {/* Product image */}
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-kawaii"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-kawaii flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                  )}

                  {/* Product info */}
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {product.category}
                      </span>
                      {product.stock_quantity <= product.min_stock_alert && (
                        <Badge variant="warning" size="sm">
                          Stock bajo
                        </Badge>
                      )}
                      {isOutOfStock && (
                        <Badge variant="danger" size="sm">
                          Agotado
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${product.sale_price?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Stock: {product.stock_quantity}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Selected count */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-white">{selectedIds.length}</span> de{' '}
          {products.length} productos seleccionados
        </p>
      </div>
    </div>
  )
}

export default ProductSelector
