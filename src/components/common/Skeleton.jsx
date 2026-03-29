import React from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Componentes de Skeleton para loading states
 * Proporcionan feedback visual mientras se cargan los datos
 */

const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded'

export const Skeleton = ({ className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-gray-200 dark:bg-gray-700',
    primary: 'bg-primary-200 dark:bg-primary-900/30',
    secondary: 'bg-secondary-200 dark:bg-secondary-900/30',
    text: 'bg-gray-300 dark:bg-gray-600 h-4 w-3/4',
    circular: 'rounded-full',
  }

  const classes = twMerge(clsx(baseClass, variants[variant]), className)

  return <div className={classes} {...props} />
}

/**
 * Skeleton para tarjeta de producto
 */
export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-kawaii-lg border-2 border-gray-200 dark:border-gray-700 p-4">
    <div className="flex gap-4">
      <Skeleton className="w-20 h-20 rounded-kawaii flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/4 mt-2" />
      </div>
    </div>
  </div>
)

/**
 * Skeleton para tarjeta de estadística
 */
export const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-kawaii-lg border-2 border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  </div>
)

/**
 * Skeleton para tabla
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
)

/**
 * Skeleton para lista de items
 */
export const ListSkeleton = ({ items = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
)

/**
 * Skeleton para gráfico
 */
export const ChartSkeleton = ({ height = 200 }) => (
  <div className="bg-white dark:bg-gray-800 rounded-kawaii-lg p-6">
    <Skeleton className="h-6 w-48 mb-4" />
    <Skeleton className="w-full" style={{ height: `${height}px` }} />
  </div>
)

/**
 * Skeleton para formulario
 */
export const FormSkeleton = ({ fields = 4 }) => (
  <div className="space-y-4">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
    <Skeleton className="h-12 w-full" />
  </div>
)

/**
 * Skeleton para tarjeta completa
 */
export const CardSkeleton = ({ showHeader = true, showFooter = false, lines = 3 }) => (
  <div className="bg-white dark:bg-gray-800 rounded-kawaii-lg border-2 border-gray-200 dark:border-gray-700 p-6">
    {showHeader && (
      <div className="space-y-2 mb-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    )}
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
    {showFooter && (
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    )}
  </div>
)

/**
 * Spinner de carga
 */
export const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent ${sizes[size]}`}
      />
      {text && <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  )
}

/**
 * Page Loader - Para cargar páginas completas
 */
export const PageLoader = ({ text = 'Cargando...' }) => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text={text} />
  </div>
)

/**
 * Inline Loader - Para áreas pequeñas
 */
export const InlineLoader = ({ text = '' }) => (
  <div className="flex items-center gap-2">
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-solid border-primary-500 border-r-transparent" />
    {text && <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>}
  </div>
)

export default Skeleton
