import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'

  const variants = {
    primary:
      'btn-neo-primary text-white',
    secondary:
      'btn-neo text-gray-700 dark:text-gray-200 hover:text-primary-500 dark:hover:text-primary-400',
    accent:
      'btn-neo-accent text-white',
    success:
      'btn-neo-success text-white',
    danger:
      'btn-neo-danger text-white',
    warning:
      'btn-neo-warning text-white',
    outline:
      'btn-neo border-2 border-primary-500 dark:border-primary-400 text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
    ghost:
      'btn-neo text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400',
  }

  const sizes = {
    sm: 'btn-neo-sm',
    md: 'btn-neo',
    lg: 'btn-neo-lg',
    xl: 'btn-neo-lg px-10 py-5 text-xl',
  }

  const classes = twMerge(clsx(baseStyles, variants[variant], sizes[size], className))

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Procesando...
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4" />}
          {children}
        </>
      )}
    </button>
  )
}

export default Button
