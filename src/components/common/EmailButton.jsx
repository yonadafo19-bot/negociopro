import { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { emailService } from '../../services/emailService'

/**
 * Botón para enviar emails
 *
 * @example
 * <EmailButton
 *   type="sale-receipt"
 *   data={{ transaction, items }}
 *   emailAddress="cliente@email.com"
 *   onSuccess={() => console.log('Enviado')}
 * />
 */
const EmailButton = ({
  type = 'generic',
  data = {},
  emailAddress,
  subject,
  body,
  onSuccess,
  children,
  variant = 'outline',
  size = 'md',
  className = '',
  showIcon = true,
}) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleClick = async () => {
    setLoading(true)
    setMessage(null)

    try {
      let result

      switch (type) {
        case 'sale-receipt':
          result = await emailService.sendSaleReceipt(data, emailAddress)
          break

        case 'cash-closing':
          result = await emailService.sendCashClosingReport(data, emailAddress)
          break

        case 'catalog':
          result = await emailService.sendCatalog(data, emailAddress)
          break

        case 'low-stock':
          result = await emailService.sendLowStockAlert(data, emailAddress)
          break

        case 'expense-report':
          result = await emailService.sendExpenseReport(data, emailAddress)
          break

        case 'generic':
        default:
          result = await emailService.sendReport({
            to: emailAddress,
            subject,
            body,
          })
          break
      }

      if (result.success) {
        setMessage({ type: 'success', text: 'Email abierto en tu cliente de correo' })
        onSuccess?.(result)
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: result.error || 'Error al enviar email' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  const getVariant = () => {
    if (variant === 'email')
      return 'border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
    return variant
  }

  return (
    <div className="inline-block">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 border-2 rounded-kawaii font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          message?.type === 'success'
            ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            : message?.type === 'error'
              ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              : getVariant()
        } ${className}`}
        type="button"
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            Enviando...
          </>
        ) : message?.type === 'success' ? (
          <>
            <CheckCircle className="h-4 w-4" />
            {message.text}
          </>
        ) : message?.type === 'error' ? (
          <>
            <AlertCircle className="h-4 w-4" />
            {message.text}
          </>
        ) : (
          <>
            {showIcon && <Mail className="h-4 w-4" />}
            {children || 'Enviar Email'}
          </>
        )}
      </button>

      {/* Mensaje flotante */}
      {message && !children && (
        <div
          className={`mt-2 text-xs ${
            message.type === 'success'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  )
}

export default EmailButton
