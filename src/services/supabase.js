import { createClient } from '@supabase/supabase-js'

// ✅ BIEN: Usar import.meta.env para Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found in .env file')
  console.error('Please copy .env.example to .env and add your credentials')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Auth service
export const authService = {
  // Sign up new user
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
    return { data, error }
  },

  // Sign in user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/app/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current session
  getSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listen to auth changes
  onAuthStateChange: callback => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(_event, session)
    })
    return data
  },

  // Reset password
  resetPassword: async email => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    return { data, error }
  },

  // Update password
  updatePassword: async newPassword => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { data, error }
  },
}

// Profile service
export const profileService = {
  // Get user profile
  getProfile: async userId => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    return { data, error }
  },

  // Create profile
  createProfile: async profile => {
    const { data, error } = await supabase.from('profiles').insert([profile]).select().single()
    return { data, error }
  },

  // Update profile
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },
}

// Products service
export const productsService = {
  // Get all products for user
  getProducts: async userId => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get single product
  getProduct: async productId => {
    const { data, error } = await supabase.from('products').select('*').eq('id', productId).single()
    return { data, error }
  },

  // Create product
  createProduct: async product => {
    const { data, error } = await supabase.from('products').insert([product]).select().single()
    return { data, error }
  },

  // Update product
  updateProduct: async (productId, updates) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single()
    return { data, error }
  },

  // Delete product (soft delete)
  deleteProduct: async productId => {
    const { data, error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', productId)
    return { data, error }
  },

  // Get low stock products
  getLowStockProducts: async userId => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
    return { data, error }
  },
}

// Contacts service
export const contactsService = {
  // Get all contacts for user
  getContacts: async (userId, type = null) => {
    let query = supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('contact_type', type)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Create contact
  createContact: async contact => {
    const { data, error } = await supabase.from('contacts').insert([contact]).select().single()
    return { data, error }
  },

  // Update contact
  updateContact: async (contactId, updates) => {
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', contactId)
      .select()
      .single()
    return { data, error }
  },

  // Delete contact (soft delete)
  deleteContact: async contactId => {
    const { data, error } = await supabase
      .from('contacts')
      .update({ is_active: false })
      .eq('id', contactId)
    return { data, error }
  },
}

// Transactions service
export const transactionsService = {
  // Get all transactions for user
  getTransactions: async (userId, filters = {}) => {
    let query = supabase
      .from('transactions')
      .select('*, contacts(name), transaction_items(*)')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })

    if (filters.type) {
      query = query.eq('transaction_type', filters.type)
    }

    if (filters.startDate && filters.endDate) {
      query = query
        .gte('transaction_date', filters.startDate)
        .lte('transaction_date', filters.endDate)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Create transaction with items
  createTransaction: async (transaction, items) => {
    // First create transaction
    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single()

    if (txError) return { data: null, error: txError }

    // Then create items
    const itemsWithTxId = items.map(item => ({
      ...item,
      transaction_id: txData.id,
    }))

    const { data: itemsData, error: itemsError } = await supabase
      .from('transaction_items')
      .insert(itemsWithTxId)
      .select()

    // Update stock for products
    for (const item of items) {
      if (item.product_id && transaction.transaction_type === 'sale') {
        await supabase.rpc('decrement_stock', {
          product_id: item.product_id,
          quantity: item.quantity,
        })
      }
    }

    return { data: txData, error: itemsError || txError }
  },
}

// Catalogs service
export const catalogsService = {
  // Get all catalogs for user
  getCatalogs: async userId => {
    const { data, error } = await supabase
      .from('catalogs')
      .select('*, catalog_products(*, products(*))')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get single catalog by share link
  getCatalogByShareLink: async shareLink => {
    const { data, error } = await supabase
      .from('catalogs')
      .select('*, catalog_products(*, products(*)), profiles(*)')
      .eq('share_link', shareLink)
      .eq('is_active', true)
      .single()

    // Increment view count
    if (data && !error) {
      await supabase
        .from('catalogs')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id)
    }

    return { data, error }
  },

  // Create catalog with products
  createCatalog: async (catalog, productIds) => {
    // First create catalog
    const { data: catalogData, error: catalogError } = await supabase
      .from('catalogs')
      .insert([
        {
          ...catalog,
          share_link: await generateUniqueShareLink(),
          view_count: 0,
        },
      ])
      .select()
      .single()

    if (catalogError) return { data: null, error: catalogError }

    // Then add products to catalog
    if (productIds && productIds.length > 0) {
      const catalogProducts = productIds.map(productId => ({
        catalog_id: catalogData.id,
        product_id: productId,
      }))

      const { error: productsError } = await supabase
        .from('catalog_products')
        .insert(catalogProducts)

      if (productsError) return { data: null, error: productsError }
    }

    return { data: catalogData, error: null }
  },

  // Update catalog
  updateCatalog: async (catalogId, updates) => {
    const { data, error } = await supabase
      .from('catalogs')
      .update(updates)
      .eq('id', catalogId)
      .select()
      .single()
    return { data, error }
  },

  // Update catalog products
  updateCatalogProducts: async (catalogId, productIds) => {
    // First remove all existing products
    const { error: deleteError } = await supabase
      .from('catalog_products')
      .delete()
      .eq('catalog_id', catalogId)

    if (deleteError) return { data: null, error: deleteError }

    // Then add new products
    if (productIds && productIds.length > 0) {
      const catalogProducts = productIds.map(productId => ({
        catalog_id: catalogId,
        product_id: productId,
      }))

      const { error: insertError } = await supabase.from('catalog_products').insert(catalogProducts)

      if (insertError) return { data: null, error: insertError }
    }

    return { data: null, error: null }
  },

  // Delete catalog (soft delete)
  deleteCatalog: async catalogId => {
    const { data, error } = await supabase
      .from('catalogs')
      .update({ is_active: false })
      .eq('id', catalogId)
    return { data, error }
  },

}

// Helper function to generate unique share link (cryptographically secure)
async function generateUniqueShareLink() {
  // Usar crypto.randomUUID() para mayor seguridad
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').substring(0, 16)
  }
  // Fallback para navegadores antiguos
  const array = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
  } else {
    // Último fallback - menos seguro pero mejor que nada
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 16)
}

export default supabase
