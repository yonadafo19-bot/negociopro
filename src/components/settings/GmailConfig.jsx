import { useState, useEffect } from 'react'
import { Mail, CheckCircle, AlertCircle, ExternalLink, Loader2, LogOut, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../common'
import {
  connectGmail,
  disconnectGmail,
  isGmailConnected,
  isGmailConfigured,
  getGmailUserInfo,
  checkGmailConfig,
} from '../../services/gmailService'

const GmailConfig = () => {
  const [config, setConfig] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    setLoading(true)
    try {
      const configData = checkGmailConfig()
      setConfig(configData)

      if (configData.connected) {
        const info = await getGmailUserInfo()
        setUserInfo(info)
      }
    } catch (err) {
      console.error('Error loading Gmail config:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    setConnecting(true)
    setError(null)

    try {
      const result = await connectGmail()

      if (result.success) {
        const info = await getGmailUserInfo()
        setUserInfo(info)
        setConfig({ ...config, connected: true })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('¿Estás seguro de que quieres desconectar tu cuenta de Gmail?')) {
      return
    }

    try {
      await disconnectGmail()
      setUserInfo(null)
      setConfig({ ...config, connected: false })
    } catch (err) {
      console.error('Error disconnecting Gmail:', err)
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <Mail className="h-5 w-5 text-red-500 dark:text-red-400" />
            Gmail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Mail className="h-5 w-5 text-red-500 dark:text-red-400" />
          Gmail
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Estado de configuración */}
          {config?.configured ? (
            <div className={`p-4 rounded-neo border-2 ${
              config.connected
                ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-start gap-3">
                {config.connected ? (
                  <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {config.connected ? 'Gmail conectado' : 'Gmail configurado pero no conectado'}
                  </h4>
                  {config.connected && userInfo && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {userInfo.email}
                    </p>
                  )}
                </div>
                {config.connected && (
                  <Badge variant="success" icon={CheckCircle}>
                    Activo
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-warning-50 dark:bg-warning-900/20 border-2 border-warning-200 dark:border-warning-800 rounded-neo">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-warning-900 dark:text-warning-400">Gmail no configurado</h4>
                  <p className="text-sm text-warning-700 dark:text-warning-500 mt-1">
                    Sigue los pasos de abajo para configurar Gmail
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex items-center gap-3">
            {config?.connected ? (
              <>
                <Button
                  onClick={handleDisconnect}
                  variant="danger"
                  size="sm"
                  icon={LogOut}
                >
                  Desconectar
                </Button>
                <Button
                  onClick={loadConfig}
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                >
                  Actualizar
                </Button>
              </>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={!config?.configured || connecting}
                loading={connecting}
                className="w-full"
                icon={Mail}
              >
                {connecting ? 'Conectando...' : 'Conectar Gmail'}
              </Button>
            )}
          </div>

          {/* Instrucciones de configuración */}
          {!config?.configured && (
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Pasos para configurar Gmail:</h4>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Crear proyecto en Google Cloud Console
                    </p>
                    <a
                      href="https://console.cloud.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      Ir a Google Cloud Console <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Habilitar Gmail API
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      En "APIs & Services" > "Library" busca "Gmail API"
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Crear credenciales OAuth 2.0
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tipo: "Web application"
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Configurar orígenes autorizados
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Agrega: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">http://localhost:3000</code>, <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">http://localhost:3001</code>, <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">http://localhost:3002</code>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Copiar Client ID
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pégalo en tu archivo <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env</code> como <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border-2 border-danger-200 dark:border-danger-800 rounded-neo text-sm text-danger-700 dark:text-danger-300">
              {error}
            </div>
          )}

          {/* Info */}
          {config?.connected && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-neo">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>¡Gmail está conectado!</strong>
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Ahora puedes enviar catálogos, boletas y otros emails directamente desde tu cuenta de Gmail.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default GmailConfig
