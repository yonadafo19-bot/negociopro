import { useState } from 'react'
import { useSales } from '../hooks/useSales'
import { Card, Button, Modal, Badge, PageLoader, useToast } from '../components/common'
import {
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Calculator,
  Mail,
  AlertCircle,
} from 'lucide-react'
import { SaleForm, ExpenseForm, CashRegisterClosing } from '../components/sales'
import { EmailButton } from '../components/common'

const SalesPage = () => {
  const toast = useToast()

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
  const [showClosingModal, setShowClosingModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
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

    const { error } = await createSale(saleData)

    setModalLoading(false)

    if (error) {
      toast.error(`Error al registrar venta: ${error.message}`)
    } else {
      toast.success('Venta registrada correctamente')
      setShowSaleModal(false)
    }
  }

  const handleExpenseSubmit = async (expenseData) => {
    setModalLoading(true)

    const { error } = await createExpense(expenseData)

    setModalLoading(false)

    if (error) {
      toast.error(`Error al registrar gasto: ${error.message}`)
    } else {
      toast.success('Gasto registrado correctamente')
      setShowExpenseModal(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Ventas y Gastos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Registra y gestiona tus transacciones
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowClosingModal(true)}
            icon={Calculator}
          >
            Cierre de Caja
          </Button>
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
            <div className="p-3 bg-success-500 dark:bg-success-600 rounded-neo shadow-neo">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ventas totales
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(totalSales)}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-danger-500 dark:bg-danger-600 rounded-neo shadow-neo">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gastos totales
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500 dark:bg-primary-600 rounded-neo shadow-neo">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(totalSales - totalExpenses)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Transacciones Recientes
          </h3>
          <Badge variant="secondary">{salesCount} ventas</Badge>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 dark:border-gray-700 border-t-neo-primary dark:border-t-dark-primary"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Cargando transacciones...
            </p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
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
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-300/50 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-100">
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
                    <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-100">
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
                    <td className="py-3 px-4 text-center">
                      {transaction.transaction_type === 'sale' &&
                        transaction.contacts?.email ? (
                          <EmailButton
                            type="sale-receipt"
                            data={{ transaction, items: transaction.transaction_items || [] }}
                            emailAddress={transaction.contacts.email}
                            variant="email"
                            size="sm"
                            showIcon={true}
                          >
                            <Mail className="h-4 w-4" />
                          </EmailButton>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-500 text-xs">-</span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
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
        }}
        title="Nueva Venta"
        size="xl"
      >
        <SaleForm
          onSubmit={handleSaleSubmit}
          onCancel={() => {
            setShowSaleModal(false)
          }}
          loading={modalLoading}
        />
      </Modal>

      {/* Expense modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => {
          setShowExpenseModal(false)
        }}
        title="Registrar Gasto de Caja Chica"
        size="lg"
      >
        <ExpenseForm
          onSubmit={handleExpenseSubmit}
          onCancel={() => {
            setShowExpenseModal(false)
          }}
          loading={modalLoading}
        />
      </Modal>

      {/* Cash register closing modal */}
      <Modal
        isOpen={showClosingModal}
        onClose={() => setShowClosingModal(false)}
        title=""
        size="xl"
        showCloseButton={false}
      >
        <CashRegisterClosing
          transactions={transactions}
          onClose={() => setShowClosingModal(false)}
        />
      </Modal>
    </div>
  )
}

export default SalesPage
