import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  error = '',
  helperText = '',
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const inputClasses = twMerge(
    clsx(
      'w-full px-4 py-2 border-2 rounded-kawaii transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-gray-100 disabled:cursor-not-allowed',
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
      Icon && 'pl-11',
      className
    )
  )

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
