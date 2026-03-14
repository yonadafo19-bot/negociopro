import { useAuth as useAuthContext } from '../context/AuthContext'

/**
 * Hook personalizado para autenticación
 * Simplifica el acceso al AuthContext
 *
 * @example
 * const { user, profile, signIn, signOut, loading } = useAuth()
 */
export const useAuth = () => {
  const authContext = useAuthContext()

  // Verificar que el contexto existe
  if (!authContext) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return {
    // Estado
    user: authContext.user,
    profile: authContext.profile,
    loading: authContext.loading,
    error: authContext.error,

    // Helpers
    isAuthenticated: !!authContext.user,
    businessName: authContext.profile?.business_name || 'Mi Negocio',
    userEmail: authContext.user?.email || '',
    userFullName: authContext.profile?.full_name || 'Usuario',

    // Métodos
    signIn: authContext.signIn,
    signUp: authContext.signUp,
    signOut: authContext.signOut,
    resetPassword: authContext.resetPassword,
    updateProfile: authContext.updateProfile,
  }
}

export default useAuth
