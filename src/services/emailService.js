/**
 * Servicio de Correo Electrónico
 * Permite enviar emails desde la aplicación
 */

/**
 * Abre el cliente de correo del usuario con un email pre-llenado
 * Compatible con Gmail, Outlook, Apple Mail, etc.
 */
export const emailService = {
  /**
   * Abre el cliente de correo para enviar un reporte
   */
  sendReport: async ({ to, subject, body, attachments = [] }) => {
    const mailtoLink = generateMailtoLink({ to, subject, body })
    window.open(mailtoLink, '_blank')
    return { success: true }
  },

  /**
   * Enviar recibo de venta por email
   */
  sendSaleReceipt: async (saleData, customerEmail) => {
    const { transaction, items } = saleData

    const subject = `Recibo de Venta #${transaction.id?.substring(0, 8)} - ${new Date(transaction.transaction_date).toLocaleDateString('es-ES')}`

    const body = generateSaleReceiptBody(transaction, items)

    return emailService.sendReport({
      to: customerEmail,
      subject,
      body,
    })
  },

  /**
   * Enviar reporte de cierre de caja
   */
  sendCashClosingReport: async (summary, recipientEmail) => {
    const subject = `Cierre de Caja - ${new Date().toLocaleDateString('es-ES')}`

    const body = generateCashClosingBody(summary)

    return emailService.sendReport({
      to: recipientEmail,
      subject,
      body,
    })
  },

  /**
   * Enviar catálogo por email
   */
  sendCatalog: async (catalogData, recipientEmail) => {
    const subject = `Catálogo: ${catalogData.name}`

    const body = generateCatalogBody(catalogData)

    return emailService.sendReport({
      to: recipientEmail,
      subject,
      body,
    })
  },

  /**
   * Enviar alerta de stock bajo
   */
  sendLowStockAlert: async (products, recipientEmail) => {
    const subject = `⚠️ Alerta: Productos con Stock Bajo`

    const body = generateLowStockBody(products)

    return emailService.sendReport({
      to: recipientEmail,
      subject,
      body,
    })
  },

  /**
   * Enviar reporte de gastos
   */
  sendExpenseReport: async (expenses, recipientEmail) => {
    const subject = `Reporte de Gastos - ${new Date().toLocaleDateString('es-ES')}`

    const body = generateExpenseReportBody(expenses)

    return emailService.sendReport({
      to: recipientEmail,
      subject,
      body,
    })
  },

  /**
   * Copiar al portapapeles (para enviar por WhatsApp, etc.)
   */
  copyToClipboard: async text => {
    try {
      await navigator.clipboard.writeText(text)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  /**
   * Compartir usando Web Share API (móvil)
   */
  share: async data => {
    if (navigator.share) {
      try {
        await navigator.share(data)
        return { success: true }
      } catch (error) {
        if (error.name !== 'AbortError') {
          return { success: false, error: error.message }
        }
        return { success: true } // User cancelled
      }
    }
    return { success: false, error: 'Web Share API not supported' }
  },
}

/**
 * Genera un link mailto con los datos proporcionados
 */
function generateMailtoLink({ to, subject, body, cc = [], bcc = [] }) {
  const params = new URLSearchParams()

  if (subject) params.append('subject', subject)
  if (body) params.append('body', body)

  const ccList = Array.isArray(cc) ? cc : [cc]
  ccList.forEach(email => {
    if (email) params.append('cc', email)
  })

  const bccList = Array.isArray(bcc) ? bcc : [bcc]
  bccList.forEach(email => {
    if (email) params.append('bcc', email)
  })

  const queryString = params.toString()
  return `mailto:${to}?${queryString}`
}

/**
 * Genera el cuerpo del email para recibo de venta
 */
function generateSaleReceiptBody(transaction, items) {
  const formatCurrency = amount =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)

  let body = `RECIBO DE VENTA
================================

Negocio: ${transaction.profiles?.business_name || 'N/A'}
Fecha: ${new Date(transaction.transaction_date).toLocaleString('es-ES')}
Recibo #: ${transaction.id?.substring(0, 8).toUpperCase()}

DETALLE DE COMPRA:
----------------------------------------

`

  items.forEach((item, index) => {
    body += `${index + 1}. ${item.product_name || item.name}
   Cantidad: ${item.quantity}
   Precio unitario: ${formatCurrency(item.unit_price)}
   Subtotal: ${formatCurrency(item.subtotal || item.quantity * item.unit_price)}

`
  })

  body += `================================
RESUMEN:
----------------------------------------

Subtotal: ${formatCurrency(transaction.subtotal || 0)}
IVA (16%): ${formatCurrency(transaction.tax_amount || 0)}
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
Para consultas: ${transaction.profiles?.phone || 'N/A'}
`

  return body
}

/**
 * Genera el cuerpo del email para cierre de caja
 */
function generateCashClosingBody(summary) {
  const formatCurrency = amount =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)

  let body = `CIERRE DE CAJA
================================
Fecha: ${new Date().toLocaleString('es-ES')}

RESUMEN DEL DÍA:
----------------------------------------

Ventas Totales: ${formatCurrency(summary.totalSales)}
Cantidad de Ventas: ${summary.salesCount}

Gastos del Día: ${formatCurrency(summary.totalExpenses)}
Cantidad de Gastos: ${summary.expensesCount}

Balance Neto: ${formatCurrency(summary.netAmount)}

VENTAS POR MÉTODO DE PAGO:
----------------------------------------

💵 Efectivo: ${formatCurrency(summary.salesByMethod.cash)}
💳 Tarjeta: ${formatCurrency(summary.salesByMethod.card)}
🏦 Transferencia: ${formatCurrency(summary.salesByMethod.transfer)}

`

  if (Object.keys(summary.expensesByCategory).length > 0) {
    body += `GASTOS POR CATEGORÍA:
----------------------------------------
`
    Object.entries(summary.expensesByCategory).forEach(([category, amount]) => {
      body += `${category}: ${formatCurrency(amount)}\n`
    })
  }

  body += `
TOTAL A DEPOSITAR/ARQUEAR: ${formatCurrency(summary.salesByMethod.cash - summary.totalExpenses)}

---
Generado por NegociPro
`

  return body
}

