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
          <h1 className="text-3xl font-bold text-neo-text dark:text-dark-text mb-2">
            Ventas y Gastos
          </h1>
          <p className="text-neo-text-muted dark:text-dark-text-muted">
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
            <div className="p-3 bg-neo-success dark:bg-dark-success rounded-neo shadow-neo">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-neo-text-muted dark:text-dark-text-muted">
                Ventas totales
              </p>
              <p className="text-2xl font-bold text-neo-text dark:text-dark-text">
                {formatCurrency(totalSales)}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neo-danger dark:bg-dark-danger rounded-neo shadow-neo">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-neo-text-muted dark:text-dark-text-muted">
                Gastos totales
              </p>
              <p className="text-2xl font-bold text-neo-text dark:text-dark-text">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neo-primary dark:bg-dark-primary rounded-neo shadow-neo">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-neo-text-muted dark:text-dark-text-muted">Balance</p>
              <p className="text-2xl font-bold text-neo-text dark:text-dark-text">
                {formatCurrency(totalSales - totalExpenses)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neo-text dark:text-dark-text">
            Transacciones Recientes
          </h3>
          <Badge variant="secondary">{salesCount} ventas</Badge>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-neo-border dark:border-dark-border border-t-neo-primary dark:border-t-dark-primary"></div>
            <p className="mt-2 text-neo-text-muted dark:text-dark-text-muted">
              Cargando transacciones...
            </p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neo-border dark:border-dark-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neo-text-muted dark:text-dark-text-muted">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neo-text-muted dark:text-dark-text-muted">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neo-text-muted dark:text-dark-text-muted">
                    Monto
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neo-text-muted dark:text-dark-text-muted">
                    Cliente
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neo-text-muted dark:text-dark-text-muted">
                    Estado
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-neo-text-muted dark:text-dark-text-muted">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-neo-border/50 dark:border-dark-border/50 hover:bg-neo-bg dark:hover:bg-dark-bg-alt"
                  >
                    <td className="py-3 px-4 text-sm text-neo-text dark:text-dark-text">
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
                    <td className="py-3 px-4 text-sm font-medium text-neo-text dark:text-dark-text">
                      {formatCurrency(transaction.total_amount)}
                    </td>
                    <td className="py-3 px-4 text-sm text-neo-text-muted dark:text-dark-text-muted">
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
                          <span className="text-neo-text-light dark:text-dark-text-light text-xs">-</span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-neo-text-muted dark:text-dark-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neo-text dark:text-dark-text mb-2">
              Sin transacciones
            </h3>
            <p className="text-neo-text-muted dark:text-dark-text-muted mb-6">
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
