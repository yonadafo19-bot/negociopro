/**
 * Servicio de Gmail API para enviar emails usando la cuenta de Google del usuario
 *
 * INSTRUCCIONES DE CONFIGURACIÓN:
 *
 * 1. Crear proyecto en Google Cloud Console: https://console.cloud.google.com/
 * 2. Habilitar Gmail API
 * 3. Crear credenciales OAuth 2.0:
 *    - Tipo: Aplicación web
 *    - Orígenes JavaScript autorizados: http://localhost:3000, http://localhost:3001, http://localhost:3002, tu-dominio.com
 *    - URIs de redirección autorizadas: Agregar la URL de tu app
 * 4. Copiar CLIENT_ID
 * 5. Configurar en .env
 */

/**
 * Estado de autenticación de Gmail
 */
let gmailClient = null
let accessToken = null
let tokenExpiry = null

// Configuración
const GMAIL_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || '',
  SCOPES: [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
  ],
  DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
}

/**
 * Cargar Google Identity Services
 */
const loadGapiScript = () => {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

/**
 * Cargar Google Identity Services
 */
const loadGisScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

/**
 * Inicializar Google API
 */
const initializeGmail = async () => {
  try {
    await loadGapiScript()
    await loadGisScript()

    if (!GMAIL_CONFIG.CLIENT_ID) {
      console.warn('Google Client ID not configured')
      return false
    }

    await new Promise((resolve, reject) => {
      window.gapi.load('client', {
        callback: async () => {
          try {
            await window.gapi.client.init({
              apiKey: GMAIL_CONFIG.API_KEY,
              discoveryDocs: [GMAIL_CONFIG.DISCOVERY_DOC],
            })
            resolve()
          } catch (error) {
            reject(error)
          }
        },
        onerror: reject,
      })
    })

    return true
  } catch (error) {
    console.error('Error initializing Gmail:', error)
    return false
  }
}

/**
 * Verificar si Gmail está configurado
 */
export const isGmailConfigured = () => {
  return !!GMAIL_CONFIG.CLIENT_ID
}

/**
 * Conectar cuenta de Gmail (OAuth)
 */
export const connectGmail = async () => {
  try {
    if (!isGmailConfigured()) {
      throw new Error('Google Client ID not configured')
    }

    await initializeGmail()

    return new Promise((resolve, reject) => {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GMAIL_CONFIG.CLIENT_ID,
        scope: GMAIL_CONFIG.SCOPES.join(' '),
        callback: response => {
          if (response.error) {
            reject(new Error(response.error))
            return
          }

          accessToken = response.access_token
          // Calcular expiry (default es 1 hora)
          tokenExpiry = Date.now() + response.expires_in * 1000

          gmailClient = window.gapi.client.gmail

          resolve({
            success: true,
            accessToken,
            expiresIn: response.expires_in,
          })
        },
        error_callback: error => {
          reject(error)
        },
      })

      tokenClient.requestAccessToken({ prompt: 'consent' })
    })
  } catch (error) {
    console.error('Error connecting Gmail:', error)
    throw error
  }
}

/**
 * Desconectar cuenta de Gmail
 */
export const disconnectGmail = async () => {
  try {
    if (window.google && window.google.accounts) {
      window.google.accounts.oauth2.revoke(accessToken)
    }

    accessToken = null
    gmailClient = null
    tokenExpiry = null

    return { success: true }
  } catch (error) {
    console.error('Error disconnecting Gmail:', error)
    throw error
  }
}

/**
 * Verificar si hay una sesión activa
 */
export const isGmailConnected = () => {
  return !!accessToken && !!gmailClient && tokenExpiry > Date.now()
}

/**
 * Obtener información del usuario conectado
 */
export const getGmailUserInfo = async () => {
  try {
    if (!isGmailConnected()) {
      throw new Error('Gmail not connected')
    }

    const response = await gmailClient.users.getProfile({ userId: 'me' })
    return {
      success: true,
      email: response.result.emailAddress,
      messagesTotal: response.result.messagesTotal,
      threadsTotal: response.result.threadsTotal,
    }
  } catch (error) {
    console.error('Error getting Gmail user info:', error)
    throw error
  }
}

/**
 * Codificar email para Gmail API
 */
