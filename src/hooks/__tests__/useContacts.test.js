/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useContacts } from '../useContacts'

// Mock services - Simple approach
const mockContacts = [
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com', contact_type: 'customer' },
  { id: '2', name: 'María García', email: 'maria@example.com', contact_type: 'supplier' },
]

const mockServices = {
  getContacts: vi.fn().mockResolvedValue({ data: mockContacts, error: null }),
  createContact: vi.fn().mockResolvedValue({
    data: { id: 'new-1', name: 'Test', contact_type: 'customer' },
    error: null,
  }),
  updateContact: vi.fn().mockResolvedValue({
    data: { id: '1', name: 'Updated', contact_type: 'customer' },
    error: null,
  }),
  deleteContact: vi.fn().mockResolvedValue({ error: null }),
}

vi.mock('../../services/supabase', () => ({
  contactsService: mockServices,
}))

// Mock useAuth
const mockUser = { id: 'test-user-id' }
vi.mock('../useAuth', () => ({
  useAuth: vi.fn(() => ({ user: mockUser })),
}))

describe('useContacts Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('cargar contactos', () => {
    it('debe cargar la lista de contactos', async () => {
      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        expect(result.current.contacts).toEqual(mockContacts)
        expect(result.current.loading).toBe(false)
      })

      expect(mockServices.getContacts).toHaveBeenCalledWith('test-user-id', null)
    })

    it('debe manejar errores al cargar contactos', async () => {
      mockServices.getContacts.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error loading contacts' },
      })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        expect(result.current.error).toBe('Error loading contacts')
      })
    })

    it('debe cargar contactos por tipo', async () => {
      renderHook(() => useContacts('customer'))

      await waitFor(() => {
        expect(mockServices.getContacts).toHaveBeenCalledWith('test-user-id', 'customer')
      })
    })
  })

  describe('crear contacto', () => {
    it('debe crear un contacto exitosamente', async () => {
      const { result } = renderHook(() => useContacts())

      let response
      await act(async () => {
        response = await result.current.createContact({
          name: 'Carlos',
          contact_type: 'customer',
        })
      })

      expect(response.error).toBeNull()
      expect(response.data.id).toBe('new-1')
    })

    it('debe manejar errores al crear contacto', async () => {
      mockServices.createContact.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error creating contact' },
      })

      const { result } = renderHook(() => useContacts())

      let response
      await act(async () => {
        response = await result.current.createContact({ name: 'Test', contact_type: 'customer' })
      })

      expect(response.data).toBeNull()
      expect(response.error.message).toBe('Error creating contact')
    })
  })

  describe('actualizar contacto', () => {
    it('debe actualizar un contacto existente', async () => {
      const { result } = renderHook(() => useContacts())

      let response
      await act(async () => {
        response = await result.current.updateContact('1', { name: 'Updated' })
      })

      expect(response.error).toBeNull()
      expect(response.data.name).toBe('Updated')
    })

    it('debe manejar errores al actualizar contacto', async () => {
      mockServices.updateContact.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error updating contact' },
      })

      const { result } = renderHook(() => useContacts())

      let response
      await act(async () => {
        response = await result.current.updateContact('1', { name: 'Updated' })
      })

      expect(response.data).toBeNull()
      expect(response.error.message).toBe('Error updating contact')
    })
  })

  describe('eliminar contacto', () => {
    it('debe eliminar un contacto existente', async () => {
      const { result } = renderHook(() => useContacts())

      let response
      await act(async () => {
        response = await result.current.deleteContact('1')
      })

      expect(response.error).toBeNull()
    })

    it('debe manejar errores al eliminar contacto', async () => {
      mockServices.deleteContact.mockResolvedValueOnce({
        error: { message: 'Error deleting contact' },
      })

      const { result } = renderHook(() => useContacts())

      let response
      await act(async () => {
        response = await result.current.deleteContact('1')
      })

      expect(response.error.message).toBe('Error deleting contact')
    })
  })

  describe('buscar y filtrar', () => {
    it('debe buscar contactos por nombre', async () => {
      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        const results = result.current.searchContacts('Juan')
        expect(results).toHaveLength(1)
        expect(results[0].name).toContain('Juan')
      })
    })

    it('debe filtrar contactos por tipo', async () => {
      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        const customers = result.current.filterByType('customer')
        expect(customers).toHaveLength(1)
        expect(customers[0].contact_type).toBe('customer')

        const suppliers = result.current.filterByType('supplier')
        expect(suppliers).toHaveLength(1)
        expect(suppliers[0].contact_type).toBe('supplier')
      })
    })
  })

  describe('helpers', () => {
    it('debe calcular isEmpty correctamente', async () => {
      mockServices.getContacts.mockResolvedValueOnce({ data: [], error: null })

      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        expect(result.current.isEmpty).toBe(true)
      })
    })

    it('debe calcular totalContacts correctamente', async () => {
      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        expect(result.current.totalContacts).toBe(2)
      })
    })

    it('debe calcular customersCount correctamente', async () => {
      const { result } = renderHook(() => useContacts())

      await waitFor(() => {
        expect(result.current.customersCount).toBe(1)
      })
    })
  })
})
