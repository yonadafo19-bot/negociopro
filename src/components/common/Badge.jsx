import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-300'

  const variants = {
    default: 'badge-neo',
    primary: 'badge-neo-primary',
    success: 'badge-neo-success',
    warning: 'badge-neo-warning',
    danger: 'badge-neo-danger',
    accent: 'badge-neo',
    outline: 'badge-neo border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs rounded-neo-sm',
    md: 'px-3 py-1 text-sm rounded-neo',
    lg: 'px-4 py-1.5 text-base rounded-neo-lg',
  }

  const classes = twMerge(clsx(baseStyles, variants[variant], sizes[size], className))

  return (
    <span className={classes}>
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  )
}

export default Badge
