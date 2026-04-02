import { supabase } from './supabase'

/**
 * Servicio de Notificaciones con Trazabilidad Completa
 * Registra TODOS los eventos de la aplicación con detalles completos
 */

export const notificationTypes = {
  // Producto
  PRODUCT_CREATED: 'product_created',
  PRODUCT_UPDATED: 'product_updated',
  PRODUCT_DELETED: 'product_deleted',
  STOCK_LOW: 'stock_low',
  STOCK_OUT: 'stock_out',
  STOCK_ADDED: 'stock_added',
  STOCK_REMOVED: 'stock_removed',

  // Cliente
  CUSTOMER_CREATED: 'customer_created',
  CUSTOMER_UPDATED: 'customer_updated',
  CUSTOMER_DELETED: 'customer_deleted',

  // Venta
  SALE_CREATED: 'sale_created',
  SALE_REFUNDED: 'sale_refunded',
  PAYMENT_RECEIVED: 'payment_received',

  // Catálogo
  CATALOG_CREATED: 'catalog_created',
  CATALOG_UPDATED: 'catalog_updated',
  CATALOG_DELETED: 'catalog_deleted',
  CATALOG_SHARED: 'catalog_shared',
  CATALOG_VIEWED: 'catalog_viewed',

  // Gasto
  EXPENSE_CREATED: 'expense_created',
  EXPENSE_UPDATED: 'expense_updated',
  EXPENSE_DELETED: 'expense_deleted',

  // Usuario
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  SETTINGS_UPDATED: 'settings_updated',
}

export const notificationService = {
  /**
   * Crear notificación con datos completos
   */
  create: async (userId, type, data) => {
    const notification = {
      user_id: userId,
      type,
      title: generateTitle(type, data),
      message: generateMessage(type, data),
      metadata: data,
      is_read: false,
      created_at: new Date().toISOString(),
    }

    const { data: result, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return null
    }

    return result
  },

  /**
   * Obtener notificaciones del usuario
   */
  getAll: async (userId, limit = 50) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching notifications:', error)
      return []
    }

    return data
  },

  /**
   * Obtener notificaciones no leídas
   */
  getUnread: async (userId) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching unread notifications:', error)
      return []
    }

    return data
  },

  /**
   * Marcar como leída
   */
  markAsRead: async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)

    return { error }
  },

  /**
   * Marcar todas como leídas
   */
  markAllAsRead: async (userId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_read', false)

    return { error }
  },

  /**
   * Eliminar notificación
   */
  delete: async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    return { error }
  },

  /**
   * Limpiar notificaciones antiguas (más de 30 días)
   */
  cleanOld: async (userId) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('is_read', true)
      .lt('created_at', thirtyDaysAgo.toISOString())

    return { error }
  },
}

/**
 * Genera el título de la notificación según el tipo
 */
function generateTitle(type, data) {
  const titles = {
    [notificationTypes.PRODUCT_CREATED]: '📦 Nuevo Producto Agregado',
    [notificationTypes.PRODUCT_UPDATED]: '✏️ Producto Modificado',
    [notificationTypes.PRODUCT_DELETED]: '🗑️ Producto Eliminado',
    [notificationTypes.STOCK_LOW]: '⚠️ Stock Bajo',
    [notificationTypes.STOCK_OUT]: '🚨 Producto Agotado',
    [notificationTypes.STOCK_ADDED]: '📈 Stock Aumentado',
    [notificationTypes.STOCK_REMOVED]: '📉 Stock Reducido',

    [notificationTypes.CUSTOMER_CREATED]: '👤 Nuevo Cliente Registrado',
    [notificationTypes.CUSTOMER_UPDATED]: '✏️ Cliente Actualizado',
    [notificationTypes.CUSTOMER_DELETED]: '🗑️ Cliente Eliminado',

    [notificationTypes.SALE_CREATED]: '💰 Nueva Venta Registrada',
    [notificationTypes.SALE_REFUNDED]: '💸 Venta Reembolsada',
    [notificationTypes.PAYMENT_RECEIVED]: '✅ Pago Recibido',

    [notificationTypes.CATALOG_CREATED]: '📚 Nuevo Catálogo Creado',
    [notificationTypes.CATALOG_UPDATED]: '✏️ Catálogo Actualizado',
    [notificationTypes.CATALOG_DELETED]: '🗑️ Catálogo Eliminado',
    [notificationTypes.CATALOG_SHARED]: '🔗 Catálogo Compartido',
    [notificationTypes.CATALOG_VIEWED]: '👁️ Catálogo Visto',

    [notificationTypes.EXPENSE_CREATED]: '💸 Nuevo Gasto Registrado',
    [notificationTypes.EXPENSE_UPDATED]: '✏️ Gasto Actualizado',
    [notificationTypes.EXPENSE_DELETED]: '🗑️ Gasto Eliminado',

    [notificationTypes.USER_LOGIN]: '👋 Sesión Iniciada',
    [notificationTypes.USER_LOGOUT]: '👋 Sesión Cerrada',
    [notificationTypes.SETTINGS_UPDATED]: '⚙️ Configuración Actualizada',
  }

  return titles[type] || '📌 Notificación'
}

