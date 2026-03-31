import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { forwardRef } from 'react'

const Input = forwardRef(
  (
    {
      label,
      error = '',
      helperText = '',
      icon: Icon,
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const inputClasses = twMerge(
      clsx(
        'w-full px-4 py-2 bg-neo-bg dark:bg-dark-bg-alt border rounded-neo transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neo-primary dark:focus:ring-dark-primary dark:focus:ring-offset-dark-bg focus:border-transparent',
        'disabled:bg-neo-bg-alt dark:disabled:bg-dark-bg disabled:cursor-not-allowed',
        'shadow-inner-shadow',
        error
          ? 'border-neo-danger dark:border-dark-danger focus:ring-neo-danger dark:focus:ring-dark-danger'
          : 'border-neo-border dark:border-dark-border',
        Icon && 'pl-11',
        className
      )
    )

    const labelClasses = clsx(
      'block text-sm font-medium mb-1',
      error
        ? 'text-neo-danger dark:text-dark-danger'
        : 'text-neo-text dark:text-dark-text'
    )

    return (
      <div className={containerClassName}>
        {label && <label className={labelClasses}>{label}</label>}

        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neo-text-muted dark:text-dark-text-muted" />
          )}
          <input ref={ref} className={inputClasses} {...props} />
        </div>

        {error && <p className="mt-1 text-sm text-neo-danger dark:text-dark-danger">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-neo-text-muted dark:text-dark-text-muted">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
