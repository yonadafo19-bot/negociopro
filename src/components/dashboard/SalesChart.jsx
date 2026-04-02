import { Card, CardHeader, CardTitle, CardContent } from '../common'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'

const SalesChart = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <div className="p-2 rounded-neo bg-gradient-to-br from-primary-500/10 to-primary-600/10">
              <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            Ventas por Periodo
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 dark:border-primary-400"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = value => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <div className="p-2 rounded-neo bg-gradient-to-br from-primary-500/10 to-primary-600/10">
            <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          Ventas por Periodo
        </CardTitle>
      </CardHeader>

      <CardContent>
        {data.length > 0 ? (
          <div className="card-neo-inset p-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-300 dark:stroke-gray-600"
                />
                <XAxis
                  dataKey="name"
                  className="text-sm fill-gray-600 dark:fill-gray-400"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis
                  className="text-sm fill-gray-600 dark:fill-gray-400"
                  tick={{ fill: 'currentColor' }}
                  tickFormatter={value => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    color: '#1f2937',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: '#4f46e5' }}
                  formatter={value => formatCurrency(value)}
                  labelStyle={{ color: '#6b7280' }}
                />
                <Bar
                  dataKey="amount"
                  fill="url(#gradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="icon-btn-neo-lg mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
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

export default SalesChart
