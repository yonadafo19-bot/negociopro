import { useState } from 'react'
import { useInventory } from '../hooks/useInventory'
import { Card, Button, Modal } from '../components/common'
import { ProductList, ProductForm, StockAlert } from '../components/inventory'
import { Plus, Package, AlertCircle } from 'lucide-react'

const InventoryPage = () => {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    getCategories,
    isEmpty,
    totalProducts,
    lowStockCount,
  } = useInventory()

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [lowStockProducts, setLowStockProducts] = useState([])

  const categories = getCategories()

  // Cargar productos con stock bajo
  useState(() => {
    const loadLowStock = async () => {
      const products = await getLowStockProducts()
      setLowStockProducts(products)
    }
    loadLowStock()
  })

  const handleCreate = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDelete = (product) => {
    setDeletingProduct(product)
  }

  const confirmDelete = async () => {
    if (!deletingProduct) return

    setModalLoading(true)

    const { error } = await deleteProduct(deletingProduct.id)

    setModalLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({
        type: 'success',
        text: `${deletingProduct.name} eliminado correctamente`,
      })
      // Recargar productos con stock bajo
      const products = await getLowStockProducts()
      setLowStockProducts(products)
    }

    setDeletingProduct(null)
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleSubmit = async (productData) => {
    setModalLoading(true)
    setMessage({ type: '', text: '' })

    let result

    if (editingProduct) {
      result = await updateProduct(editingProduct.id, productData)
    } else {
      result = await createProduct(productData)
    }

    setModalLoading(false)

    if (result.error) {
      setMessage({ type: 'error', text: result.error.message })
    } else {
      setMessage({
        type: 'success',
        text: editingProduct
          ? 'Producto actualizado correctamente'
          : 'Producto creado correctamente',
      })
      setShowModal(false)
      setEditingProduct(null)

      // Recargar productos con stock bajo
      const products = await getLowStockProducts()
      setLowStockProducts(products)
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Inventario
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus productos y controla tu stock
          </p>
        </div>

        <Button onClick={handleCreate} icon={Plus}>
          Nuevo Producto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500 rounded-kawaii">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total de productos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalProducts}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-kawaii">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                En stock
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {products.filter((p) => p.stock_quantity > 0).length}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500 rounded-kawaii">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stock bajo
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {lowStockCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Low stock alert */}
      <div className="mb-6">
        <StockAlert
          products={lowStockProducts}
          onViewAll={() => {
            // Filter products to show only low stock
            document
              .querySelector('[data-filter="low-stock"]')
              ?.click()
          }}
        />
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-kawaii flex items-start gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
              : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
          }`}
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Products list */}
      <ProductList
        products={products}
        loading={loading}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingProduct(null)
          setMessage({ type: '', text: '' })
        }}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false)
            setEditingProduct(null)
          }}
          loading={modalLoading}
        />

        {message.text && (
          <div className="mt-4 p-3 rounded-kawaii text-sm text-center">
            {message.text}
          </div>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        title="Eliminar Producto"
        size="sm"
      >
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ¿Estás seguro?
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Vas a eliminar el producto:
          </p>

          <p className="font-semibold text-gray-900 dark:text-white mb-6">
            {deletingProduct?.name}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Esta acción no se puede deshacer. El producto se marcará como inactivo.
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDeletingProduct(null)}
              className="flex-1"
              disabled={modalLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={modalLoading}
              className="flex-1"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default InventoryPage
