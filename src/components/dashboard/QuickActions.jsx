import { Card, CardContent } from '../common'
import { Package, DollarSign, Users, BarChart3, BookOpen, Settings, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const QuickActions = () => {
  const actions = [
    {
      title: 'Nueva Venta',
      description: 'Registrar una venta rápida',
      icon: DollarSign,
      href: '/app/sales',
      color: 'bg-neo-success dark:bg-dark-success',
      borderColor: 'border-neo-success dark:border-dark-success',
    },
    {
      title: 'Agregar Producto',
      description: 'Añadir al inventario',
      icon: Package,
      href: '/app/inventory',
      color: 'bg-neo-primary dark:bg-dark-primary',
      borderColor: 'border-neo-primary dark:border-dark-primary',
    },
    {
      title: 'Nuevo Contacto',
      description: 'Crear cliente/proveedor',
      icon: Users,
      href: '/app/contacts',
      color: 'bg-neo-accent dark:bg-dark-accent',
      borderColor: 'border-neo-accent dark:border-dark-accent',
    },
    {
      title: 'Ver Reportes',
      description: 'Análisis y métricas',
      icon: BarChart3,
      href: '/app/reports',
      color: 'bg-neo-warning dark:bg-dark-warning',
      borderColor: 'border-neo-warning dark:border-dark-warning',
    },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-neo-text dark:text-dark-text mb-4">
          Acciones Rápidas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link key={action.href} to={action.href}>
              <button
                className={`w-full p-4 rounded-neo border border-neo-border dark:border-dark-border bg-neo-bg dark:bg-dark-bg-alt text-left transition-all duration-200 shadow-neo-sm hover:shadow-neo hover:bg-neo-surface dark:hover:bg-dark-surface`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`${action.color} p-2 rounded-neo shadow-neo-sm`}
                  >
                    <action.icon className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-neo-text dark:text-dark-text mb-1">
                      {action.title}
                    </h4>
                    <p className="text-sm text-neo-text-muted dark:text-dark-text-muted">
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
