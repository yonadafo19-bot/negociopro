import { useState } from 'react'
import { Modal, Button } from '../common'
import { Check, Copy, Link as LinkIcon, Mail, MessageCircle } from 'lucide-react'

const ShareDialog = ({ catalog, shareUrl, onClose }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error copying to clipboard:', err)
    }
  }

  const shareToWhatsApp = () => {
    const text = `¡Mira mi catálogo "${catalog.name}"! ${shareUrl}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const shareToEmail = () => {
    const subject = `Catálogo: ${catalog.name}`
    const body = `¡Hola!\n\nTe comparto mi catálogo "${catalog.name}".\n\nPuedes verlo aquí: ${shareUrl}`
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(url, '_blank')
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Compartir Catálogo" size="md">
      <div className="space-y-6">
        {/* Preview */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-kawaii">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${
              catalog.theme === 'blue'
                ? 'from-blue-500 to-blue-600'
                : catalog.theme === 'green'
                  ? 'from-green-500 to-green-600'
                  : catalog.theme === 'purple'
                    ? 'from-purple-500 to-purple-600'
                    : catalog.theme === 'orange'
                      ? 'from-orange-500 to-orange-600'
                      : 'from-primary-500 to-primary-600'
            } rounded-kawaii flex items-center justify-center`}
          >
            <span className="text-2xl">📚</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{catalog.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {catalog.catalog_products?.length || 0} productos
            </p>
          </div>
        </div>

        {/* Share URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enlace del Catálogo
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-kawaii">
              <LinkIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white outline-none truncate"
              />
            </div>
            <Button
              onClick={handleCopy}
              variant={copied ? 'success' : 'secondary'}
              icon={copied ? Check : Copy}
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </Button>
          </div>
        </div>

        {/* Share options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Compartir por
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareToWhatsApp}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-kawaii transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">WhatsApp</span>
            </button>
            <button
              onClick={shareToEmail}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-kawaii transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="font-medium">Email</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-kawaii">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>Tip:</strong> Cualquier persona con este enlace podrá ver tu catálogo.
            {catalog.is_public
              ? ''
              : ' Asegúrate de marcarlo como público para permitir el acceso.'}
          </p>
        </div>
      </div>

      {/* Close */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button onClick={onClose} className="w-full">
          Cerrar
        </Button>
      </div>
    </Modal>
  )
}

export default ShareDialog
