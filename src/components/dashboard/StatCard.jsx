import { Card } from '../common'
import { LucideIcon } from 'lucide-react'

const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon: Icon,
  color = 'primary',
  loading = false,
}) => {
  const colors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    accent: 'bg-accent-500',
  }

  const changeColors = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  }

  return (
    <Card padding="md" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {value}
            </p>
          )}
          {change && (
            <p className={`text-sm ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>

        <div className={`${colors[color]} p-3 rounded-kawaii`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  )
}

export default StatCard
