import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button, Input, Card } from '../../components/common'
import { UserPlus, Mail, Lock, Building, AlertCircle } from 'lucide-react'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { signUp, loading } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    fullName: '',
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'El correo es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo inválido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (!formData.businessName) {
      newErrors.businessName = 'El nombre del negocio es requerido'
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Tu nombre es requerido'
    }

    return newErrors
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})

    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      business_name: formData.businessName,
    })

    if (error) {
      setErrors({ general: error.message })
    } else {
      // Redirect to email verification page
      navigate('/app/dashboard')
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 card-neo-lg mb-6">
            <UserPlus className="h-10 w-10 text-accent-500 dark:text-accent-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3 gradient-text">
            Únete a NegociPro
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Comienza a gestionar tu negocio hoy mismo
          </p>
        </div>

        {/* Main card */}
        <Card padding="lg" variant="lg">
          {errors.general && (
            <div className="mb-6 p-4 rounded-neo bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-danger-500 dark:text-danger-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger-700 dark:text-danger-300">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nombre completo"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              icon={UserPlus}
              placeholder="Juan Pérez"
              required
            />

            <Input
              label="Nombre del negocio"
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              error={errors.businessName}
              icon={Building}
              placeholder="Mi Tienda"
              required
            />

            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              placeholder="tu@correo.com"
              autoComplete="email"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              required
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={Lock}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />

            <Button type="submit" className="w-full" loading={loading} icon={UserPlus}>
              Crear Cuenta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-semibold transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
          Al registrarte, aceptas nuestros{' '}
          <Link to="/terms" className="text-primary-500 dark:text-primary-400 hover:underline">
            términos de servicio
          </Link>{' '}
          y{' '}
          <Link to="/privacy" className="text-primary-500 dark:text-primary-400 hover:underline">
            política de privacidad
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
