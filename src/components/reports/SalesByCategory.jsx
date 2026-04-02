import { Card, CardHeader, CardTitle, CardContent } from '../common'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'

const COLORS = [
  '#ef4444', // primary-500
  '#0ea5e9', // secondary-500
  '#d946ef', // accent-500
  '#10b981', // green-500
  '#f59e0b', // yellow-500
  '#8b5cf6', // purple-500
  '#ec4899', // pink-500
  '#6366f1', // indigo-500
]

const SalesByCategory = ({ data = [], loading = false }) => {
  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-1">{data.category}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ventas: {formatCurrency(data.amount)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{data.count} productos</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-accent-500" />
          Ventas por Categoría
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : data.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <PieChartIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                No hay datos suficientes para mostrar el gráfico
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SalesByCategory