/**
 * Genera el mensaje detallado de la notificación
 */
function generateMessage(type, data) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)

  const formatDate = (date) =>
    new Date(date).toLocaleString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const messages = {
    [notificationTypes.PRODUCT_CREATED]: `El producto "${data.name}" ha sido agregado al inventario.\nPrecio: ${formatCurrency(data.selling_price)} | Stock: ${data.stock_quantity} unidades`,
    [notificationTypes.PRODUCT_UPDATED]: `El producto "${data.name}" ha sido actualizado.\nCambios: ${data.changes || 'Varios'}`,
    [notificationTypes.PRODUCT_DELETED]: `El producto "${data.name}" ha sido eliminado del inventario.`,
    [notificationTypes.STOCK_LOW]: `⚠️ "${data.name}" tiene stock bajo.\nActual: ${data.current} | Mínimo: ${data.minimum}`,
    [notificationTypes.STOCK_OUT]: `🚨 "${data.name}" está AGOTADO.\nStock actual: 0 unidades`,
    [notificationTypes.STOCK_ADDED]: `Stock de "${data.name}" aumentado.\nAnterior: ${data.previous} → Nuevo: ${data.new} (+${data.added})`,
    [notificationTypes.STOCK_REMOVED]: `Stock de "${data.name}" reducido.\nAnterior: ${data.previous} → Nuevo: ${data.new} (-${data.removed})`,

    [notificationTypes.CUSTOMER_CREATED]: `Nuevo cliente: "${data.name}".\n📧 ${data.email}\n📱 ${data.phone}`,
    [notificationTypes.CUSTOMER_UPDATED]: `Cliente "${data.name}" actualizado.\nCambios: ${data.changes || 'Varios'}`,
    [notificationTypes.CUSTOMER_DELETED]: `Cliente "${data.name}" eliminado del sistema.`,

    [notificationTypes.SALE_CREATED]: `💰 Venta #${data.transactionId?.substring(0, 8)} registrada.\n💵 Total: ${formatCurrency(data.total)}\n👤 Cliente: ${data.customer || 'General'}\n💳 Método: ${getPaymentMethod(data.paymentMethod)}\n📦 ${data.itemCount} productos\n🕐 ${formatDate(data.date)}`,
    [notificationTypes.SALE_REFUNDED]: `Reembolso de venta #${data.transactionId?.substring(0, 8)}.\nMonto: ${formatCurrency(data.amount)}`,
    [notificationTypes.PAYMENT_RECEIVED]: `Pago recibido: ${formatCurrency(data.amount)}\nDe: ${data.customer}`,

    [notificationTypes.CATALOG_CREATED]: `Catálogo "${data.name}" creado exitosamente.\n📦 ${data.productCount} productos incluidos`,
    [notificationTypes.CATALOG_UPDATED]: `Catálogo "${data.name}" actualizado.\nCambios: ${data.changes || 'Varios'}`,
    [notificationTypes.CATALOG_DELETED]: `Catálogo "${data.name}" eliminado.`,
    [notificationTypes.CATALOG_SHARED]: `Catálogo "${data.name}" compartido.\n🔗 Enlace generado`,
    [notificationTypes.CATALOG_VIEWED]: `Tu catálogo "${data.name}" ha sido visto.\n👁️ Vistas: ${data.viewCount}`,

    [notificationTypes.EXPENSE_CREATED]: `Gasto registrado: ${formatCurrency(data.amount)}\n📝 ${data.description}\n📂 Categoría: ${data.category}`,
    [notificationTypes.EXPENSE_UPDATED]: `Gasto actualizado: ${formatCurrency(data.amount)}`,
    [notificationTypes.EXPENSE_DELETED]: `Gasto eliminado: ${formatCurrency(data.amount)}\n📝 ${data.description}`,

    [notificationTypes.USER_LOGIN]: `Bienvenido de nuevo, ${data.userName}.\n🖥️ Sesión iniciada: ${formatDate(data.date)}`,
    [notificationTypes.USER_LOGOUT]: `Sesión cerrada: ${formatDate(data.date)}`,
    [notificationTypes.SETTINGS_UPDATED]: `Configuración actualizada: ${data.section || 'General'}`,
  }

  return messages[type] || 'Evento registrado'
}

