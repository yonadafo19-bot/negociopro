import { useConnection } from '../../context/ConnectionContext'
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '../common'
import { useState } from 'react'

const ConnectionStatus = () => {
  const { isOnline, isSyncing, pendingSync, lastSyncTime, manualSync } = useConnection()
  const [syncError, setSyncError] = useState(null)

  const handleManualSync = async () => {
    try {
      setSyncError(null)
      await manualSync()
    } catch (error) {
      setSyncError(error.message)
      setTimeout(() => setSyncError(null), 5000)
    }
  }

  if (isOnline && pendingSync === 0 && !isSyncing) {
    return null // Hide when everything is synced
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-sm transition-all ${
      !isOnline ? 'animate-pulse' : ''
    }`}>
      <div className={`rounded-lg shadow-lg p-4 ${
        !isOnline
          ? 'bg-red-500 text-white'
          : pendingSync > 0
          ? 'bg-yellow-500 text-white'
          : 'bg-green-500 text-white'
      }`}>
        {/* Status */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {!isOnline ? (
              <WifiOff className="h-5 w-5" />
            ) : isSyncing ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Wifi className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <p className="font-semibold text-sm">
              {!isOnline
                ? 'Sin conexión'
                : isSyncing
                ? 'Sincronizando...'
                : pendingSync > 0
                ? 'Cambios pendientes'
                : 'Sincronizado'}
            </p>

            {/* Message */}
            <p className="text-xs mt-1 opacity-90">
              {!isOnline
                ? 'No hay conexión a internet. Los cambios se guardarán localmente.'
                : pendingSync > 0
                ? `${pendingSync} cambio${pendingSync === 1 ? '' : 's'} pendiente${pendingSync === 1 ? '' : 's'} de sincronización.`
                : lastSyncTime
                ? `Sincronizado ${lastSyncTime.toLocaleTimeString()}`
                : 'Todo está actualizado'}
            </p>

            {/* Error message */}
            {syncError && (
              <div className="flex items-start gap-2 mt-2 text-xs bg-white/20 rounded px-2 py-1">
                <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <span>{syncError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {!isOnline ? (
          <div className="mt-3 text-xs opacity-90">
            Se sincronizará automáticamente cuando se restablezca la conexión
          </div>
        ) : pendingSync > 0 && !isSyncing ? (
          <Button
            size="sm"
            variant="white"
            className="w-full mt-3"
            onClick={handleManualSync}
            icon={RefreshCw}
          >
            Sincronizar Ahora
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default ConnectionStatus
