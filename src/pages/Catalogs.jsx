import { useState } from 'react'
import { useCatalogs } from '../hooks/useCatalogs'
import { CatalogList, CatalogForm, ShareDialog, CatalogPreview } from '../components/catalogs'
import { Card, CardContent, PageLoader } from '../components/common'
import { BookOpen, Eye, Share2 } from 'lucide-react'

const CatalogsPage = () => {
  const {
    catalogs,
    loading,
    createCatalog,
    updateCatalog,
    updateCatalogProducts,
    deleteCatalog,
    getShareUrl,
    stats,
  } = useCatalogs()

  const [showForm, setShowForm] = useState(false)
  const [editingCatalog, setEditingCatalog] = useState(null)
  const [sharingCatalog, setSharingCatalog] = useState(null)
  const [viewingCatalog, setViewingCatalog] = useState(null)

  // Mostrar PageLoader mientras carga inicialmente
  if (loading && catalogs.length === 0) {
    return <PageLoader text="Cargando catálogos..." />
  }

  const handleCreate = async catalogData => {
    await createCatalog(catalogData)
    setShowForm(false)
  }

  const handleEdit = async catalogData => {
    await updateCatalog(editingCatalog.id, catalogData)
    await updateCatalogProducts(editingCatalog.id, catalogData.product_ids)
    setEditingCatalog(null)
  }

  const handleDelete = async catalog => {
    if (window.confirm(`¿Eliminar el catálogo "${catalog.name}"?`)) {
      await deleteCatalog(catalog.id)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Catálogos Virtuales
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Crea catálogos compartibles para mostrar tus productos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Catálogos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center">
              <Share2 className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Públicos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.public}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
              <Eye className="h-6 w-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Vistas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Catalog list */}
      <CatalogList
        catalogs={catalogs}
        loading={loading}
        onCreate={() => setShowForm(true)}
        onEdit={catalog => setEditingCatalog(catalog)}
        onDelete={handleDelete}
        onShare={catalog => setSharingCatalog(catalog)}
        onView={catalog => setViewingCatalog(catalog)}
      />

      {/* Form modal */}
      {(showForm || editingCatalog) && (
        <CatalogForm
          catalog={editingCatalog}
          onSubmit={editingCatalog ? handleEdit : handleCreate}
          onCancel={() => {
            setShowForm(false)
            setEditingCatalog(null)
          }}
        />
      )}

      {/* Share dialog */}
      {sharingCatalog && (
        <ShareDialog
          catalog={sharingCatalog}
          shareUrl={getShareUrl(sharingCatalog.share_link)}
          onClose={() => setSharingCatalog(null)}
        />
      )}

      {/* Preview modal */}
      {viewingCatalog && (
        <CatalogPreview catalog={viewingCatalog} onClose={() => setViewingCatalog(null)} />
      )}
    </div>
  )
}

export default CatalogsPage
