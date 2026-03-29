/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useContacts } from '../useContacts'

// Mock del servicio de Supabase
vi.mock('../../services/supabase', () => ({
  contactsService: {
    getContacts: vi.fn(),
    createContact: vi.fn(),
    updateContact: vi.fn(),
    deleteContact: vi.fn(),
  },
}))

// Mock del useAuth
vi.mock('../useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id' },
  })),
}))

describe('useContacts Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('cargar contactos', () => {
    it('debe cargar la lista de contactos', async () => {
      const mockContacts = [
        {
          id: '1',
          name: 'Juan Pérez',
          email: 'juan@example.com',
          phone: '123-456-7890',
          contact_type: 'customer',
        },
        {
          id: '2',
          name: 'María García',
          email: 'maria@example.com',
          phone: '098-765-4321',
          contact_type: 'supplier',
        },
      ]

      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: mockContacts,
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        expect(result.current.contacts).toEqual(mockContacts)
        expect(result.current.loading).toBe(false)
      })
    })

    it('debe manejar errores al cargar contactos', async () => {
      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: null,
        error: { message: 'Error loading contacts' },
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        expect(result.current.error).toBe('Error loading contacts')
      })
    })

    it('debe cargar contactos por tipo', async () => {
      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: [],
        error: null,
      })

      renderHook(() => useContacts('customer'))

      await waitFor(() => {
        expect(import('../../services/supabase').contactsService.getContacts).toHaveBeenCalledWith(
          'test-user-id',
          'customer'
        )
      })
    })
  })

  describe('crear contacto', () => {
    it('debe crear un contacto exitosamente', async () => {
      const mockContactData = {
        name: 'Carlos López',
        email: 'carlos@example.com',
        phone: '555-1234',
        contact_type: 'customer',
        address: 'Calle 123',
      }

      const mockResponse = {
        data: {
          id: 'contact-123',
          ...mockContactData,
        },
        error: null,
      }

      vi.mocked(import('../../services/supabase').contactsService.createContact).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useContacts())

      let response
      await act(async () => {
        response = await result.current.createContact(mockContactData)
      })

      expect(response.error).toBeNull()
      expect(response.data.id).toBe('contact-123')
      expect(response.data.name).toBe('Carlos López')
      expect(result.current.contacts).toContainEqual(response.data)
    })

    it('debe manejar errores al crear contacto', async () => {
      const mockContactData = {
        name: 'Carlos López',
        contact_type: 'customer',
      }

      vi.mocked(import('../../services/supabase').contactsService.createContact).mockResolvedValue({
        data: null,
        error: { message: 'Error creating contact' },
      })

      const { result } = renderHook(() => useContacts())

      let response
      await act(async () => {
        response = await result.current.createContact(mockContactData)
      })

      expect(response.data).toBeNull()
      expect(response.error.message).toBe('Error creating contact')
      expect(result.current.error).toBe('Error creating contact')
    })

    it('debe retornar error si no hay usuario autenticado', async () => {
      vi.mocked(import('../useAuth').useAuth).mockReturnValue({
        user: null,
      })

      const { result } = renderHook(() => useContacts())

      const response = await result.current.createContact({ name: 'Test' })

      expect(response.error).toBeDefined()
      expect(response.error.message).toBe('No autenticado')
    })
  })

  describe('actualizar contacto', () => {
    it('debe actualizar un contacto existente', async () => {
      const contactId = 'contact-123'
      const updates = {
        name: 'Carlos López Actualizado',
        phone: '555-9999',
      }

      const mockResponse = {
        data: {
          id: contactId,
          ...updates,
        },
        error: null,
      }

      vi.mocked(import('../../services/supabase').contactsService.updateContact).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useContacts())

      // First add a contact to the list
      result.current.contacts = [{ id: contactId, name: 'Carlos López' }]

      let response
      await act(async () => {
        response = await result.current.updateContact(contactId, updates)
      })

      expect(response.error).toBeNull()
      expect(response.data.name).toBe('Carlos López Actualizado')
    })

    it('debe manejar errores al actualizar contacto', async () => {
      const contactId = 'contact-123'
      const updates = { name: 'Updated' }

      vi.mocked(import('../../services/supabase').contactsService.updateContact).mockResolvedValue({
        data: null,
        error: { message: 'Error updating contact' },
      })

      const { result } = renderHook(() => useContacts())

      let response
      await act(async () => {
        response = await result.current.updateContact(contactId, updates)
      })

      expect(response.data).toBeNull()
      expect(response.error.message).toBe('Error updating contact')
    })
  })

  describe('eliminar contacto', () => {
    it('debe eliminar un contacto existente', async () => {
      const contactId = 'contact-123'

      vi.mocked(import('../../services/supabase').contactsService.deleteContact).mockResolvedValue({
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      // First add a contact to the list
      result.current.contacts = [{ id: contactId, name: 'Test Contact' }]

      let response
      await act(async () => {
        response = await result.current.deleteContact(contactId)
      })

      expect(response.error).toBeNull()
      expect(result.current.contacts.find(c => c.id === contactId)).toBeUndefined()
    })

    it('debe manejar errores al eliminar contacto', async () => {
      const contactId = 'contact-123'

      vi.mocked(import('../../services/supabase').contactsService.deleteContact).mockResolvedValue({
        error: { message: 'Error deleting contact' },
      })

      const { result } = renderHook(() => useContacts())

      let response
      await act(async () => {
        response = await result.current.deleteContact(contactId)
      })

      expect(response.error.message).toBe('Error deleting contact')
    })
  })

  describe('buscar contactos', () => {
    it('debe buscar contactos por nombre', async () => {
      const mockContacts = [
        { id: '1', name: 'Juan Pérez', email: 'juan@example.com' },
        { id: '2', name: 'María García', email: 'maria@example.com' },
        { id: '3', name: 'Juan López', email: 'juanlopez@example.com' },
      ]

      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: mockContacts,
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        const results = result.current.searchContacts('Juan')
        expect(results).toHaveLength(2)
        expect(results.every(c => c.name.includes('Juan'))).toBe(true)
      })
    })

    it('debe buscar contactos por email', async () => {
      const mockContacts = [
        { id: '1', name: 'Juan Pérez', email: 'juan@example.com' },
        { id: '2', name: 'María García', email: 'maria@example.com' },
      ]

      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: mockContacts,
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        const results = result.current.searchContacts('juan@example')
        expect(results).toHaveLength(1)
        expect(results[0].email).toContain('juan@example')
      })
    })

    it('debe buscar contactos por teléfono', async () => {
      const mockContacts = [
        { id: '1', name: 'Juan Pérez', phone: '123-456-7890' },
        { id: '2', name: 'María García', phone: '098-765-4321' },
      ]

      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: mockContacts,
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        const results = result.current.searchContacts('123')
        expect(results).toHaveLength(1)
        expect(results[0].phone).toContain('123')
      })
    })

    it('debe retornar todos los contactos si la búsqueda está vacía', async () => {
      const mockContacts = [
        { id: '1', name: 'Juan Pérez' },
        { id: '2', name: 'María García' },
      ]

      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: mockContacts,
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        const results = result.current.searchContacts('')
        expect(results).toHaveLength(2)
      })
    })
  })

  describe('filtrar por tipo', () => {
    it('debe filtrar contactos por cliente', async () => {
      const mockContacts = [
        { id: '1', name: 'Juan Pérez', contact_type: 'customer' },
        { id: '2', name: 'María García', contact_type: 'supplier' },
        { id: '3', name: 'Carlos López', contact_type: 'customer' },
      ]

      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: mockContacts,
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        const results = result.current.filterByType('customer')
        expect(results).toHaveLength(2)
        expect(results.every(c => c.contact_type === 'customer')).toBe(true)
      })
    })

    it('debe filtrar contactos por proveedor', async () => {
      const mockContacts = [
        { id: '1', name: 'Juan Pérez', contact_type: 'customer' },
        { id: '2', name: 'María García', contact_type: 'supplier' },
        { id: '3', name: 'Carlos López', contact_type: 'customer' },
      ]

      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: mockContacts,
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        const results = result.current.filterByType('supplier')
        expect(results).toHaveLength(1)
        expect(results[0].contact_type).toBe('supplier')
      })
    })

    it('debe retornar todos los contactos si el filtro es "all"', async () => {
      const mockContacts = [
        { id: '1', name: 'Juan Pérez', contact_type: 'customer' },
        { id: '2', name: 'María García', contact_type: 'supplier' },
      ]

      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: mockContacts,
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        const results = result.current.filterByType('all')
        expect(results).toHaveLength(2)
      })
    })
  })

  describe('helpers y computed values', () => {
    it('debe calcular isEmpty correctamente', async () => {
      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: [],
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        expect(result.current.isEmpty).toBe(true)
      })
    })

    it('debe calcular totalContacts correctamente', async () => {
      const mockContacts = [
        { id: '1', contact_type: 'customer' },
        { id: '2', contact_type: 'supplier' },
        { id: '3', contact_type: 'employee' },
      ]

      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: mockContacts,
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        expect(result.current.totalContacts).toBe(3)
      })
    })

    it('debe calcular customersCount correctamente', async () => {
      const mockContacts = [
        { id: '1', contact_type: 'customer' },
        { id: '2', contact_type: 'supplier' },
        { id: '3', contact_type: 'customer' },
      ]

      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: mockContacts,
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        expect(result.current.customersCount).toBe(2)
      })
    })

    it('debe calcular suppliersCount correctamente', async () => {
      const mockContacts = [
        { id: '1', contact_type: 'customer' },
        { id: '2', contact_type: 'supplier' },
        { id: '3', contact_type: 'supplier' },
      ]

      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: mockContacts,
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        expect(result.current.suppliersCount).toBe(2)
      })
    })

    it('debe calcular employeesCount correctamente', async () => {
      const mockContacts = [
        { id: '1', contact_type: 'employee' },
        { id: '2', contact_type: 'supplier' },
        { id: '3', contact_type: 'employee' },
      ]

      vi.mocked(import('../../services/supabase').contactsService.getContacts).mockResolvedValue({
        data: mockContacts,
        error: null,
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        expect(result.current.employeesCount).toBe(2)
      })
    })
  })
})