const encodeEmail = (email) => {
  // Codificar en base64 URL-safe
  return btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Crear email en formato RFC 5322
 */
const createEmail = (to, subject, body, from = null) => {
  const emailLines = [
    from ? `From: ${from}` : '',
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    body,
  ]

  return emailLines.filter(line => line !== '').join('\r\n')
}

/**
 * Enviar email usando Gmail API
 */
export const sendEmail = async ({ to, subject, body, from = null }) => {
  try {
    if (!isGmailConnected()) {
      throw new Error('Gmail not connected. Please connect your Gmail account.')
    }

    // Verificar si el token expiró
    if (tokenExpiry && tokenExpiry <= Date.now()) {
      throw new Error('Access token expired. Please reconnect your Gmail account.')
    }

    // Crear email
    const rawEmail = createEmail(to, subject, body, from)
    const encodedEmail = encodeEmail(rawEmail)

    // Enviar usando Gmail API
    const response = await gmailClient.users.messages.send({
      userId: 'me',
      resource: {
        raw: encodedEmail,
      },
    })

    return {
      success: true,
      messageId: response.result.id,
      labelIds: response.result.labelIds,
    }
  } catch (error) {
    console.error('Error sending email:', error)

    // Si es error de token, intentar reconectar
    if (error.status === 401) {
      throw new Error('Token expired. Please reconnect your Gmail account.')
    }

    throw error
  }
}

/**
 * Enviar catálogo por email
 */
export const sendCatalogEmail = async (catalogData, recipientEmail, recipientName = 'Cliente') => {
  try {
    const { name, description, share_url, products } = catalogData

    // Formatear lista de productos
    const productsList = products
      ?.map((p, i) => {
        const price = new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        }).format(p.selling_price || 0)

        return `${i + 1}. ${p.name} - ${price}${p.stock_quantity ? ` (Stock: ${p.stock_quantity})` : ''}`
      })
      .join('\n') || 'No hay productos disponibles.'

    // Crear cuerpo del email
    const body = `Hola ${recipientName},

Te comparto nuestro catálogo "${name}".

${description || ''}

Productos:
${productsList}

Puedes ver el catálogo completo aquí:
${share_url}

¡Saludos!`

    // Enviar email
    return await sendEmail({
      to: recipientEmail,
      subject: `Catálogo: ${name}`,
      body,
    })
  } catch (error) {
    console.error('Error sending catalog email:', error)
    throw error
  }
}

/**
 * Enviar recibo de venta por email
 */
export const sendSaleReceiptEmail = async (saleData, customerEmail) => {
  try {
    const { transaction, items } = saleData

    const formatCurrency = amount =>
      new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      }).format(amount || 0)

    // Crear cuerpo del email
    let body = `RECIBO DE VENTA
================================

Fecha: ${new Date(transaction.transaction_date).toLocaleDateString('es-CL')}
Recibo #: ${transaction.id?.substring(0, 8).toUpperCase()}

DETALLE DE COMPRA:
----------------------------------------

`

    items.forEach((item, i) => {
      body += `${i + 1}. ${item.product_name || item.name}
   Cantidad: ${item.quantity}
   Precio unitario: ${formatCurrency(item.unit_price)}
   Subtotal: ${formatCurrency(item.subtotal || item.quantity * item.unit_price)}

`
    })

    body += `================================
RESUMEN:
----------------------------------------

Subtotal: ${formatCurrency(transaction.subtotal || 0)}
IVA: ${formatCurrency(transaction.tax_amount || 0)}
Total: ${formatCurrency(transaction.total_amount)}

Método de pago: ${
      transaction.payment_method === 'cash'
        ? 'Efectivo'
        : transaction.payment_method === 'card'
          ? 'Tarjeta'
          : 'Transferencia'
    }

${transaction.notes ? `Notas: ${transaction.notes}` : ''}

---
¡Gracias por su compra!
`

    // Enviar email
    return await sendEmail({
      to: customerEmail,
      subject: `Recibo de Venta #${transaction.id?.substring(0, 8)}`,
      body,
    })
  } catch (error) {
    console.error('Error sending sale receipt email:', error)
    throw error
  }
}

/**
 * Verificar configuración
 */
export const checkGmailConfig = () => {
  return {
    configured: isGmailConfigured(),
    connected: isGmailConnected(),
    hasClientId: !!GMAIL_CONFIG.CLIENT_ID,
    hasApiKey: !!GMAIL_CONFIG.API_KEY,
    config: {
      clientId: GMAIL_CONFIG.CLIENT_ID ? `${GMAIL_CONFIG.CLIENT_ID.substring(0, 20)}...` : 'Not set',
    },
  }
}

export default {
  initializeGmail,
  connectGmail,
  disconnectGmail,
  isGmailConnected,
  isGmailConfigured,
  getGmailUserInfo,
  sendEmail,
  sendCatalogEmail,
  sendSaleReceiptEmail,
  checkGmailConfig,
}
