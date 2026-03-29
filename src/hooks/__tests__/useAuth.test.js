/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '../useAuth'

// Mock del servicio de Supabase
vi.mock('../../services/supabase', () => ({
  authService: {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  profileService: {
    getProfile: vi.fn(),
    createProfile: vi.fn(),
    updateProfile: vi.fn(),
  },
}))

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('registro de usuario', () => {
    it('debe registrar un usuario exitosamente', async () => {
      const { result } = renderHook(() => useAuth())

      const mockUserData = {
        email: 'test@example.com',
        password: 'password123',
        business_name: 'Test Business',
      }

      vi.mocked(import('../../services/supabase').authService.signUp).mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      })

      await waitFor(async () => {
        const { data, error } = await result.current.signUp(
          mockUserData.email,
          mockUserData.password,
          mockUserData
        )

        expect(error).toBeNull()
        expect(data.user).toBeDefined()
      })
    })

    it('debe manejar errores de registro', async () => {
      const { result } = renderHook(() => useAuth())

      vi.mocked(import('../../services/supabase').authService.signUp).mockResolvedValue({
        data: null,
        error: { message: 'Email already exists' },
      })

      await waitFor(async () => {
        const { data, error } = await result.current.signUp(
          'existing@example.com',
          'password123',
          {}
        )

        expect(data).toBeNull()
        expect(error.message).toBe('Email already exists')
      })
    })
  })

  describe('inicio de sesión', () => {
    it('debe iniciar sesión correctamente', async () => {
      const { result } = renderHook(() => useAuth())

      vi.mocked(import('../../services/supabase').authService.signIn).mockResolvedValue({
        data: { session: { user: { id: '123' } } },
        error: null,
      })

      await waitFor(async () => {
        const { data, error } = await result.current.signIn('test@example.com', 'password123')

        expect(error).toBeNull()
        expect(data.session).toBeDefined()
      })
    })
  })

  describe('cierre de sesión', () => {
    it('debe cerrar sesión correctamente', async () => {
      const { result } = renderHook(() => useAuth())

      vi.mocked(import('../../services/supabase').authService.signOut).mockResolvedValue({
        error: null,
      })

      await waitFor(async () => {
        const { error } = await result.current.signOut()
        expect(error).toBeNull()
      })
    })
  })
})
