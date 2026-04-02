import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button, Card } from '../../components/common'
import { Mail, CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-react'

const VerifyEmailPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const email = location.state?.email || ''

  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [countdown, setCountdown] = useState(60)

  // Redirect to dashboard if already verified
  useEffect(() => {
    if (user && !loading) {
      if (user.email_confirmed_at) {
        navigate('/app/dashboard')
      }
    }
  }, [user, loading, navigate])

  // Countdown for resend button
  useEffect(() => {
    if (resent && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && resent) {
      setResent(false)
      setCountdown(60)
    }
  }, [countdown, resent])

  const handleResend = async () => {
    setResending(true)
    try {
      const { error } = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          type: 'signup',
          email,
        }),
      }).then(r => r.json())

      if (!error) {
        setResent(true)
      }
    } catch (err) {
      console.error('Error resending email:', err)
    } finally {
      setResending(false)
    }
  }

  const handleCheckVerification = async () => {
    window.location.reload()
  }

  // If no email provided, show a message
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card variant="lg" className="w-full max-w-md text-center">
          <Mail className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            No se encontró el correo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Por favor regístrate nuevamente para recibir el correo de verificación
          </p>
          <Link to="/register">
            <Button className="w-full">Ir al Registro</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio de sesión
        </Link>

        {/* Main card */}
        <Card padding="lg" variant="lg">
          {/* Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 card-neo-lg mb-6">
              <Mail className="h-12 w-12 text-primary-500 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Verifica tu correo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Te enviamos un enlace de verificación
            </p>
          </div>

          {/* Email display */}
          <div className="card-neo-inset p-4 mb-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Correo electrónico:</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{email}</p>
          </div>

          {/* Instructions */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-neo flex items-center justify-center flex-shrink-0 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-sm">
                1
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 pt-1">
                Revisa tu bandeja de entrada (y carpeta de spam)
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-neo flex items-center justify-center flex-shrink-0 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-sm">
                2
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 pt-1">
                Haz clic en el enlace de verificación
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-neo flex items-center justify-center flex-shrink-0 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-sm">
                3
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 pt-1">
                Regresa aquí y haz clic en continuar
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleCheckVerification}
              className="w-full"
              icon={CheckCircle2}
            >
              Ya verifiqué mi correo
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={resending || resent}
              className="w-full"
              icon={RefreshCw}
            >
              {resending
                ? 'Enviando...'
                : resent
                  ? `Reenviar (${countdown}s)`
                  : 'Reenviar correo'}
            </Button>
          </div>

          {/* Help text */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-500">
            ¿No recibiste el correo? Verifica la dirección o intenta reenviar.
          </p>

          {/* Success message */}
          {resent && (
            <div className="mt-4 p-4 rounded-neo bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success-500 dark:text-success-400 flex-shrink-0" />
              <p className="text-sm text-success-700 dark:text-success-300">
                Correo reenviado exitosamente
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default VerifyEmailPage
