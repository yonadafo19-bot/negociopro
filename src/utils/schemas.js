import { z } from 'zod'

// Product Schema
export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  description: z.string().max(500, 'La descripción es muy larga').optional(),
  sku: z.string().max(50, 'El SKU es muy largo').optional(),
  barcode: z.string().max(50, 'El código de barras es muy largo').optional(),
  category: z.string().max(50, 'La categoría es muy larga').optional(),
  cost_price: z.number().min(0, 'El costo no puede ser negativo'),
  selling_price: z.number().min(0, 'El precio no puede ser negativo'),
  stock_quantity: z.number().int().min(0, 'El stock no puede ser negativo'),
  min_stock_alert: z.number().int().min(0, 'El stock mínimo no puede ser negativo'),
  image_url: z.string().url().optional().or(z.literal('')),
})

// Contact Schema
export const contactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().max(20, 'El teléfono es muy largo').optional(),
  address: z.string().max(200, 'La dirección es muy larga').optional(),
  tax_id: z.string().max(20, 'El RFC es muy largo').optional(),
  contact_type: z.enum(['customer', 'supplier', 'employee'], 'Tipo de contacto inválido'),
  notes: z.string().max(500, 'Las notas son muy largas').optional(),
})

// Sale/Expense Schema
export const transactionSchema = z.object({
  total: z.number().min(0, 'El monto no puede ser negativo'),
  payment_method: z.enum(['cash', 'card', 'transfer', 'mercadopago'], 'Método de pago inválido'),
  contact_id: z.string().uuid().optional().or(z.literal('')),
  notes: z.string().max(500, 'Las notas son muy largas').optional(),
  items: z.array(z.object({
    product_id: z.string().uuid('ID de producto inválido'),
    quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
    unit_price: z.number().min(0, 'El precio no puede ser negativo'),
  })).min(1, 'Debes agregar al menos un producto'),
})

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').regex(/[A-Z]/, 'Debe contener mayúscula').regex(/[a-z]/, 'Debe contener minúscula').regex(/[0-9]/, 'Debe contener número'),
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  business_name: z.string().min(2, 'El nombre del negocio debe tener al menos 2 caracteres').max(100),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export default {
  productSchema,
  contactSchema,
  transactionSchema,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
}
