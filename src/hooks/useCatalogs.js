import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { catalogsService } from '../services/supabase'

export const useCatalogs = () => {
  const { user } = useAuth()
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load catalogs
  const loadCatalogs = useCallback(async () => {
    if (!user) {
      setCatalogs([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const { data, error } = await catalogsService.getCatalogs(user.id)

      if (error) throw error

      setCatalogs(data || [])
    } catch (err) {
      console.error('Error loading catalogs:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadCatalogs()
  }, [loadCatalogs])

  // Create catalog
  const createCatalog = async (catalogData) => {
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    try {
      const { data, error } = await catalogsService.createCatalog(
        {
          user_id: user.id,
          name: catalogData.name,
          description: catalogData.description || null,
          theme: catalogData.theme || 'default',
          is_public: catalogData.is_public !== undefined ? catalogData.is_public : true,
        },
        catalogData.product_ids || []
      )

      if (error) throw error

      setCatalogs((prev) => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error creating catalog:', err)
      throw err
    }
  }

  // Update catalog
  const updateCatalog = async (catalogId, updates) => {
    try {
      const { data, error } = await catalogsService.updateCatalog(catalogId, updates)

      if (error) throw error

      setCatalogs((prev) =>
        prev.map((cat) => (cat.id === catalogId ? { ...cat, ...data } : cat))
      )

      return data
    } catch (err) {
      console.error('Error updating catalog:', err)
      throw err
    }
  }

  // Update catalog products
  const updateCatalogProducts = async (catalogId, productIds) => {
    try {
      const { error } = await catalogsService.updateCatalogProducts(catalogId, productIds)

      if (error) throw error

      // Reload catalogs to get updated products
      await loadCatalogs()

      return { success: true }
    } catch (err) {
      console.error('Error updating catalog products:', err)
      throw err
    }
  }

  // Delete catalog
  const deleteCatalog = async (catalogId) => {
    try {
      const { error } = await catalogsService.deleteCatalog(catalogId)

      if (error) throw error

      setCatalogs((prev) => prev.filter((cat) => cat.id !== catalogId))
    } catch (err) {
      console.error('Error deleting catalog:', err)
      throw err
    }
  }

  // Get catalog by share link (public)
  const getPublicCatalog = async (shareLink) => {
    try {
      const { data, error } = await catalogsService.getCatalogByShareLink(shareLink)

      if (error) throw error

      return data
    } catch (err) {
      console.error('Error fetching public catalog:', err)
      throw err
    }
  }

  // Get share URL
  const getShareUrl = (shareLink) => {
    return `${window.location.origin}/catalog/${shareLink}`
  }

  // Get catalog by ID
  const getCatalogById = (catalogId) => {
    return catalogs.find((cat) => cat.id === catalogId)
  }

  // Stats
  const stats = {
    total: catalogs.length,
    public: catalogs.filter((cat) => cat.is_public).length,
    totalViews: catalogs.reduce((sum, cat) => sum + (cat.view_count || 0), 0),
  }

  return {
    catalogs,
    loading,
    error,
    createCatalog,
    updateCatalog,
    updateCatalogProducts,
    deleteCatalog,
    getPublicCatalog,
    getShareUrl,
    getCatalogById,
    loadCatalogs,
    stats,
  }
}
