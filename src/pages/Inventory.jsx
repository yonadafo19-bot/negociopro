import { useState, useEffect } from 'react'
import { useInventory } from '../hooks/useInventory'
import { Card, Button, Modal, PageLoader, useToast } from '../components/common'
import { ProductList, ProductForm, StockAlert } from '../components/inventory'
import { Plus, Package, AlertCircle } from 'lucide-react'

const InventoryPage = () => {
  const toast = useToast()

  // PRIMERO: Todos los hooks deben declararse antes de cualquier return
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
  const [lowStockProducts, setLowStockProducts] = useState([])

  const categories = getCategories()

  // Cargar productos con stock bajo
  useEffect(() => {
    const loadLowStock = async () => {
      const products = await getLowStockProducts()
      setLowStockProducts(products)
    }
    loadLowStock()
  }, [])

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
      toast.error(`Error al eliminar: ${error.message}`)
    } else {
      toast.success(`${deletingProduct.name} eliminado correctamente`)
      // Recargar productos con stock bajo
      const products = await getLowStockProducts()
      setLowStockProducts(products)
    }

    setDeletingProduct(null)
  }

  const handleSubmit = async (productData) => {
    setModalLoading(true)

    let result

    if (editingProduct) {
      result = await updateProduct(editingProduct.id, productData)
    } else {
      result = await createProduct(productData)
    }

    setModalLoading(false)

    if (result.error) {
      toast.error(`Error: ${result.error.message}`)
    } else {
      toast.success(
        editingProduct
          ? 'Producto actualizado correctamente'
          : 'Producto creado correctamente'
      )
      setShowModal(false)
      setEditingProduct(null)

      // Recargar productos con stock bajo
      const products = await getLowStockProducts()
      setLowStockProducts(products)
    }
  }

  // AHORA los renders condicionales
  // Mostrar PageLoader mientras carga inicialmente
  if (loading && products.length === 0) {
    return <PageLoader text="Cargando inventario..." />
  }

  // Mostrar error si hay un error de carga
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-danger-500 dark:text-danger-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Error al cargar el inventario
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error.message || 'Por favor, intenta recargar la página'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-neo-primary px-6 py-2 rounded-neo"
          >
            Recargar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
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
            <div className="p-3 bg-primary-500 dark:bg-primary-600 rounded-neo shadow-neo">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total de productos
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {totalProducts}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success-500 dark:bg-success-600 rounded-neo shadow-neo">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">En stock</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {products.filter((p) => p.stock_quantity > 0).length}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning-500 dark:bg-warning-600 rounded-neo shadow-neo">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Stock bajo</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{lowStockCount}</p>
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
            document.querySelector('[data-filter="low-stock"]')?.click()
          }}
        />
      </div>

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
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        title="Eliminar Producto"
        size="sm"
      >
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-danger-500 dark:text-danger-400 mx-auto mb-4" />

          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            ¿Estás seguro?
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Vas a eliminar el producto:
          </p>

          <p className="font-semibold text-gray-800 dark:text-gray-100 mb-6">
            {deletingProduct?.name}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Esta acción no se puede deshacer. El producto se marcará como inactivo.
          </p>

          <div className="flex flex-wrap gap-3">
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
