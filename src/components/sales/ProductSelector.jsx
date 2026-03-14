import { useState } from 'react'
import { Input, Card, Badge } from '../common'
import { Search, Package, Plus } from 'lucide-react'

const ProductSelector = ({ products = [], onAddToCart, cartItems = [] }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Productos que ya están en el carrito
  const cartProductIds = cartItems.map((item) => item.product_id)

  // Filtrar productos
  const filteredProducts = products.filter(
    (p) =>
      p.is_active &&
      p.stock_quantity > 0 &&
      (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const handleAddToCart = (product) => {
    // Verificar cuántos de este producto ya están en el carrito
    const cartItem = cartItems.find((item) => item.product_id === product.id)
    const quantityInCart = cartItem ? cartItem.quantity : 0
    const availableQuantity = product.stock_quantity - quantityInCart

    if (availableQuantity <= 0) {
      return // No hay stock disponible
    }

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
      <Input
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={Search}
      />

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const cartItem = cartItems.find(
              (item) => item.product_id === product.id
            )
            const quantityInCart = cartItem ? cartItem.quantity : 0
            const availableQuantity = product.stock_quantity - quantityInCart

            return (
              <Card
                key={product.id}
                padding="md"
                className={`transition-all ${
                  availableQuantity <= 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-md cursor-pointer'
                }`}
                onClick={() =>
                  availableQuantity > 0 && handleAddToCart(product)
                }
              >
                <div className="flex items-start gap-3">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-kawaii"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-kawaii flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {product.name}
                    </h4>

                    {product.sku && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {product.sku}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(product.selling_price)}
                      </p>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            availableQuantity <= product.min_stock_alert
                              ? 'warning'
                              : availableQuantity <= 5
                              ? 'danger'
                              : 'success'
                          }
                          size="sm"
                        >
                          Stock: {availableQuantity}
                        </Badge>

                        {quantityInCart > 0 && (
                          <Badge variant="secondary" size="sm">
                            {quantityInCart} en carrito
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {availableQuantity > 0 && (
                    <Plus className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  )}
                </div>
              </Card>
            )
          })
        ) : (
          <div className="col-span-2 text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm
                ? 'No se encontraron productos'
                : 'No hay productos disponibles'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductSelector
