import { useState } from 'react'
import { CatalogCard } from '.'
import { Button } from '../common'
import { Plus, Search, Filter } from 'lucide-react'
import { Input } from '../common'

const CatalogList = ({ catalogs, loading, onEdit, onDelete, onShare, onView, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, public, private

  const filteredCatalogs = catalogs.filter(catalog => {
    const matchesSearch =
      catalog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (catalog.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'public' && catalog.is_public) ||
      (filterStatus === 'private' && !catalog.is_public)

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Catálogos</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tus catálogos compartibles
          </p>
        </div>
        <Button onClick={onCreate} icon={Plus}>
          Nuevo Catálogo
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-neo p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar catálogos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-neo text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Todos</option>
              <option value="public">Públicos</option>
              <option value="private">Privados</option>
            </select>
          </div>
        </div>

        {/* Active filters */}
        {(searchTerm || filterStatus !== 'all') && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                Buscar: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="hover:text-primary-900 dark:hover:text-primary-100"
                >
                  ×
                </button>
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-sm">
                {filterStatus === 'public' ? 'Públicos' : 'Privados'}
                <button
                  onClick={() => setFilterStatus('all')}
                  className="hover:text-secondary-900 dark:hover:text-secondary-100"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterStatus('all')
              }}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {catalogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No tienes catálogos aún
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Crea tu primer catálogo para empezar a compartir tus productos
          </p>
          <Button onClick={onCreate} icon={Plus}>
            Crear Primer Catálogo
          </Button>
        </div>
      ) : filteredCatalogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No se encontraron catálogos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Intenta con otros términos de búsqueda o filtros
          </p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalogs.map(catalog => (
            <CatalogCard
              key={catalog.id}
              catalog={catalog}
              onEdit={onEdit}
              onDelete={onDelete}
              onShare={onShare}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CatalogList
