import { useState, useEffect } from 'react'
import { useConnection } from '../context/ConnectionContext'
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/common'
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  Clock,
  Trash2,
  Database,
  AlertCircle,
} from 'lucide-react'

const SyncSettingsPage = () => {
  const {
    isOnline,
    isSyncing,
    pendingSync,
    lastSyncTime,
    manualSync,
    clearPending,
  } = useConnection()

  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(null)
  const [syncLog, setSyncLog] = useState([])

  const handleSync = async () => {
    try {
      setSyncing(true)
      setError(null)
      addLog('Iniciando sincronización...')
      await manualSync()
      addLog('✅ Sincronización completada')
    } catch (err) {
      setError(err.message)
      addLog(`❌ Error: ${err.message}`)
    } finally {
      setSyncing(false)
    }
  }

  const handleClear = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los cambios pendientes? Esta acción no se puede deshacer.')) {
      try {
        await clearPending()
        addLog('🗑️ Cola de sincronización limpiada')
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString()
    setSyncLog((prev) => [{ timestamp, message }, ...prev].slice(0, 20))
  }

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Nunca'
    const now = new Date()
    const diff = now - lastSyncTime
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Hace un momento'
    if (minutes < 60) return `Hace ${minutes} minuto${minutes === 1 ? '' : 's'}`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `Hace ${hours} hora${hours === 1 ? '' : 's'}`
    const days = Math.floor(hours / 24)
    return `Hace ${days} día${days === 1 ? '' : 's'}`
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sincronización
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configura y monitorea la sincronización de datos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Conexión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-6 rounded-kawaii flex items-center gap-4 ${
              isOnline ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
            }`}>
              {isOnline ? (
                <Wifi className="h-12 w-12 text-green-600 dark:text-green-400" />
              ) : (
                <WifiOff className="h-12 w-12 text-red-600 dark:text-red-400" />
              )}
              <div>
                <p className={`text-lg font-semibold ${
                  isOnline ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {isOnline ? 'Conectado' : 'Sin conexión'}
                </p>
                <p className={`text-sm ${
                  isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {isOnline
                    ? 'Tu aplicación está sincronizada'
                    : 'Los cambios se guardarán localmente'}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-kawaii">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Última sincronización:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatLastSync()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Cola de Sincronización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-kawaii mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Cambios pendientes
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {pendingSync}
                  </p>
                </div>
                {pendingSync > 0 ? (
                  <Clock className="h-12 w-12 text-yellow-500" />
                ) : (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                )}
              </div>
            </div>

            {pendingSync > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-kawaii mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Tienes cambios sin sincronizar
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                      Estos cambios se sincronizarán automáticamente cuando tengas conexión.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                onClick={handleSync}
                disabled={!isOnline || syncing || isSyncing || pendingSync === 0}
                loading={syncing || isSyncing}
                className="flex-1"
                icon={RefreshCw}
              >
                Sincronizar Ahora
              </Button>
              {pendingSync > 0 && (
                <Button
                  variant="danger"
                  onClick={handleClear}
                  icon={Trash2}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sync Log */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Registro de Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            {syncLog.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No hay actividad reciente</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {syncLog.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-kawaii text-sm"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-500 font-mono flex-shrink-0">
                      {log.timestamp}
                    </span>
                    <span className="text-gray-900 dark:text-white">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>¿Cómo funciona la sincronización?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-kawaii">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Funciona Offline
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Puedes registrar ventas, actualizar productos y más sin conexión.
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-kawaii">
                <div className="text-2xl mb-2">💾</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Guardado Local
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Los cambios se guardan en tu dispositivo hasta sincronizar.
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-kawaii">
                <div className="text-2xl mb-2">🔄</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Auto Sync
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Al reconectar, todo se sincroniza automáticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SyncSettingsPage
