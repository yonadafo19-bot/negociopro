import { useState, useEffect } from 'react'
import { Input, Button } from '../common'
import { Mail, Phone, User, CheckCircle, AlertCircle } from 'lucide-react'

const ContactForm = ({ contact, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    tax_id: '',
    contact_type: 'customer',
    notes: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        address: contact.address || '',
        tax_id: contact.tax_id || '',
        contact_type: contact.contact_type || 'customer',
        notes: contact.notes || '',
      })
    }
  }, [contact])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      address: formData.address.trim() || null,
      tax_id: formData.tax_id.trim() || null,
      contact_type: formData.contact_type,
      notes: formData.notes.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Juan Pérez"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
          Tipo de contacto *
        </label>
        <select
          name="contact_type"
          value={formData.contact_type}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-light-base dark:bg-dark-bg-alt border border-gray-300 dark:border-gray-700 rounded-neo focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-primary dark:focus:ring-offset-gray-900 text-gray-800 dark:text-gray-100 shadow-neo-light-inset dark:shadow-neo-dark-inset transition-all duration-200"
          required
        >
          <option value="customer">Cliente</option>
          <option value="supplier">Proveedor</option>
          <option value="employee">Empleado</option>
        </select>
      </div>

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="juan@ejemplo.com"
        icon={Mail}
      />

      <Input
        label="Teléfono"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="+52 55 1234 5678"
        icon={Phone}
      />

      <Input
        label="Dirección"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Calle 123, Colonia, Ciudad"
      />

      <Input
        label="RFC / Tax ID"
        name="tax_id"
        value={formData.tax_id}
        onChange={handleChange}
        placeholder="RFC (opcional)"
      />

      <div>
        <label className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">
          Notas
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notas adicionales..."
          rows={3}
          className="w-full px-4 py-2 bg-light-base dark:bg-dark-bg-alt border border-gray-300 dark:border-gray-700 rounded-neo focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-primary dark:focus:ring-offset-gray-900 text-gray-800 dark:text-gray-100 shadow-neo-light-inset dark:shadow-neo-dark-inset transition-all duration-200 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" loading={loading} disabled={loading}>
          {contact ? 'Actualizar' : 'Crear'} Contacto
        </Button>
      </div>
    </form>
  )
}

export default ContactForm
