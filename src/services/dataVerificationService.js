/**
 * Servicio de Verificación de Datos para Supabase
 * Verifica si los datos existen antes de hacer operaciones
 * Evita errores 403 "Not Found"
 */

import { supabase } from './supabase'

// Cache local para almacenar qué datos existen
const dataCache = new Map()

/**
 * Verifica si un producto existe
 */
export const productExists = async (productId) => {
  const { data, error } = await supabase
    .from('products')
    .select('id, name')
    .eq('id', productId)
    .single()

  if (error) {
    console.error('Error checking product existence:', error)
    throw error
  }

  return !!data
}

/**
 * Verifica si un contacto existe
 */
export const contactExists = async (contactId) => {
  const { data, error } = await supabase
    .from('contacts')
    .select('id')
    .eq('id', contactId)
    .single()

  if (error) {
    console.error('Error checking contact existence:', error)
    throw error
  }

  return !!data
}

/**
 * Verifica si hay productos en el inventario
 */
export const hasProducts = async (userId) => {
  const { count, error } = await supabase
    .from('products')
    .select('count', { count: 'id' })
    .eq('user_id', userId)
    .eq('is_active', true)

  if (error) {
    console.error('Error checking products count:', error)
    throw error
  }

  return count > 0
}

/**
 * Verifica si hay transacciones
 */
export const hasTransactions = async (userId) => {
  const { count, error } = await supabase
    .from('transactions')
    .select('count', { count: 'id' })
    .eq('user_id', userId)

  if (error) {
    console.error('Error checking transactions count:', error)
    throw error
  }

  return count > 0
}

/**
 * Verifica si una tabla existe
 */
export const tableExists = async (tableName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*', { count: 'head', limit: 1 })
      .single()

    if (error) {
      console.error(`Error checking table ${tableName}:`, error)
      return false
    }

    return !!data
}

/**
 * Limpia cache de verificación
 */
export const clearDataCache = () => {
  dataCache.clear()
}

/**
 * Actualiza cache cuando se crean/actualizan datos
 */
export const updateProductCache = (product) => {
  if (product) dataCache.set(product.id, product)
}

export const clearProductCache = (productId) => {
  dataCache.delete(productId)
}

export const clearDataCache = () => {
  clearDataCache()
}

export default {
  productExists,
  contactExists,
  hasProducts,
  hasTransactions,
  tableExists,
  clearDataCache,
  updateProductCache,
  clearProductCache,
  clearDataCache,
}
