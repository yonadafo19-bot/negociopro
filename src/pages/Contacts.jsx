import { useState } from 'react'
import { useContacts } from '../hooks/useContacts'
import { Card, Button, Modal, Badge, PageLoader, useToast } from '../components/common'
import { User, UserPlus, Mail, Phone, Building, AlertCircle } from 'lucide-react'
import { ContactForm } from '../components/contacts'

const ContactsPage = () => {
  const toast = useToast()

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
  const [filterType, setFilterType] = useState('all')

  const filteredContacts =
    filterType === 'all' ? contacts : contacts.filter((c) => c.contact_type === filterType)

  const handleCreate = () => {
    setEditingContact(null)
    setShowModal(true)
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setShowModal(true)
  }

  const handleDelete = (contact) => {
    setDeletingContact(contact)
  }

  const confirmDelete = async () => {
    if (!deletingContact) return

    setModalLoading(true)

    const { error } = await deleteContact(deletingContact.id)

    setModalLoading(false)

    if (error) {
      toast.error(`Error al eliminar: ${error.message}`)
    } else {
      toast.success(`${deletingContact.name} eliminado correctamente`)
    }

    setDeletingContact(null)
  }

  const handleSubmit = async (contactData) => {
    setModalLoading(true)

    let result

    if (editingContact) {
      result = await updateContact(editingContact.id, contactData)
    } else {
      result = await createContact(contactData)
    }

    setModalLoading(false)

    if (result.error) {
      toast.error(`Error: ${result.error.message}`)
    } else {
      toast.success(
        editingContact
          ? 'Contacto actualizado correctamente'
          : 'Contacto creado correctamente'
      )
      setShowModal(false)
      setEditingContact(null)
    }
  }

  const getContactTypeLabel = (type) => {
    const labels = {
      customer: 'Cliente',
      supplier: 'Proveedor',
      employee: 'Empleado',
    }
    return labels[type] || type
  }

  const getContactTypeColor = (type) => {
    const colors = {
      customer: 'success',
      supplier: 'warning',
      employee: 'primary',
    }
    return colors[type] || 'secondary'
  }

  // Mostrar PageLoader mientras carga inicialmente
  if (loading && contacts.length === 0) {
    return <PageLoader text="Cargando contactos..." />
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Contactos
          </h1>
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
            <div className="p-3 bg-success-500 dark:bg-success-600 rounded-neo shadow-neo">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clientes</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{customersCount}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning-500 dark:bg-warning-600 rounded-neo shadow-neo">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Proveedores</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{suppliersCount}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500 dark:bg-primary-600 rounded-neo shadow-neo">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Empleados</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{employeesCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="md" className="mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">Filtrar por:</span>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-neo text-sm font-medium transition-all duration-200 shadow-sm ${
                filterType === 'all'
                  ? 'bg-primary-500 dark:bg-primary-600 text-white'
                  : 'bg-light-base dark:bg-dark-bg-alt text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Todos ({contacts.length})
            </button>

            <button
              onClick={() => setFilterType('customer')}
              className={`px-4 py-2 rounded-neo text-sm font-medium transition-all duration-200 shadow-sm ${
                filterType === 'customer'
                  ? 'bg-success-500 dark:bg-success-600 text-white'
                  : 'bg-light-base dark:bg-dark-bg-alt text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Clientes ({customersCount})
            </button>

            <button
              onClick={() => setFilterType('supplier')}
              className={`px-4 py-2 rounded-neo text-sm font-medium transition-all duration-200 shadow-sm ${
                filterType === 'supplier'
                  ? 'bg-warning-500 dark:bg-warning-600 text-white'
                  : 'bg-light-base dark:bg-dark-bg-alt text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Proveedores ({suppliersCount})
            </button>

            <button
              onClick={() => setFilterType('employee')}
              className={`px-4 py-2 rounded-neo text-sm font-medium transition-all duration-200 shadow-sm ${
                filterType === 'employee'
                  ? 'bg-primary-500 dark:bg-primary-600 text-white'
                  : 'bg-light-base dark:bg-dark-bg-alt text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Empleados ({employeesCount})
            </button>
          </div>
        </div>
      </Card>

      {/* Contacts list */}
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 dark:border-gray-700 border-t-neo-primary dark:border-t-dark-primary"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Cargando contactos...
            </p>
          </div>
        ) : filteredContacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
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
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-gray-300/50 dark:border-gray-700/50 hover:bg-light-base dark:hover:bg-dark-bg-alt"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500 dark:bg-primary-600 rounded-neo flex items-center justify-center text-white font-bold shadow-neo">
                          {contact.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100">
                            {contact.name}
                          </p>
                          {contact.tax_id && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(contact)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(contact)}
                          className="text-danger-500 dark:text-danger-400 hover:bg-danger-500/10 dark:hover:bg-danger-500/10"
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
            <User className="h-16 w-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
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
          }}
          loading={modalLoading}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deletingContact}
        onClose={() => setDeletingContact(null)}
        title="Eliminar Contacto"
        size="sm"
      >
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-danger-500 dark:text-danger-400 mx-auto mb-4" />

          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            ¿Estás seguro?
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Vas a eliminar el contacto:
          </p>

          <p className="font-semibold text-gray-800 dark:text-gray-100 mb-6">
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

export default ContactsPage
