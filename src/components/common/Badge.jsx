import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-1 font-medium rounded-neo shadow-sm'

  const variants = {
    default: 'bg-neo-bg dark:bg-dark-bg-alt text-neo-text dark:text-dark-text border border-neo-border dark:border-dark-border',
    primary:
      'bg-neo-primary/10 dark:bg-dark-primary/20 text-neo-primary dark:text-dark-primary border border-neo-primary/30 dark:border-dark-primary/30',
    secondary:
      'bg-neo-secondary-100 dark:bg-dark-surface-alt text-neo-secondary-500 dark:text-neo-secondary-300 border border-neo-secondary-300 dark:border-dark-border',
    success:
      'bg-neo-success/10 dark:bg-dark-success/20 text-neo-success dark:text-dark-success border border-neo-success/30 dark:border-dark-success/30',
    warning:
      'bg-neo-warning/10 dark:bg-dark-warning/20 text-neo-warning dark:text-dark-warning border border-neo-warning/30 dark:border-dark-warning/30',
    danger:
      'bg-neo-danger/10 dark:bg-dark-danger/20 text-neo-danger dark:text-dark-danger border border-neo-danger/30 dark:border-dark-danger/30',
    accent:
      'bg-neo-accent/10 dark:bg-dark-accent/20 text-neo-accent dark:text-dark-accent border border-neo-accent/30 dark:border-dark-accent/30',
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
