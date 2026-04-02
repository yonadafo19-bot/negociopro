import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button, Input, Card } from '../../components/common'
import { KeyRound, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

const ForgotPasswordPage = () => {
  const { resetPassword, loading } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor ingresa un correo válido')
      return
    }

    setError('')

    const { error: resetError } = await resetPassword(email)

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
        <Card className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-neo-lg mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Correo enviado!</h1>
          <p className="text-gray-600 mb-6">
            Hemos enviado las instrucciones para restablecer tu contraseña a{' '}
            <strong>{email}</strong>
          </p>
          <Button onClick={() => (window.location.href = '/login')} className="w-full">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-500 rounded-neo-lg mb-4">
            <KeyRound className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¿Olvidaste tu contraseña?</h1>
          <p className="text-gray-600">Te enviaremos instrucciones para restablecerla</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-neo flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              setError('')
            }}
            error={error}
            icon={Mail}
            placeholder="tu@correo.com"
            required
          />

          <Button type="submit" className="w-full" loading={loading} icon={Mail}>
            Enviar Instrucciones
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al inicio de sesión
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage
