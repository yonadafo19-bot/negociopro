import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { productsService } from '../services/supabase'
import { mockProducts, mockCategories } from '../data/mockData'

/**
 * Hook personalizado para gestión de inventario
 * Usa datos mock cuando no hay conexión a Supabase (modo demo)
 *
 * @example
 * const { products, loading, createProduct } = useInventory()
 */
export const useInventory = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Cargar productos
  const fetchProducts = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await productsService.getProducts(user.id)

      if (error) throw error

      // Si no hay productos, usar datos mock
      setProducts(data && data.length > 0 ? data : mockProducts)
      setIsDemoMode(data && data.length > 0 ? false : true)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
      // En caso de error, también usar datos mock
      setProducts(mockProducts)
      setIsDemoMode(true)
    } finally {
      setLoading(false)
    }
  }

  // Crear producto
  const createProduct = async (productData) => {
    if (!user) return { error: new Error('No autenticado') }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await productsService.createProduct({
        ...productData,
        user_id: user.id,
      })

      if (error) throw error

      // Actualizar lista localmente
      setProducts(prev => [data, ...prev])

      return { data, error: null }
    } catch (err) {
      setError(err.message)
      // En caso de error, agregar producto a lista mock
      const newProduct = {
        id: `mock-${Date.now()}`,
        ...productData,
        user_id: user.id,
      }
      setProducts(prev => [newProduct, ...prev])
      setIsDemoMode(true)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Actualizar producto
  const updateProduct = async (productId, updates) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await productsService.updateProduct(productId, updates)

      if (error) throw error

      // Actualizar lista localmente
      setProducts(prev => prev.map(p => (p.id === productId ? data : p)))

      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Eliminar producto (soft delete)
  const deleteProduct = async (productId) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await productsService.deleteProduct(productId)

      if (error) throw error

      // Remover de la lista localmente
      setProducts(prev => prev.filter(p => p.id !== productId))

      return { error: null }
    } catch (err) {
      setError(err.message)
      // En caso de error, también remover de lista mock
      setProducts(prev => prev.filter(p => p.id !== productId))
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  // Obtener productos con stock bajo
  const getLowStockProducts = async () => {
    if (!user) return []

    try {
      const { data, error } = await productsService.getLowStockProducts(user.id)

      if (error) throw error

      // Filtrar productos con stock bajo de mock data
      const lowStock = (data || mockProducts).filter(p => p.stock_quantity <= p.min_stock_alert)
      return lowStock
    } catch (err) {
      console.error('Error fetching low stock products:', err)
      // En caso de error, devolver productos mock con stock bajo
      return (mockProducts || []).filter(p => p.stock_quantity <= p.min_stock_alert)
    }
  }

  // Buscar productos
  const searchProducts = (searchTerm) => {
    if (!searchTerm) return products

    const term = searchTerm.toLowerCase()
    return products.filter(
      p =>
        p.name?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term)
    )
  }

  // Filtrar por categoría
  const filterByCategory = (category) => {
    if (!category || category === 'all') return products

    return products.filter(p => p.category === category)
  }

  // Obtener categorías únicas
  const getCategories = () => {
    const categories = new Set(products.map(p => p.category).filter(Boolean))
    return Array.from(categories)
  }

  // Cargar productos al montar
  useEffect(() => {
    fetchProducts()
  }, [user])

  return {
    // Estado
    products,
    loading,
    error,
    isDemoMode,

    // Métodos
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    searchProducts,
    filterByCategory,
    getCategories,

    // Helpers
    isEmpty: products.length === 0,
    totalProducts: products.length,
    lowStockCount: products.filter(p => p.stock_quantity <= p.min_stock_alert).length,
  }
}

export default useInventory
