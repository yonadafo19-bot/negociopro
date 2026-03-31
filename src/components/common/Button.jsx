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
    'inline-flex items-center justify-center gap-2 font-medium rounded-neo transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-dark-bg'

  const variants = {
    primary:
      'bg-neo-primary dark:bg-dark-primary text-white hover:bg-neo-primary-light dark:hover:bg-dark-primary-light focus:ring-neo-primary dark:focus:ring-dark-primary shadow-neo hover:shadow-neo-lg active:shadow-inner-shadow',
    secondary:
      'bg-neo-surface dark:bg-dark-surface text-neo-text dark:text-dark-text hover:bg-neo-bg dark:hover:bg-dark-bg-alt focus:ring-gray-400 border border-neo-border dark:border-dark-border shadow-neo hover:shadow-neo-lg active:shadow-inner-shadow',
    accent:
      'bg-neo-accent dark:bg-dark-accent text-white hover:bg-neo-accent-light dark:hover:bg-dark-accent-light focus:ring-neo-accent dark:focus:ring-dark-accent shadow-neo hover:shadow-neo-lg active:shadow-inner-shadow',
    success:
      'bg-neo-success dark:bg-dark-success text-white hover:bg-neo-success-light dark:hover:bg-dark-success-light focus:ring-neo-success dark:focus:ring-dark-success shadow-neo hover:shadow-neo-lg active:shadow-inner-shadow',
    danger:
      'bg-neo-danger dark:bg-dark-danger text-white hover:bg-neo-danger-light dark:hover:bg-dark-danger-light focus:ring-neo-danger dark:focus:ring-dark-danger shadow-neo hover:shadow-neo-lg active:shadow-inner-shadow',
    warning:
      'bg-neo-warning dark:bg-dark-warning text-white hover:bg-neo-warning-light dark:hover:bg-dark-warning-light focus:ring-neo-warning dark:focus:ring-dark-warning shadow-neo hover:shadow-neo-lg active:shadow-inner-shadow',
    outline:
      'border-2 border-neo-primary dark:border-dark-primary text-neo-primary dark:text-dark-primary hover:bg-neo-bg dark:hover:bg-dark-bg-alt focus:ring-neo-primary dark:focus:ring-dark-primary shadow-neo-sm',
    ghost:
      'text-neo-text dark:text-dark-text hover:bg-neo-bg dark:hover:bg-dark-bg-alt focus:ring-gray-400',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
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
