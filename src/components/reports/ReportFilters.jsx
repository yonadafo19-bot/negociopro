import { useState } from 'react'
import { Card, CardContent, Button } from '../common'
import { Calendar, Filter } from 'lucide-react'

const ReportFilters = ({ onFilter, loading = false }) => {
  const [dateRange, setDateRange] = useState('30days') // 7days, 30days, 90days, all
  const [transactionType, setTransactionType] = useState('all') // all, sale, expense

  const handleApplyFilter = () => {
    onFilter({
      dateRange,
      transactionType,
    })
  }

  const handleReset = () => {
    setDateRange('30days')
    setTransactionType('all')
    onFilter({
      dateRange: '30days',
      transactionType: 'all',
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date range selector */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-neo text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="7days">Últimos 7 días</option>
              <option value="30days">Últimos 30 días</option>
              <option value="90days">Últimos 90 días</option>
              <option value="all">Todo el historial</option>
            </select>
          </div>

          {/* Transaction type selector */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <select
              value={transactionType}
              onChange={e => setTransactionType(e.target.value)}
              className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-neo text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Todo</option>
              <option value="sale">Solo ventas</option>
              <option value="expense">Solo gastos</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={loading}>
              Limpiar
            </Button>
            <Button size="sm" onClick={handleApplyFilter} loading={loading}>
              Aplicar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReportFilters
