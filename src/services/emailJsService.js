/**
 * Servicio de Email usando EmailJS
 *
 * INSTRUCCIONES DE CONFIGURACIÓN:
 *
 * 1. Crear cuenta en https://www.emailjs.com/
 * 2. Agregar un servicio de email (Gmail, Outlook, etc.)
 * 3. Crear un template de email con las variables:
 *    - {{to_name}}: Nombre del destinatario
 *    - {{to_email}}: Email del destinatario
 *    - {{catalog_name}}: Nombre del catálogo
 *    - {{catalog_description}}: Descripción del catálogo
 *    - {{catalog_url}}: URL del catálogo
 *    - {{products_list}}: Lista de productos
 * 4. Copiar PUBLIC_KEY, SERVICE_ID, y TEMPLATE_ID
 * 5. Configurar en .env.local o Settings
 *
 * TEMPLATE SUGERIDO:
 * Subject: Catálogo: {{catalog_name}}
 *
 * Hola {{to_name}},
 *
 * Te comparto nuestro catálogo "{{catalog_name}}".
 *
 * {{catalog_description}}
 *
 * {{products_list}}
 *
 * Puedes ver el catálogo completo aquí:
 * {{catalog_url}}
 *
 * ¡Saludos!
 */

import emailjs from '@emailjs/browser'

// Configuración - Reemplazar con tus credenciales de EmailJS
const EMAILJS_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
}

// Verificar si EmailJS está configurado
const isConfigured = () => {
  return !!(
    EMAILJS_CONFIG.PUBLIC_KEY &&
    EMAILJS_CONFIG.SERVICE_ID &&
    EMAILJS_CONFIG.TEMPLATE_ID
  )
}

/**
 * Formatear la lista de productos para el email
 */
const formatProductsList = (products) => {
  if (!products || products.length === 0) return 'No hay productos disponibles.'

  return products
    .map((p, index) => {
      const price = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      }).format(p.selling_price || 0)

      return `${index + 1}. ${p.name} - ${price}${p.stock_quantity ? ` (Stock: ${p.stock_quantity})` : ''}`
    })
    .join('\n')
}

/**
 * Enviar catálogo por email
 */
export const sendCatalogEmail = async (catalogData, recipientEmail, recipientName = 'Cliente') => {
  // Verificar configuración
  if (!isConfigured()) {
    console.warn('EmailJS no está configurado. Usando mailto fallback.')
    // Fallback a mailto:
    const subject = `Catálogo: ${catalogData.name}`
    const productsList = formatProductsList(catalogData.products || [])
    const body = `Hola ${recipientName},

Te comparto nuestro catálogo "${catalogData.name}".

${catalogData.description || ''}

Productos:
${productsList}

Puedes ver el catálogo completo aquí:
${catalogData.share_url}

¡Saludos!`

    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink, '_blank')

    return { success: true, method: 'fallback' }
  }

  try {
    // Inicializar EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)

    const productsList = formatProductsList(catalogData.products || [])

    // Enviar email
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      {
        to_name: recipientName,
        to_email: recipientEmail,
        catalog_name: catalogData.name,
        catalog_description: catalogData.description || 'Sin descripción',
        catalog_url: catalogData.share_url,
        products_list: productsList,
        reply_to: recipientEmail,
      }
    )

    console.log('Email enviado:', response)
    return { success: true, method: 'emailjs', response }
  } catch (error) {
    console.error('Error enviando email con EmailJS:', error)
    return { success: false, error: error.message || 'Error al enviar email' }
  }
}

/**
 * Verificar si el servicio está configurado
 */
export const checkEmailConfig = () => {
  return {
    configured: isConfigured(),
    config: {
      hasPublicKey: !!EMAILJS_CONFIG.PUBLIC_KEY,
      hasServiceId: !!EMAILJS_CONFIG.SERVICE_ID,
      hasTemplateId: !!EMAILJS_CONFIG.TEMPLATE_ID,
    },
  }
}

export default { sendCatalogEmail, checkEmailConfig }
