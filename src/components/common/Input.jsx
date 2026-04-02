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
      size = 'md',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'input-neo-sm',
      md: 'input-neo',
      lg: 'input-neo-lg',
    }

    const inputClasses = twMerge(
      clsx(
        sizeClasses[size],
        error && 'ring-2 ring-danger-500 dark:ring-danger-400',
        Icon && 'pl-11',
        className
      )
    )

    const labelClasses = clsx(
      'block text-sm font-medium mb-2 transition-colors',
      error
        ? 'text-danger-500 dark:text-danger-400'
        : 'text-gray-700 dark:text-gray-200'
    )

    const iconClasses = clsx(
      'absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors',
      error
        ? 'text-danger-500 dark:text-danger-400'
        : 'text-gray-400 dark:text-gray-500'
    )

    return (
      <div className={containerClassName}>
        {label && <label className={labelClasses}>{label}</label>}

        <div className="relative">
          {Icon && (
            <Icon
              className={iconClasses}
              style={{ left: size === 'sm' ? '0.75rem' : size === 'lg' ? '1.25rem' : '1rem' }}
            />
          )}
          <input ref={ref} className={inputClasses} {...props} />
        </div>

        {error && <p className="mt-1.5 text-sm text-danger-500 dark:text-danger-400">{error}</p>}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
