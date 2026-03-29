import { createContext, useContext, useState, useEffect } from 'react'
import { authService, profileService } from '../services/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  // ✅ BIEN: Iniciar en false, NO true
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('🔐 Auth init')

    // ✅ BIEN: Timeout de seguridad - SIEMPRE liberar loading
    const forceTimeout = setTimeout(() => {
      console.log('⏰ Timeout - forzando loading=false')
      setLoading(false)
    }, 3000)

    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (_event, session) => {
      console.log('🔄 Auth change:', session?.user?.email || 'no session')
      clearTimeout(forceTimeout)

      setUser(session?.user ?? null)

      if (session?.user) {
        // ✅ BIEN: Fetch profile SIN bloquear
        profileService
          .getProfile(session.user.id)
          .then(({ data }) => {
            if (data) setProfile(data)
          })
          .catch(err => {
            console.error('Error fetching profile:', err)
            // ✅ BIEN: No bloquear si hay error en profile
          })
      } else {
        setProfile(null)
      }

      setLoading(false)
      setError(null)
    })

    return () => {
      clearTimeout(forceTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, userData) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await authService.signUp(email, password, userData)
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await authService.signIn(email, password)
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await authService.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async email => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await authService.resetPassword(email)
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async updates => {
    if (!user) return { data: null, error: new Error('No user logged in') }

    setLoading(true)
    setError(null)
    try {
      const { data, error } = await profileService.updateProfile(user.id, updates)
      if (error) throw error
      setProfile(data)
      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
