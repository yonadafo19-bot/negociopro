import { useState } from 'react'
import { useContacts } from '../hooks/useContacts'
import { Card, Button, Modal, Input, Badge, PageLoader } from '../components/common'
import { User, UserPlus, Mail, Phone, Building, AlertCircle } from 'lucide-react'

const ContactsPage = () => {
  const {
    contacts,
    loading,
    createContact,
    updateContact,
    deleteContact,
    customersCount,
    suppliersCount,
    employeesCount,
  } = useContacts()

  const [showModal, setShowModal] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [deletingContact, setDeletingContact] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [filterType, setFilterType] = useState('all')

  const filteredContacts =
    filterType === 'all' ? contacts : contacts.filter(c => c.contact_type === filterType)

  // Mostrar PageLoader mientras carga inicialmente
  if (loading && contacts.length === 0) {
    return <PageLoader text="Cargando contactos..." />
  }

  const handleCreate = () => {
    setEditingContact(null)
    setShowModal(true)
  }

  const handleEdit = contact => {
    setEditingContact(contact)
    setShowModal(true)
  }

  const handleDelete = contact => {
    setDeletingContact(contact)
  }

  const confirmDelete = async () => {
    if (!deletingContact) return

    setModalLoading(true)

    const { error } = await deleteContact(deletingContact.id)

    setModalLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({
        type: 'success',
        text: `${deletingContact.name} eliminado correctamente`,
      })
    }

    setDeletingContact(null)
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleSubmit = async contactData => {
    setModalLoading(true)
    setMessage({ type: '', text: '' })

    let result

    if (editingContact) {
      result = await updateContact(editingContact.id, contactData)
    } else {
      result = await createContact(contactData)
    }

    setModalLoading(false)

    if (result.error) {
      setMessage({ type: 'error', text: result.error.message })
    } else {
      setMessage({
        type: 'success',
        text: editingContact
          ? 'Contacto actualizado correctamente'
          : 'Contacto creado correctamente',
      })
      setShowModal(false)
      setEditingContact(null)
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const getContactTypeLabel = type => {
    const labels = {
      customer: 'Cliente',
      supplier: 'Proveedor',
      employee: 'Empleado',
    }
    return labels[type] || type
  }

  const getContactTypeColor = type => {
    const colors = {
      customer: 'success',
      supplier: 'warning',
      employee: 'primary',
    }
    return colors[type] || 'secondary'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contactos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus clientes, proveedores y empleados
          </p>
        </div>

        <Button onClick={handleCreate} icon={UserPlus}>
          Nuevo Contacto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-kawaii">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clientes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{customersCount}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500 rounded-kawaii">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Proveedores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{suppliersCount}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500 rounded-kawaii">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Empleados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{employeesCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md" className="mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por:</span>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-kawaii text-sm font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Todos ({contacts.length})
            </button>

            <button
              onClick={() => setFilterType('customer')}
              className={`px-4 py-2 rounded-kawaii text-sm font-medium transition-colors ${
                filterType === 'customer'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Clientes ({customersCount})
            </button>

            <button
              onClick={() => setFilterType('supplier')}
              className={`px-4 py-2 rounded-kawaii text-sm font-medium transition-colors ${
                filterType === 'supplier'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Proveedores ({suppliersCount})
            </button>

            <button
              onClick={() => setFilterType('employee')}
              className={`px-4 py-2 rounded-kawaii text-sm font-medium transition-colors ${
                filterType === 'employee'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Empleados ({employeesCount})
            </button>
          </div>
        </div>
      </Card>

      {/* Message */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-kawaii flex items-start gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Contacts list */}
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando contactos...</p>
          </div>
        ) : filteredContacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Nombre
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Teléfono
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map(contact => (
                  <tr
                    key={contact.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold">
                          {contact.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {contact.name}
                          </p>
                          {contact.tax_id && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {contact.tax_id}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getContactTypeColor(contact.contact_type)}>
                        {getContactTypeLabel(contact.contact_type)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {contact.email || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {contact.phone || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(contact)}>
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(contact)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sin contactos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filterType !== 'all'
                ? `No hay ${getContactTypeLabel(filterType).toLowerCase()}s registrados`
                : 'Empieza agregando tus primeros contactos'}
            </p>
            <Button onClick={handleCreate} icon={UserPlus}>
              Agregar Contacto
            </Button>
          </div>
        )}
      </Card>

      {/* Create/Edit modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingContact(null)
          setMessage({ type: '', text: '' })
        }}
        title={editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
        size="lg"
      >
        <ContactForm
          contact={editingContact}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false)
            setEditingContact(null)
            setMessage({ type: '', text: '' })
          }}
          loading={modalLoading}
        />

        {message.text && (
          <div className="mt-4 p-3 rounded-kawaii text-sm text-center">{message.text}</div>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deletingContact}
        onClose={() => setDeletingContact(null)}
        title="Eliminar Contacto"
        size="sm"
      >
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ¿Estás seguro?
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-2">Vas a eliminar el contacto:</p>

          <p className="font-semibold text-gray-900 dark:text-white mb-6">
            {deletingContact?.name}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Esta acción no se puede deshacer.
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDeletingContact(null)}
              className="flex-1"
              disabled={modalLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={modalLoading}
              className="flex-1"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Contact Form Component
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

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
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

  const handleSubmit = e => {
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tipo de contacto *
        </label>
        <select
          name="contact_type"
          value={formData.contact_type}
          onChange={handleChange}
          className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notas
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notas adicionales..."
          rows={3}
          className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-kawaii focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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

export default ContactsPage
