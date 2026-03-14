/**
 * Utilidades de validación para formularios
 */

/**
 * Valida un correo electrónico
 */
export const validateEmail = (email) => {
  if (!email) {
    return 'El correo es requerido'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Correo inválido'
  }

  return null
}

/**
 * Valida una contraseña
 */
export const validatePassword = (password) => {
  if (!password) {
    return 'La contraseña es requerida'
  }

  if (password.length < 6) {
    return 'Mínimo 6 caracteres'
  }

  return null
}

/**
 * Valida confirmación de contraseña
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Confirma tu contraseña'
  }

  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden'
  }

  return null
}

/**
 * Valida un campo de texto requerido
 */
export const validateRequired = (value, fieldName = 'Este campo') => {
  if (!value || value.trim() === '') {
    return `${fieldName} es requerido`
  }

  return null
}

/**
 * Valida un número de teléfono
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return null // El teléfono es opcional
  }

  const phoneRegex = /^[+]?[\d\s\-()]+$/
  if (!phoneRegex.test(phone)) {
    return 'Teléfono inválido'
  }

  return null
}

/**
 * Valida un precio (decimal positivo)
 */
export const validatePrice = (price, fieldName = 'Precio') => {
  if (!price && price !== 0) {
    return `${fieldName} es requerido`
  }

  const numPrice = parseFloat(price)
  if (isNaN(numPrice) || numPrice < 0) {
    return `${fieldName} debe ser un número positivo`
  }

  return null
}

/**
 * Valida stock (entero no negativo)
 */
export const validateStock = (stock, fieldName = 'Stock') => {
  if (!stock && stock !== 0) {
    return `${fieldName} es requerido`
  }

  const numStock = parseInt(stock)
  if (isNaN(numStock) || numStock < 0) {
    return `${fieldName} debe ser un número entero no negativo`
  }

  return null
}

/**
 * Valida un formulario completo
 */
export const validateForm = (formData, validationRules) => {
  const errors = {}

  Object.keys(validationRules).forEach((field) => {
    const validator = validationRules[field]
    const error = validator(formData[field])
    if (error) {
      errors[field] = error
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  validatePhone,
  validatePrice,
  validateStock,
  validateForm,
}
