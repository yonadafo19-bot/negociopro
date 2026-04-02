import { useState, useEffect, useMemo } from 'react'
import { Card, Button, Badge, Modal, Input } from '../common'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Printer,
  X,
  Calendar,
  Clock,
  CheckCircle,
  Mail,
} from 'lucide-react'
import { EmailButton } from '../common'

const CashRegisterClosing = ({ transactions, onClose, onPrint }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')

  // Filtrar transacciones del día seleccionado
  const daysTransactions = useMemo(() => {
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    return transactions.filter(t => {
      const txDate = new Date(t.transaction_date)
      return txDate >= startOfDay && txDate <= endOfDay
    })
  }, [transactions, selectedDate])

  // Calcular totales
  const summary = useMemo(() => {
    const sales = daysTransactions.filter(t => t.transaction_type === 'sale')
    const expenses = daysTransactions.filter(t => t.transaction_type === 'expense')

    const salesByMethod = {
      cash: sales
        .filter(s => s.payment_method === 'cash')
        .reduce((sum, s) => sum + parseFloat(s.total_amount), 0),
      card: sales
        .filter(s => s.payment_method === 'card')
        .reduce((sum, s) => sum + parseFloat(s.total_amount), 0),
      transfer: sales
        .filter(s => s.payment_method === 'transfer')
        .reduce((sum, s) => sum + parseFloat(s.total_amount), 0),
    }

    const expensesByCategory = expenses.reduce((acc, e) => {
      const category = e.notes?.split(':')[0] || 'otros'
      acc[category] = (acc[category] || 0) + parseFloat(e.total_amount)
      return acc
    }, {})

    return {
      totalSales: sales.reduce((sum, s) => sum + parseFloat(s.total_amount), 0),
      totalExpenses: expenses.reduce((sum, e) => sum + parseFloat(e.total_amount), 0),
      salesCount: sales.length,
      expensesCount: expenses.length,
      netAmount:
        sales.reduce((sum, s) => sum + parseFloat(s.total_amount), 0) -
        expenses.reduce((sum, e) => sum + parseFloat(e.total_amount), 0),
      salesByMethod,
      expensesByCategory,
    }
  }, [daysTransactions])

  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  const formatDate = date => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  const handleToday = () => {
    setSelectedDate(new Date())
  }

  const isToday = () => {
    const today = new Date()
    return selectedDate.toDateString() === today.toDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header con selector de fecha */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cierre de Caja</h2>
          <p className="text-gray-600 dark:text-gray-400">Resumen de transacciones del día</p>
        </div>
        <Button variant="ghost" onClick={onClose} icon={X}>
          Cerrar
        </Button>
      </div>

      {/* Selector de fecha */}
      <Card padding="md">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePreviousDay} size="sm">
            ← Anterior
          </Button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatDate(selectedDate)}
              </p>
            </div>
            {!isToday() && (
              <button
                onClick={handleToday}
                className="mt-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Ir a hoy
              </button>
            )}
          </div>

          <Button variant="outline" onClick={handleNextDay} size="sm" disabled={isToday()}>
            Siguiente →
          </Button>
        </div>
      </Card>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="md" className="border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-neo">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(summary.totalSales)}
              </p>
              <p className="text-xs text-gray-500">
                {summary.salesCount} venta{summary.salesCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" className="border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500 rounded-neo">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gastos del Día</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(summary.totalExpenses)}
              </p>
              <p className="text-xs text-gray-500">
                {summary.expensesCount} gasto{summary.expensesCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md" className="border-primary-200 dark:border-primary-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500 rounded-neo">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Balance Neto</p>
              <p
                className={`text-2xl font-bold ${
                  summary.netAmount >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {formatCurrency(Math.abs(summary.netAmount))}
              </p>
              <p className="text-xs text-gray-500">
                {summary.netAmount >= 0 ? 'Positivo' : 'Negativo'}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-500 rounded-neo">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Transacciones</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary.salesCount + summary.expensesCount}
              </p>
              <p className="text-xs text-gray-500">Operaciones</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Desglose por método de pago */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Ventas por Método de Pago
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-neo">
            <div className="flex items-center gap-2">
              <span>💵</span>
              <span className="font-medium text-gray-900 dark:text-white">Efectivo</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(summary.salesByMethod.cash)}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-neo">
            <div className="flex items-center gap-2">
              <span>💳</span>
              <span className="font-medium text-gray-900 dark:text-white">Tarjeta</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(summary.salesByMethod.card)}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-neo">
            <div className="flex items-center gap-2">
              <span>🏦</span>
              <span className="font-medium text-gray-900 dark:text-white">Transferencia</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(summary.salesByMethod.transfer)}
            </span>
          </div>
        </div>
      </Card>

      {/* Desglose de gastos por categoría */}
      {summary.expensesCount > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Gastos por Categoría
          </h3>
          <div className="space-y-2">
            {Object.entries(summary.expensesByCategory).map(([category, amount]) => (
              <div
                key={category}
                className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-neo"
              >
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {category}
                </span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Resumen final */}
      <Card className="bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-300 dark:border-primary-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total a Depositar/Arquear</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Incluye efectivo de ventas menos gastos pagados en efectivo
            </p>
          </div>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {formatCurrency(summary.salesByMethod.cash - summary.totalExpenses)}
          </p>
        </div>
      </Card>

      {/* Acciones */}
      <div className="flex gap-3">
        <Button
          className="flex-1"
          icon={Mail}
          onClick={() => setShowEmailModal(true)}
          variant="outline"
        >
          Enviar por Email
        </Button>
        <Button className="flex-1" icon={Printer} onClick={() => onPrint && onPrint(summary)}>
          Imprimir Reporte
        </Button>
        <Button variant="outline" className="flex-1" icon={CheckCircle} onClick={onClose}>
          Confirmar Cierre
        </Button>
      </div>

      {/* Modal para enviar email */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Enviar Reporte por Email"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Se abrirá tu cliente de correo con el reporte del cierre de caja.
          </p>

          <Input
            label="Dirección de Email"
            type="email"
            placeholder="admin@tuempresa.com"
            value={emailAddress}
            onChange={e => setEmailAddress(e.target.value)}
            required
            icon={Mail}
          />

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-neo">
            <p className="text-sm text-blue-800 dark:text-blue-400">💡 El reporte incluirá:</p>
            <ul className="text-sm text-blue-700 dark:text-blue-500 mt-2 space-y-1">
              <li>• Resumen de ventas totales</li>
              <li>• Desglose por método de pago</li>
              <li>• Todos los gastos registrados</li>
              <li>• Balance neto del día</li>
              <li>• Total a depositar/arquear</li>
            </ul>
          </div>

          <EmailButton
            type="cash-closing"
            data={summary}
            emailAddress={emailAddress}
            onSuccess={() => {
              setShowEmailModal(false)
              setEmailAddress('')
            }}
            className="w-full"
          >
            <Mail className="h-4 w-4" />
            Abrir Cliente de Correo
          </EmailButton>

          <Button variant="ghost" onClick={() => setShowEmailModal(false)} className="w-full">
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default CashRegisterClosing
