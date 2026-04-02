import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../context/ThemeContext'
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
  ImageUpload,
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
  Moon,
  Sun,
  LogOut,
  Loader2,
} from 'lucide-react'
import ColorSelector from '../components/settings/ColorSelector'
import GmailConfig from '../components/settings/GmailConfig'

const SettingsPage = () => {
  const { profile, user, updateProfile, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

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

  if (!profile || !user) {
    return <PageLoader text="Cargando configuración..." />
  }

  const handleProfileUpdate = async e => {
    e.preventDefault()
    setErrors({})
    setMessage({ type: '', text: '' })

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

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  const handleAvatarUpload = async (avatarUrl) => {
    setUploadingAvatar(true)
    setMessage({ type: '', text: '' })

    const { error } = await updateProfile({ avatar_url: avatarUrl })

    setUploadingAvatar(false)
    setShowAvatarModal(false)

    if (error) {
      setMessage({ type: 'error', text: 'Error al actualizar la foto de perfil' })
    } else {
      setMessage({ type: 'success', text: 'Foto de perfil actualizada correctamente' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const handleAvatarRemove = async () => {
    setUploadingAvatar(true)
    setMessage({ type: '', text: '' })

    const { error } = await updateProfile({ avatar_url: null })

    setUploadingAvatar(false)
    setShowAvatarModal(false)

    if (error) {
      setMessage({ type: 'error', text: 'Error al eliminar la foto de perfil' })
    } else {
      setMessage({ type: 'success', text: 'Foto de perfil eliminada' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Configuración
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Personaliza tu experiencia
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-neo flex items-start gap-3 ${
          message.type === 'success'
            ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800'
            : message.type === 'error'
              ? 'bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Profile Card */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <User className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            Información del Perfil
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Avatar section */}
            <div className="flex items-center gap-6 p-6 card-neo-inset">
              <div className="w-24 h-24 rounded-neo-lg bg-gradient-to-br from-accent-500 to-accent-600 shadow-neo-accent dark:shadow-neo-accent-dark flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile?.full_name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  {profile?.full_name || 'Usuario'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{user?.email}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAvatarModal(true)}
                  icon={Camera}
                >
                  Cambiar foto
                </Button>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="+56 9 1234 5678"
                className="md:col-span-2"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" icon={CheckCircle}>
                Guardar Cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Appearance Card */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
            🎨 Apariencia
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 card-neo-sm">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-neo ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  {isDark ? <Moon className="h-5 w-5 text-yellow-400" /> : <Sun className="h-5 w-5 text-orange-500" />}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">Tema</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isDark ? 'Modo oscuro' : 'Modo claro'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="btn-neo"
              >
                Cambiar
              </button>
            </div>

            {/* Color Palette Section */}
            <div className="pt-4">
              <ColorSelector />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gmail Configuration */}
      <GmailConfig />

      {/* Security Card */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <KeyRound className="h-5 w-5 text-warning-500 dark:text-warning-400" />
            Seguridad
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 card-neo-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-neo bg-warning-100 dark:bg-warning-900/30">
                  <KeyRound className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">Contraseña</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Última actualización: No registrada
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(true)}
                icon={KeyRound}
              >
                Cambiar
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 card-neo-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-neo bg-success-100 dark:bg-success-900/30">
                  <Mail className="h-5 w-5 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">Correo electrónico</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              <Badge variant="success" icon={CheckCircle}>
                Verificado
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-100">Información de la Cuenta</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 card-neo-sm">
              <div className="flex items-center gap-4">
                <Building className="h-5 w-5 text-primary-500 dark:text-primary-400" />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">Plan</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Plan Gratuito</p>
                </div>
              </div>
              <Badge variant="primary">Free</Badge>
            </div>

            <div className="flex items-center justify-between p-4 card-neo-sm">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-accent-500 dark:text-accent-400" />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">Miembro desde</h4>
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
      <Card padding="lg" className="border-2 border-danger-300 dark:border-danger-700">
        <CardHeader>
          <CardTitle className="text-danger-600 dark:text-danger-400">Zona de Peligro</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-neo bg-danger-50 dark:bg-danger-900/20">
            <div>
              <h4 className="font-semibold text-danger-900 dark:text-danger-400">Cerrar Sesión</h4>
              <p className="text-sm text-danger-700 dark:text-danger-500">Salir de tu cuenta actual</p>
            </div>
            <Button
              variant="danger"
              onClick={handleSignOut}
              icon={LogOut}
            >
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
        size="md"
      >
        <div className="space-y-4">
          <ImageUpload
            imageUrl={profile?.avatar_url}
            onUpload={handleAvatarUpload}
            onRemove={handleAvatarRemove}
            bucket="avatars"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAvatarModal(false)}
              disabled={uploadingAvatar}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Cambiar Contraseña"
        size="sm"
      >
        <form onSubmit={async (e) => {
          e.preventDefault()
          // TODO: Implementar cambio de contraseña
          setShowPasswordModal(false)
        }} className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Funcionalidad de cambio de contraseña próximamente
          </p>

          <div className="flex gap-3 pt-4">
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
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default SettingsPage
