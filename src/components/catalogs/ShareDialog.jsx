import { useState, useEffect } from 'react'
import { Modal, Button, Input } from '../common'
import { Check, Copy, Link as LinkIcon, Mail, MessageCircle, Send, AlertCircle } from 'lucide-react'
import {
  sendCatalogEmail as sendGmailCatalogEmail,
  isGmailConnected,
  checkGmailConfig,
} from '../../services/gmailService'
import { sendCatalogEmail as sendEmailJsEmail, checkEmailConfig } from '../../services/emailJsService'

const ShareDialog = ({ catalog, shareUrl, onClose }) => {
  const [copied, setCopied] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [sending, setSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [gmailConfig, setGmailConfig] = useState(null)
  const [emailJsConfig, setEmailJsConfig] = useState(null)

  // Verificar configuración al montar
  useEffect(() => {
    const gConfig = checkGmailConfig()
    const eConfig = checkEmailConfig()
    setGmailConfig(gConfig)
    setEmailJsConfig(eConfig)
  }, [])

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

  const handleSendEmail = async () => {
    if (!email.trim()) return

    setSending(true)
    try {
      const catalogData = {
        name: catalog.name,
        description: catalog.description,
        share_url: shareUrl,
        products: catalog.catalog_products?.map(cp => cp.products) || [],
      }

      let result
      let method = ''

      // Prioridad: Gmail > EmailJS > mailto fallback
      if (isGmailConnected()) {
        // Usar Gmail API
        result = await sendGmailCatalogEmail(catalogData, email, recipientName || 'Cliente')
        method = 'gmail'
      } else if (emailJsConfig?.configured) {
        // Usar EmailJS
        result = await sendEmailJsEmail(catalogData, email, recipientName || 'Cliente')
        method = 'emailjs'
      } else {
        // Fallback a mailto
        const subject = `Catálogo: ${catalog.name}`
        const productsList = catalogData.products
          ?.map((p, i) => {
            const price = new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP',
            }).format(p.selling_price || 0)

            return `${i + 1}. ${p.name} - ${price}${p.stock_quantity ? ` (Stock: ${p.stock_quantity})` : ''}`
          })
          .join('\n') || 'No hay productos disponibles.'

        const body = `Hola ${recipientName || 'Cliente'},

Te comparto nuestro catálogo "${catalog.name}".

${catalog.description || ''}

Productos:
${productsList}

Puedes ver el catálogo completo aquí:
${shareUrl}

¡Saludos!`

        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.open(mailtoLink, '_blank')

        result = { success: true, method: 'mailto' }
        method = 'mailto'
      }

      if (result.success) {
        setEmailSent(true)

        // Si usó el método fallback (mailto), dar más tiempo
        const timeout = method === 'mailto' ? 4000 : 3000
        setTimeout(() => {
          setEmailSent(false)
          setShowEmailForm(false)
          setEmail('')
          setRecipientName('')
        }, timeout)
      } else {
        alert('Error al enviar el email: ' + (result.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error sending email:', error)

      // Si es error de Gmail, intentar con EmailJS como fallback
      if (error.message?.includes('Gmail') || error.message?.includes('not connected')) {
        try {
          const catalogData = {
            name: catalog.name,
            description: catalog.description,
            share_url: shareUrl,
            products: catalog.catalog_products?.map(cp => cp.products) || [],
          }

          const result = await sendEmailJsEmail(catalogData, email, recipientName || 'Cliente')

          if (result.success) {
            setEmailSent(true)
            setTimeout(() => {
              setEmailSent(false)
              setShowEmailForm(false)
              setEmail('')
              setRecipientName('')
            }, 3000)
            return
          }
        } catch (e) {
          console.error('EmailJS fallback also failed:', e)
        }
      }

      alert('Error al enviar el email. Intente nuevamente.')
    } finally {
      setSending(false)
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Compartir Catálogo" size="md">
      <div className="space-y-6">
        {/* Preview */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-neo">
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
            } rounded-neo flex items-center justify-center`}
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
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-neo">
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
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-neo transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">WhatsApp</span>
            </button>
            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-neo transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="font-medium">Enviar Email</span>
            </button>
          </div>
        </div>

        {/* Email form */}
        {showEmailForm && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-neo space-y-3">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Enviar catálogo por email</h4>

            {emailSent ? (
              <div className="p-3 bg-success-100 dark:bg-success-900/30 border border-success-300 dark:border-success-700 rounded-neo text-success-700 dark:text-success-300 text-center">
                ✅ Email enviado a {email}
              </div>
            ) : (
              <>
                {/* Estado de configuración */}
                {(gmailConfig?.connected || emailJsConfig?.configured) && (
                  <div className="p-3 bg-success-50 dark:bg-success-900/20 border border-success-300 dark:border-success-700 rounded-neo text-success-700 dark:text-success-300 text-sm flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <div>
                      {gmailConfig?.connected && <p className="font-medium">📧 Enviando desde Gmail</p>}
                      {!gmailConfig?.connected && emailJsConfig?.configured && <p className="font-medium">Enviando con EmailJS</p>}
                    </div>
                  </div>
                )}

                {!gmailConfig?.connected && !emailJsConfig?.configured && (
                  <div className="p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-300 dark:border-warning-700 rounded-neo text-warning-700 dark:text-warning-300 text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Conecta tu Gmail para envío directo</p>
                      <p className="text-xs mt-1">
                        Ve a Settings &gt; Gmail para conectar tu cuenta. O usaremos tu cliente de correo.
                      </p>
                    </div>
                  </div>
                )}

                <Input
                  type="email"
                  label="Email del destinatario"
                  placeholder="cliente@ejemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  icon={Mail}
                  required
                />

                <Input
                  type="text"
                  label="Nombre del destinatario (opcional)"
                  placeholder="Juan Pérez"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                />

                <div className="flex gap-2">
                  <Button
                    onClick={handleSendEmail}
                    disabled={!email.trim() || sending}
                    loading={sending}
                    className="flex-1"
                    icon={Send}
                  >
                    {sending ? 'Enviando...' : 'Enviar'}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowEmailForm(false)
                      setEmail('')
                      setRecipientName('')
                    }}
                    variant="ghost"
                    disabled={sending}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-neo">
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
