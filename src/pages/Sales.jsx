import { useState } from 'react'
import { useSales } from '../hooks/useSales'
import { Card, Button, Modal, Badge } from '../components/common'
import { Plus, DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { SaleForm } from '../components/sales'

const SalesPage = () => {
  const {
    transactions,
    loading,
    createSale,
    createExpense,
    totalSales,
    totalExpenses,
    salesCount,
  } = useSales()

  const [showSaleModal, setShowSaleModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleSaleSubmit = async (saleData) => {
    setModalLoading(true)
    setMessage({ type: '', text: '' })

    const { error } = await createSale(saleData)

    setModalLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({
        type: 'success',
        text: 'Venta registrada correctamente',
      })
      setShowSaleModal(false)
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleExpenseSubmit = async (expenseData) => {
    setModalLoading(true)
    setMessage({ type: '', text: '' })

    const { error } = await createExpense(expenseData)

    setModalLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({
        type: 'success',
        text: 'Gasto registrado correctamente',
      })
      setShowExpenseModal(false)
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ventas y Gastos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Registra y gestiona tus transacciones
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowExpenseModal(true)}
            icon={TrendingDown}
          >
            Registrar Gasto
          </Button>
          <Button onClick={() => setShowSaleModal(true)} icon={Plus}>
            Nueva Venta
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-kawaii">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ventas totales
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalSales)}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500 rounded-kawaii">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gastos totales
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500 rounded-kawaii">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Balance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalSales - totalExpenses)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-kawaii flex items-start gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          <DollarSign className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Recent transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transacciones Recientes
          </h3>
          <Badge variant="secondary">{salesCount} ventas</Badge>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Cargando transacciones...
            </p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monto
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Cliente
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {formatDate(transaction.transaction_date)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          transaction.transaction_type === 'sale'
                            ? 'success'
                            : transaction.transaction_type === 'expense'
                            ? 'danger'
                            : 'primary'
                        }
                        size="sm"
                      >
                        {transaction.transaction_type === 'sale'
                          ? 'Venta'
                          : transaction.transaction_type === 'expense'
                          ? 'Gasto'
                          : 'Ingreso'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(transaction.total_amount)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {transaction.contacts?.name || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          transaction.status === 'completed'
                            ? 'success'
                            : transaction.status === 'pending'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {transaction.status === 'completed'
                          ? 'Completado'
                          : transaction.status === 'pending'
                          ? 'Pendiente'
                          : 'Cancelado'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sin transacciones
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Empieza registrando tu primera venta
            </p>
            <Button onClick={() => setShowSaleModal(true)} icon={Plus}>
              Registrar Venta
            </Button>
          </div>
        )}
      </Card>

      {/* Sale modal */}
      <Modal
        isOpen={showSaleModal}
        onClose={() => {
          setShowSaleModal(false)
          setMessage({ type: '', text: '' })
        }}
        title="Nueva Venta"
        size="xl"
      >
        <SaleForm
          onSubmit={handleSaleSubmit}
          onCancel={() => {
            setShowSaleModal(false)
            setMessage({ type: '', text: '' })
          }}
          loading={modalLoading}
        />

        {message.text && (
          <div className="mt-4 p-3 rounded-kawaii text-sm text-center">
            {message.text}
          </div>
        )}
      </Modal>

      {/* Expense modal placeholder */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Registrar Gasto"
        size="lg"
      >
        <div className="text-center py-8">
          <TrendingDown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Registro de Gastos
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Próximamente... Podrás registrar gastos operativos
          </p>
          <Button
            onClick={() => setShowExpenseModal(false)}
            variant="outline"
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default SalesPage