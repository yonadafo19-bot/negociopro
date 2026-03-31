import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

const Card = ({
  children,
  className = '',
  padding = 'md',
  shadow = true,
  hover = false,
  ...props
}) => {
  const baseStyles =
    'bg-neo-surface dark:bg-dark-surface rounded-neo-lg border border-neo-border dark:border-dark-border transition-all duration-200'

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
      paddings[padding],
      shadow && 'shadow-neo',
      hover && 'hover:shadow-neo-lg cursor-pointer',
      className
    )
  )

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = '' }) => (
  <div className={clsx('mb-4', className)}>{children}</div>
)

const CardTitle = ({ children, className = '' }) => (
  <h3 className={clsx('text-xl font-bold text-neo-text dark:text-dark-text', className)}>
    {children}
  </h3>
)

const CardDescription = ({ children, className = '' }) => (
  <p className={clsx('text-sm text-neo-text-muted dark:text-dark-text-muted mt-1', className)}>
    {children}
  </p>
)

const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
)

const CardFooter = ({ children, className = '' }) => (
  <div className={clsx('mt-4 pt-4 border-t border-neo-border dark:border-dark-border', className)}>
    {children}
  </div>
)

export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export default Card
