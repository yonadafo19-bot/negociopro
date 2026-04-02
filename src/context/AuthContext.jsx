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
  // ✅ CAMBIAR: Iniciar en true hasta verificar el estado de auth
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('🔐 Auth init')

    // ✅ BIEN: Timeout de seguridad - SIEMPRE liberar loading
    const forceTimeout = setTimeout(() => {
      console.log('⏰ Timeout - forzando loading=false')
      setLoading(false)
    }, 5000)

    const authData = authService.onAuthStateChange(async (_event, session) => {
      console.log('🔄 Auth change:', session?.user?.email || 'no session')
      clearTimeout(forceTimeout)

      setUser(session?.user ?? null)

      if (session?.user) {
        // ✅ BIEN: Fetch profile SIN bloquear
        profileService
          .getProfile(session.user.id)
          .then(({ data }) => {
            if (data) {
              setProfile(data)
            } else {
              // Si no existe el perfil, crear uno básico en el estado
              console.warn('Profile not found, creating temporary one')
              setProfile({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Usuario',
                business_name: session.user.user_metadata?.business_name || 'Mi Negocio',
                plan_tier: 'free',
                avatar_url: session.user.user_metadata?.avatar_url || null
              })
            }
          })
          .catch(err => {
            console.error('Error fetching profile:', err)
            // Crear perfil básico en el estado si hay error
            setProfile({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Usuario',
              business_name: session.user.user_metadata?.business_name || 'Mi Negocio',
              plan_tier: 'free',
              avatar_url: session.user.user_metadata?.avatar_url || null
            })
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setProfile(null)
        setLoading(false)
      }

      setError(null)
    })

    return () => {
      clearTimeout(forceTimeout)
      if (authData?.subscription) {
        authData.subscription.unsubscribe()
      }
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

  const signInWithGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await authService.signInWithGoogle()
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
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
