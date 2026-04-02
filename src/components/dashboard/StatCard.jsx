import { Card } from '../common'

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
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-gray-500 to-gray-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    danger: 'from-danger-500 to-danger-600',
    accent: 'from-accent-500 to-accent-600',
  }

  const changeColors = {
    positive: 'text-success-600 dark:text-success-400',
    negative: 'text-danger-600 dark:text-danger-400',
    neutral: 'text-gray-500 dark:text-gray-400',
  }

  return (
    <Card padding="md" variant="hover">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-24 card-neo-inset-sm animate-pulse mb-1"></div>
          ) : (
            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1 truncate">
              {value}
            </p>
          )}
          {change && (
            <p className={`text-sm font-medium ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>

        <div
          className={`flex-shrink-0 p-3 rounded-neo bg-gradient-to-br ${colors[color]} shadow-neo-primary dark:shadow-neo-primary-dark`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  )
}

export default StatCard
