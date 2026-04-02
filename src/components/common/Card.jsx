import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

const Card = ({
  children,
  className = '',
  padding = 'md',
  variant = 'default',
  hover = false,
  ...props
}) => {
  const baseStyles = 'transition-all duration-300'

  const variants = {
    default: 'card-neo',
    sm: 'card-neo-sm',
    lg: 'card-neo-lg',
    inset: 'card-neo-inset',
    insetSm: 'card-neo-inset-sm',
    hover: 'card-neo-hover',
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }

  const classes = twMerge(
    clsx(
      baseStyles,
      variants[variant],
      hover && 'hover:-translate-y-1',
      paddings[padding],
      className
    )
  )

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = '', action }) => (
  <div className={clsx('flex items-start justify-between mb-4', className)}>
    {children}
    {action && <div className="flex-shrink-0 ml-4">{action}</div>}
  </div>
)

const CardTitle = ({ children, className = '' }) => (
  <h3 className={clsx('text-xl font-bold text-gray-800 dark:text-gray-100', className)}>
    {children}
  </h3>
)

const CardDescription = ({ children, className = '' }) => (
  <p className={clsx('text-sm text-gray-500 dark:text-gray-400 mt-1', className)}>
    {children}
  </p>
)

const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
)

const CardFooter = ({ children, className = '' }) => (
  <div className={clsx('mt-6 pt-4 divider-neo', className)}>
    {children}
  </div>
)

export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export default Card
