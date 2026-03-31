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
    primary: 'bg-neo-primary dark:bg-dark-primary',
    secondary: 'bg-neo-secondary-500 dark:bg-dark-secondary-500',
    success: 'bg-neo-success dark:bg-dark-success',
    warning: 'bg-neo-warning dark:bg-dark-warning',
    danger: 'bg-neo-danger dark:bg-dark-danger',
    accent: 'bg-neo-accent dark:bg-dark-accent',
  }

  const changeColors = {
    positive: 'text-neo-success dark:text-dark-success',
    negative: 'text-neo-danger dark:text-dark-danger',
    neutral: 'text-neo-text-muted dark:text-dark-text-muted',
  }

  return (
    <Card padding="md" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neo-text-muted dark:text-dark-text-muted mb-1">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-24 bg-neo-bg dark:bg-dark-bg-alt rounded-neo animate-pulse mb-1 shadow-inner-shadow"></div>
          ) : (
            <p className="text-3xl font-bold text-neo-text dark:text-dark-text mb-1">
              {value}
            </p>
          )}
          {change && <p className={`text-sm ${changeColors[changeType]}`}>{change}</p>}
        </div>

        <div
          className={`${colors[color]} p-3 rounded-neo shadow-neo hover:shadow-neo-lg transition-all duration-200`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  )
}

export default StatCard
