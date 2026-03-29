import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Modal,
  Badge,
  PageLoader,
} from '../components/common'
import {
  User,
  Mail,
  Building,
  Phone,
  Camera,
  KeyRound,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

const SettingsPage = () => {
  const { profile, user, updateProfile, signOut } = useAuth()
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    business_name: profile?.business_name || '',
    phone: profile?.phone || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})

  // Mostrar PageLoader si no hay perfil cargado
  if (!profile || !user) {
    return <PageLoader text="Cargando configuración..." />
  }

  const handleProfileUpdate = async e => {
    e.preventDefault()
    setErrors({})
    setMessage({ type: '', text: '' })

    // Validaciones
    const newErrors = {}
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'El nombre es requerido'
    }
    if (!formData.business_name.trim()) {
      newErrors.business_name = 'El nombre del negocio es requerido'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const { error } = await updateProfile(formData)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const handlePasswordChange = async e => {
    e.preventDefault()
    setErrors({})
    setMessage({ type: '', text: '' })

    // Validaciones
    const newErrors = {}
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida'
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida'
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Mínimo 6 caracteres'
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Nota: Aquí necesitarías implementar la lógica de cambio de contraseña
    // Por ahora es solo un placeholder
    setMessage({
      type: 'info',
      text: 'Funcionalidad de cambio de contraseña próximamente',
    })
    setShowPasswordModal(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configuración</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Gestiona tu cuenta y preferencias</p>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 rounded-kawaii flex items-start gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : message.type === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información del Perfil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {/* Avatar section */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 bg-accent-500 rounded-kawaii-lg flex items-center justify-center text-white text-2xl font-bold">
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {profile?.full_name || 'Usuario'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAvatarModal(true)}
                  icon={Camera}
                  className="mt-2"
                >
                  Cambiar foto
                </Button>
              </div>
            </div>

            {/* Form fields */}
            <Input
              label="Nombre completo"
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              error={errors.full_name}
              icon={User}
              placeholder="Tu nombre"
            />

            <Input
              label="Nombre del negocio"
              value={formData.business_name}
              onChange={e => setFormData({ ...formData, business_name: e.target.value })}
              error={errors.business_name}
              icon={Building}
              placeholder="Mi Negocio"
            />

            <Input
              label="Teléfono"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              icon={Phone}
              placeholder="+52 55 1234 5678"
            />

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-kawaii">
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Contraseña</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Última actualización: No registrada
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowPasswordModal(true)} icon={KeyRound}>
              Cambiar
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-kawaii">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Correo electrónico</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" disabled>
              Verificado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-kawaii">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Correo electrónico</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              <Badge variant="success" icon={CheckCircle}>
                Verificado
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-kawaii">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Plan</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Plan Gratuito</p>
                </div>
              </div>
              <Badge variant="primary">Free</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-kawaii">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Miembro desde</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Hoy'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Zona de Peligro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-kawaii">
            <div>
              <h4 className="font-medium text-red-900 dark:text-red-400">Cerrar Sesión</h4>
              <p className="text-sm text-red-700 dark:text-red-500">Salir de tu cuenta actual</p>
            </div>
            <Button variant="danger" onClick={handleSignOut}>
              Cerrar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Avatar Modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Cambiar Foto de Perfil"
      >
        <div className="text-center py-4">
          <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Funcionalidad de avatar próximamente
          </p>
          <Button onClick={() => setShowAvatarModal(false)}>Cerrar</Button>
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Cambiar Contraseña"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Contraseña actual"
            type="password"
            value={passwordData.currentPassword}
            onChange={e =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
            error={errors.currentPassword}
            icon={KeyRound}
            placeholder="••••••••"
          />

          <Input
            label="Nueva contraseña"
            type="password"
            value={passwordData.newPassword}
            onChange={e =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
            error={errors.newPassword}
            icon={KeyRound}
            placeholder="Mínimo 6 caracteres"
          />

          <Input
            label="Confirmar nueva contraseña"
            type="password"
            value={passwordData.confirmPassword}
            onChange={e =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
            error={errors.confirmPassword}
            icon={KeyRound}
            placeholder="••••••••"
          />

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowPasswordModal(false)
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                })
                setErrors({})
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Cambiar Contraseña
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default SettingsPage
