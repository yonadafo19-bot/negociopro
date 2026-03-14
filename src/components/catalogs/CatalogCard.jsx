import { Card, CardContent, Button, Badge } from '../common'
import {
  Eye,
  Share2,
  Edit,
  Trash2,
  MoreVertical,
  Package,
} from 'lucide-react'
import { useState } from 'react'

const CatalogCard = ({ catalog, onEdit, onDelete, onShare, onView }) => {
  const [showMenu, setShowMenu] = useState(false)

  const productCount = catalog.catalog_products?.length || 0
  const viewCount = catalog.view_count || 0

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getThemeColor = (theme) => {
    switch (theme) {
      case 'blue':
        return 'from-blue-500 to-blue-600'
      case 'green':
        return 'from-green-500 to-green-600'
      case 'purple':
        return 'from-purple-500 to-purple-600'
      case 'orange':
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-primary-500 to-primary-600'
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className={`h-32 bg-gradient-to-br ${getThemeColor(catalog.theme)} relative p-4`}>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {catalog.is_public ? (
              <Badge variant="success" size="sm">
                Público
              </Badge>
            ) : (
              <Badge variant="secondary" size="sm">
                Privado
              </Badge>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white truncate">
              {catalog.name}
            </h3>
            {catalog.description && (
              <p className="text-white/80 text-sm truncate mt-1">
                {catalog.description}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Package className="h-4 w-4" />
                {productCount} {productCount === 1 ? 'producto' : 'productos'}
              </span>
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Eye className="h-4 w-4" />
                {viewCount} {viewCount === 1 ? 'vista' : 'vistas'}
              </span>
            </div>
          </div>

          {/* Date */}
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
            Creado el {formatDate(catalog.created_at)}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onView(catalog)}
              icon={Eye}
            >
              Ver
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onShare(catalog)}
              icon={Share2}
            />
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                icon={MoreVertical}
              />
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    onClick={() => {
                      onEdit(catalog)
                      setShowMenu(false)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    onClick={() => {
                      onDelete(catalog)
                      setShowMenu(false)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CatalogCard
