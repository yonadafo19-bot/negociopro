import { useState, useEffect } from 'react'
import { useInventory } from '../hooks/useInventory'
import { Card, Button, Modal, PageLoader } from '../components/common'
import { ProductList, ProductForm, StockAlert } from '../components/inventory'
import { Plus, Package, AlertCircle } from 'lucide-react'

const InventoryPage = () => {
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
  const [message, setMessage] = useState({ type: '', text: '' })
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
          <AlertCircle className="h-16 w-16 text-neo-danger dark:text-dark-danger mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neo-text dark:text-dark-text mb-2">
            Error al cargar el inventario
          </h2>
          <p className="text-neo-text-muted dark:text-dark-text-muted mb-4">
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neo-text dark:text-dark-text mb-2">
            Inventario
          </h1>
          <p className="text-neo-text-muted dark:text-dark-text-muted">
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
            <div className="p-3 bg-neo-primary dark:bg-dark-primary rounded-neo shadow-neo">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-neo-text-muted dark:text-dark-text-muted">
                Total de productos
              </p>
              <p className="text-2xl font-bold text-neo-text dark:text-dark-text">
                {totalProducts}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neo-success dark:bg-dark-success rounded-neo shadow-neo">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-neo-text-muted dark:text-dark-text-muted">En stock</p>
              <p className="text-2xl font-bold text-neo-text dark:text-dark-text">
                {products.filter((p) => p.stock_quantity > 0).length}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neo-warning dark:bg-dark-warning rounded-neo shadow-neo">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-neo-text-muted dark:text-dark-text-muted">Stock bajo</p>
              <p className="text-2xl font-bold text-neo-text dark:text-dark-text">{lowStockCount}</p>
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

      {/* Message */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-neo flex items-start gap-2 border shadow-neo-sm ${
            message.type === 'success'
              ? 'bg-neo-success/10 dark:bg-dark-success/10 text-neo-success dark:text-dark-success border-neo-success/30 dark:border-dark-success/30'
              : 'bg-neo-danger/10 dark:bg-dark-danger/10 text-neo-danger dark:text-dark-danger border-neo-danger/30 dark:border-dark-danger/30'
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
          <div className="mt-4 p-3 rounded-neo text-sm text-center border border-neo-border dark:border-dark-border shadow-inner-shadow">
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
          <AlertCircle className="h-16 w-16 text-neo-danger dark:text-dark-danger mx-auto mb-4" />

          <h3 className="text-lg font-semibold text-neo-text dark:text-dark-text mb-2">
            ¿Estás seguro?
          </h3>

          <p className="text-neo-text-muted dark:text-dark-text-muted mb-2">
            Vas a eliminar el producto:
          </p>

          <p className="font-semibold text-neo-text dark:text-dark-text mb-6">
            {deletingProduct?.name}
          </p>

          <p className="text-sm text-neo-text-light dark:text-dark-text-light mb-6">
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
