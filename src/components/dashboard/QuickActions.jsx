import { Card } from '../common'
import { Package, DollarSign, Users, BarChart3, BookOpen, Settings, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const QuickActions = () => {
  const actions = [
    {
      title: 'Nueva Venta',
      description: 'Registrar venta rápida',
      icon: DollarSign,
      href: '/app/sales',
      color: 'from-success-500 to-success-600',
    },
    {
      title: 'Agregar Producto',
      description: 'Añadir al inventario',
      icon: Package,
      href: '/app/inventory',
      color: 'from-primary-500 to-primary-600',
    },
    {
      title: 'Nuevo Contacto',
      description: 'Crear cliente/proveedor',
      icon: Users,
      href: '/app/contacts',
      color: 'from-accent-500 to-accent-600',
    },
    {
      title: 'Ver Reportes',
      description: 'Análisis y métricas',
      icon: BarChart3,
      href: '/app/reports',
      color: 'from-warning-500 to-warning-600',
    },
  ]

  return (
    <Card padding="lg">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-5">
        Acciones Rápidas
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link key={action.href} to={action.href}>
            <button className="w-full group">
              <div className="card-neo-hover p-4 h-full">
                <div className="flex flex-col items-center text-center gap-3">
                  <div
                    className={`p-3 rounded-neo bg-gradient-to-br ${action.color} shadow-neo-primary dark:shadow-neo-primary-dark group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                      {action.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </Link>
        ))}
      </div>
    </Card>
  )
}

export default QuickActions
