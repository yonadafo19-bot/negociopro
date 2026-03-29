import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

const Badge = ({ children, variant = 'default', size = 'md', className = '', icon: Icon }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-1 font-medium rounded-full'

  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    accent: 'bg-accent-100 text-accent-800',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
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