/**
 * Retorna el método de pago en texto
 */
function getPaymentMethod(method) {
  const methods = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
  }
  return methods[method] || method
}

/**
 * Helpers para crear notificaciones específicas
 */
export const notify = {
  product: {
    created: (userId, product) =>
      notificationService.create(userId, notificationTypes.PRODUCT_CREATED, {
        name: product.name,
        selling_price: product.selling_price,
        stock_quantity: product.stock_quantity,
      }),
    updated: (userId, product, changes) =>
      notificationService.create(userId, notificationTypes.PRODUCT_UPDATED, {
        name: product.name,
        changes,
      }),
    deleted: (userId, productName) =>
      notificationService.create(userId, notificationTypes.PRODUCT_DELETED, {
        name: productName,
      }),
    stockLow: (userId, product) =>
      notificationService.create(userId, notificationTypes.STOCK_LOW, {
        name: product.name,
        current: product.stock_quantity,
        minimum: product.min_stock_alert,
      }),
    stockOut: (userId, product) =>
      notificationService.create(userId, notificationTypes.STOCK_OUT, {
        name: product.name,
        current: 0,
        minimum: product.min_stock_alert,
      }),
    stockAdded: (userId, product, added) =>
      notificationService.create(userId, notificationTypes.STOCK_ADDED, {
        name: product.name,
        previous: product.stock_quantity - added,
        new: product.stock_quantity,
        added,
      }),
    stockRemoved: (userId, product, removed) =>
      notificationService.create(userId, notificationTypes.STOCK_REMOVED, {
        name: product.name,
        previous: product.stock_quantity + removed,
        new: product.stock_quantity,
        removed,
      }),
  },

  customer: {
    created: (userId, customer) =>
      notificationService.create(userId, notificationTypes.CUSTOMER_CREATED, {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      }),
    updated: (userId, customer, changes) =>
      notificationService.create(userId, notificationTypes.CUSTOMER_UPDATED, {
        name: customer.name,
        changes,
      }),
    deleted: (userId, customerName) =>
      notificationService.create(userId, notificationTypes.CUSTOMER_DELETED, {
        name: customerName,
      }),
  },

  sale: {
    created: (userId, sale) =>
      notificationService.create(userId, notificationTypes.SALE_CREATED, {
        transactionId: sale.id,
        total: sale.total_amount,
        customer: sale.contacts?.name || 'General',
        paymentMethod: sale.payment_method,
        itemCount: sale.transaction_items?.length || 0,
        date: sale.transaction_date,
      }),
    refunded: (userId, sale, amount) =>
      notificationService.create(userId, notificationTypes.SALE_REFUNDED, {
        transactionId: sale.id,
        amount,
      }),
  },

  catalog: {
    created: (userId, catalog, productCount) =>
      notificationService.create(userId, notificationTypes.CATALOG_CREATED, {
        name: catalog.name,
        productCount,
      }),
    updated: (userId, catalog, changes) =>
      notificationService.create(userId, notificationTypes.CATALOG_UPDATED, {
        name: catalog.name,
        changes,
      }),
    deleted: (userId, catalogName) =>
      notificationService.create(userId, notificationTypes.CATALOG_DELETED, {
        name: catalogName,
      }),
    shared: (userId, catalogName) =>
      notificationService.create(userId, notificationTypes.CATALOG_SHARED, {
        name: catalogName,
      }),
    viewed: (userId, catalogName, viewCount) =>
      notificationService.create(userId, notificationTypes.CATALOG_VIEWED, {
        name: catalogName,
        viewCount,
      }),
  },

  expense: {
    created: (userId, expense) =>
      notificationService.create(userId, notificationTypes.EXPENSE_CREATED, {
        amount: expense.total_amount,
        description: expense.notes,
        category: expense.category,
      }),
    updated: (userId, expense) =>
      notificationService.create(userId, notificationTypes.EXPENSE_UPDATED, {
        amount: expense.total_amount,
      }),
    deleted: (userId, expense) =>
      notificationService.create(userId, notificationTypes.EXPENSE_DELETED, {
        amount: expense.total_amount,
        description: expense.notes,
      }),
  },

  user: {
    login: (userId, userName) =>
      notificationService.create(userId, notificationTypes.USER_LOGIN, {
        userName,
        date: new Date().toISOString(),
      }),
    logout: (userId) =>
      notificationService.create(userId, notificationTypes.USER_LOGOUT, {
        date: new Date().toISOString(),
      }),
    settingsUpdated: (userId, section) =>
      notificationService.create(userId, notificationTypes.SETTINGS_UPDATED, {
        section,
      }),
  },
}

export default notificationService
