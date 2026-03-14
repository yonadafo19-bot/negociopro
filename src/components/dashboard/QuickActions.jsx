import { Card, CardContent, Button } from '../common'
import {
  Package,
  DollarSign,
  Users,
  BarChart3,
  BookOpen,
  Settings,
  Plus,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const QuickActions = () => {
  const actions = [
    {
      title: 'Nueva Venta',
      description: 'Registrar una venta rápida',
      icon: DollarSign,
      href: '/sales',
      color: 'bg-green-500',
      variant: 'success',
    },
    {
      title: 'Agregar Producto',
      description: 'Añadir al inventario',
      icon: Package,
      href: '/inventory',
      color: 'bg-primary-500',
      variant: 'primary',
    },
    {
      title: 'Nuevo Contacto',
      description: 'Crear cliente/proveedor',
      icon: Users,
      href: '/contacts',
      color: 'bg-secondary-500',
      variant: 'secondary',
    },
    {
      title: 'Ver Reportes',
      description: 'Análisis y métricas',
      icon: BarChart3,
      href: '/reports',
      color: 'bg-accent-500',
      variant: 'accent',
    },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link key={action.href} to={action.href}>
              <button
                className={`w-full p-4 rounded-kawaii border-2 text-left transition-all hover:shadow-md ${
                  action.variant === 'primary'
                    ? 'border-primary-300 hover:border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : action.variant === 'success'
                    ? 'border-green-300 hover:border-green-500 bg-green-50 dark:bg-green-900/20'
                    : action.variant === 'secondary'
                    ? 'border-secondary-300 hover:border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20'
                    : 'border-accent-300 hover:border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`${action.color} p-2 rounded-kawaii`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickActions
