/**
 * Datos Mock para Modo Demo/Demo Mode
 * Usados cuando no hay conexión a Supabase o para demostraciones
 */

export const mockProducts = [
  {
    id: 'mock-1',
    name: 'Camiseta Básica',
    sku: 'TSH-001',
    category: 'Ropa',
    selling_price: 15000,
    cost_price: 8000,
    stock_quantity: 50,
    min_stock_alert: 10,
    is_active: true,
    description: 'Camiseta de algodón de alta calidad',
    image_url: null,
    user_id: 'demo-user',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    name: 'Pantalón Jean',
    sku: 'JEA-001',
    category: 'Ropa',
    selling_price: 35000,
    cost_price: 20000,
    stock_quantity: 25,
    min_stock_alert: 5,
    is_active: true,
    description: 'Pantalón de jean clásico',
    image_url: null,
    user_id: 'demo-user',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    name: 'Zapatillas Deportivas',
    sku: 'SHO-001',
    category: 'Calzado',
    selling_price: 45000,
    cost_price: 25000,
    stock_quantity: 8,
    min_stock_alert: 5,
    is_active: true,
    description: 'Zapatillas para deportes',
    image_url: null,
    user_id: 'demo-user',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    name: 'Mochila Escolar',
    sku: 'BAG-001',
    category: 'Accesorios',
    selling_price: 28000,
    cost_price: 15000,
    stock_quantity: 15,
    min_stock_alert: 8,
    is_active: true,
    description: 'Mochila resistente para uso escolar',
    image_url: null,
    user_id: 'demo-user',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-5',
    name: 'Gorra Baseball',
    sku: 'CAP-001',
    category: 'Accesorios',
    selling_price: 12000,
    cost_price: 5000,
    stock_quantity: 3,
    min_stock_alert: 10,
    is_active: true,
    description: 'Gorra de baseball clásica',
    image_url: null,
    user_id: 'demo-user',
    created_at: new Date().toISOString(),
  },
]

export const mockCategories = [
  { id: 'cat-1', name: 'Ropa', icon: 'shirt' },
  { id: 'cat-2', name: 'Calzado', icon: 'shoe' },
  { id: 'cat-3', name: 'Accesorios', icon: 'bag' },
  { id: 'cat-4', name: 'Electrónica', icon: 'laptop' },
  { id: 'cat-5', name: 'Hogar', icon: 'home' },
]

export const mockSales = [
  {
    id: 'sale-1',
    user_id: 'demo-user',
    total_amount: 45000,
    payment_method: 'cash',
    transaction_date: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Venta en tienda',
    contacts: {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+56912345678',
    },
    transaction_items: [
      {
        id: 'item-1',
        transaction_id: 'sale-1',
        product_id: 'mock-1',
        quantity: 3,
        unit_price: 15000,
        subtotal: 45000,
      },
    ],
  },
  {
    id: 'sale-2',
    user_id: 'demo-user',
    total_amount: 35000,
    payment_method: 'card',
    transaction_date: new Date(Date.now() - 172800000).toISOString(),
    notes: 'Venta online',
    contacts: {
      name: 'María González',
      email: 'maria@example.com',
      phone: '+56987654321',
    },
    transaction_items: [
      {
        id: 'item-2',
        transaction_id: 'sale-2',
        product_id: 'mock-2',
        quantity: 1,
        unit_price: 35000,
        subtotal: 35000,
      },
    ],
  },
  {
    id: 'sale-3',
    user_id: 'demo-user',
    total_amount: 88000,
    payment_method: 'transfer',
    transaction_date: new Date(Date.now() - 259200000).toISOString(),
    notes: 'Venta mayorista',
    contacts: {
      name: 'Carlos López',
      email: 'carlos@example.com',
      phone: '+56911112222',
    },
    transaction_items: [
      {
        id: 'item-3',
        transaction_id: 'sale-3',
        product_id: 'mock-1',
        quantity: 4,
        unit_price: 15000,
        subtotal: 60000,
      },
      {
        id: 'item-4',
        transaction_id: 'sale-3',
        product_id: 'mock-2',
        quantity: 1,
        unit_price: 28000,
        subtotal: 28000,
      },
    ],
  },
]

export const mockContacts = [
  {
    id: 'contact-1',
    user_id: 'demo-user',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+56912345678',
    type: 'customer',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'contact-2',
    user_id: 'demo-user',
    name: 'María González',
    email: 'maria@example.com',
    phone: '+56987654321',
    type: 'customer',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'contact-3',
    user_id: 'demo-user',
    name: 'Carlos López',
    email: 'carlos@example.com',
    phone: '+56911112222',
    type: 'supplier',
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

export const mockExpenses = [
  {
    id: 'expense-1',
    user_id: 'demo-user',
    total_amount: 50000,
    category: 'Servicios',
    notes: 'Pago de internet',
    expense_date: new Date(Date.now() - 86400000).toISOString(),
    is_active: true,
  },
  {
    id: 'expense-2',
    user_id: 'demo-user',
    total_amount: 120000,
    category: 'Inventario',
    notes: 'Compra de mercadería',
    expense_date: new Date(Date.now() - 172800000).toISOString(),
    is_active: true,
  },
]

export const mockCatalogs = [
  {
    id: 'catalog-1',
    user_id: 'demo-user',
    name: 'Catálogo Primavera 2026',
    description: 'Nuestra colección de primavera',
    is_public: true,
    share_url: 'https://negociopro.vercel.app/catalog/primavera-2026',
    product_count: 5,
    view_count: 42,
    created_at: new Date().toISOString(),
  },
]

export default {
  products: mockProducts,
  categories: mockCategories,
  sales: mockSales,
  contacts: mockContacts,
  expenses: mockExpenses,
  catalogs: mockCatalogs,
}