/**
 * Genera el cuerpo del email para catálogo
 */
function generateCatalogBody(catalogData) {
  const products = catalogData.products || []

  let body = `CATÁLOGO: ${catalogData.name.toUpperCase()}
================================
${catalogData.description || ''}

PRODUCTOS DISPONIBLES:
----------------------------------------

`

  products.forEach((product, index) => {
    const formatCurrency = amount =>
      new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(product.sale_price || product.selling_price || 0)

    body += `${index + 1}. ${product.name}
   ${product.sku ? `SKU: ${product.sku}` : ''}
   Precio: ${formatCurrency(product.sale_price || product.selling_price)}
   Stock: ${product.stock_quantity} unidades

`
  })

  body += `================================
Para más información o pedidos:
📧 Email: ${catalogData.business_email || 'N/A'}
📱 WhatsApp: ${catalogData.business_phone || 'N/A'}

---
Ver catálogo online: ${catalogData.share_url || 'N/A'}
`

  return body
}

/**
 * Genera el cuerpo del email para alerta de stock bajo
 */
function generateLowStockBody(products) {
  let body = `⚠️ ALERTA DE STOCK BAJO
================================
Fecha: ${new Date().toLocaleString('es-ES')}

Los siguientes productos tienen stock bajo:
----------------------------------------

`

  products.forEach((product, index) => {
    body += `${index + 1}. ${product.name}
   Stock actual: ${product.stock_quantity}
   Stock mínimo: ${product.min_stock_alert}
   Diferencia: ${product.min_stock_alert - product.stock_quantity} unidades

`
  })

  body += `---
Por favor reabastecer estos productos lo antes posible.
`

  return body
}

/**
 * Genera el cuerpo del email para reporte de gastos
 */
function generateExpenseReportBody(expenses) {
  const formatCurrency = amount =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)

  let body = `REPORTE DE GASTOS
================================
Fecha: ${new Date().toLocaleString('es-ES')}

GASTOS REGISTRADOS:
----------------------------------------

`

  let total = 0
  expenses.forEach((expense, index) => {
    total += parseFloat(expense.total_amount)
    const category = expense.notes?.split(':')[0] || 'Sin categoría'
    const description = expense.notes?.split(':')[1]?.trim() || expense.notes || 'N/A'

    body += `${index + 1}. ${category}
   Descripción: ${description}
   Monto: ${formatCurrency(expense.total_amount)}
   Fecha: ${new Date(expense.transaction_date).toLocaleString('es-ES')}
   ${expense.invoice ? `Factura: ${expense.invoice}` : ''}

`
  })

  body += `================================
TOTAL DE GASTOS: ${formatCurrency(total)}

---
Generado por NegociPro
`

  return body
}

export default emailService
