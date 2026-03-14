import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { contactsService } from '../services/supabase'

/**
 * Hook personalizado para gestión de contactos
 *
 * @example
 * const { contacts, loading, createContact, updateContact, deleteContact } = useContacts()
 */
export const useContacts = (contactType = null) => {
  const { user } = useAuth()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar contactos
  const fetchContacts = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await contactsService.getContacts(user.id, contactType)

      if (error) throw error

      setContacts(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching contacts:', err)
    } finally {
      setLoading(false)
    }
  }

  // Crear contacto
  const createContact = async (contactData) => {
    if (!user) return { error: new Error('No autenticado') }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await contactsService.createContact({
        ...contactData,
        user_id: user.id,
      })

      if (error) throw error

      // Actualizar lista localmente
      setContacts((prev) => [data, ...prev])

      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Actualizar contacto
  const updateContact = async (contactId, updates) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await contactsService.updateContact(contactId, updates)

      if (error) throw error

      // Actualizar lista localmente
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? data : c))
      )

      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  // Eliminar contacto (soft delete)
  const deleteContact = async (contactId) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await contactsService.deleteContact(contactId)

      if (error) throw error

      // Remover de la lista localmente
      setContacts((prev) => prev.filter((c) => c.id !== contactId))

      return { error: null }
    } catch (err) {
      setError(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  // Buscar contactos
  const searchContacts = (searchTerm) => {
    if (!searchTerm) return contacts

    const term = searchTerm.toLowerCase()
    return contacts.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.phone?.toLowerCase().includes(term)
    )
  }

  // Filtrar por tipo
  const filterByType = (type) => {
    if (!type || type === 'all') return contacts
    return contacts.filter((c) => c.contact_type === type)
  }

  // Cargar contactos al montar
  useEffect(() => {
    fetchContacts()
  }, [user, contactType])

  return {
    // Estado
    contacts,
    loading,
    error,

    // Métodos
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    filterByType,

    // Helpers
    isEmpty: contacts.length === 0,
    totalContacts: contacts.length,
    customersCount: contacts.filter((c) => c.contact_type === 'customer').length,
    suppliersCount: contacts.filter((c) => c.contact_type === 'supplier').length,
    employeesCount: contacts.filter((c) => c.contact_type === 'employee').length,
  }
}

export default useContacts
