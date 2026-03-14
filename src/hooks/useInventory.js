import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { productsService } from '../services/supabase'

/**
 * Hook personalizado para gestión de inventario
 *
 * @example
 * const { products, loading, error, createProduct, updateProduct, deleteProduct } = useInventory()
 */
export const useInventory = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar productos
  const fetchProducts = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await productsService.getProducts(user.id)

      if (error) throw error

      setProducts(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
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
      setProducts((prev) => [data, ...prev])

      return { data, error: null }
    } catch (err) {
      setError(err.message)
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
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? data : p))
      )

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
      setProducts((prev) => prev.filter((p) => p.id !== productId))

      return { error: null }
    } catch (err) {
      setError(err.message)
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

      return data || []
    } catch (err) {
      console.error('Error fetching low stock products:', err)
      return []
    }
  }

  // Buscar productos
  const searchProducts = (searchTerm) => {
    if (!searchTerm) return products

    const term = searchTerm.toLowerCase()
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term)
    )
  }

  // Filtrar por categoría
  const filterByCategory = (category) => {
    if (!category || category === 'all') return products

    return products.filter((p) => p.category === category)
  }

  // Obtener categorías únicas
  const getCategories = () => {
    const categories = new Set(
      products.map((p) => p.category).filter(Boolean)
    )
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
    lowStockCount: products.filter((p) => p.stock_quantity <= p.min_stock_alert).length,
  }
}

export default useInventory
