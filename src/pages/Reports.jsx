import { useState } from 'react'
import { useReports } from '../hooks/useReports'
import { Card, CardHeader, CardTitle, CardContent, Button, PageLoader } from '../components/common'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { FileSpreadsheet, TrendingUp, Calendar, Download, FileText } from 'lucide-react'
import {
  ReportFilters,
  TopProducts,
  TopCustomers,
  SalesByCategory,
  PerformanceMetrics,
  PaymentMethodMetrics,
} from '../components/reports'

const ReportsPage = () => {
  const {
    topProducts,
    salesByPeriod,
    salesByCategory,
    topCustomers,
    performanceMetrics,
    comparisons,
    salesByPaymentMethod,
    exportToExcel,
    exportToPDF,
    hasData,
  } = useReports()

  const [loadingExport, setLoadingExport] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)

  // Mostrar PageLoader mientras carga inicialmente
  if (!hasData && !topProducts.length && !salesByPeriod.length) {
    return <PageLoader text="Cargando reportes..." />
  }

  const formatCurrency = value => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const handleExportExcel = async () => {
    setLoadingExport(true)
    try {
      await exportToExcel()
    } catch (error) {
      console.error('Error exporting:', error)
    } finally {
      setLoadingExport(false)
    }
  }

  const handleExportPDF = () => {
    setLoadingPDF(true)
    try {
      exportToPDF()
    } catch (error) {
      console.error('Error exporting PDF:', error)
    } finally {
      setLoadingPDF(false)
    }
  }

  // Preparar datos para gráfico de línea (ventas por periodo)
  const salesTrendData = salesByPeriod.slice(-30).map(item => ({
    name: new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    amount: item.amount,
    count: item.count,
  }))

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reportes y Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Análisis detallado de tu negocio</p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleExportPDF}
            disabled={!hasData || loadingPDF}
            loading={loadingPDF}
            icon={FileText}
            variant="outline"
          >
            PDF
          </Button>
          <Button
            onClick={handleExportExcel}
            disabled={!hasData || loadingExport}
            loading={loadingExport}
            icon={FileSpreadsheet}
          >
            Excel
          </Button>
        </div>
      </div>

      {!hasData ? (
        <Card>
          <div className="text-center py-12">
            <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sin datos suficientes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Registra algunas ventas para poder ver los reportes
            </p>
            <Button onClick={() => (window.location.href = '/sales')}>Ir a Ventas</Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Filters */}
          <ReportFilters />

          {/* Performance Metrics */}
          <div className="mb-6">
            <PerformanceMetrics metrics={performanceMetrics} comparisons={comparisons} />
          </div>

          {/* Payment Method Metrics */}
          <div className="mb-6">
            <PaymentMethodMetrics
              salesByPaymentMethod={salesByPaymentMethod}
              totalRevenue={performanceMetrics.totalRevenue}
            />
          </div>

          {/* Charts and Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Sales trend chart */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tendencia de Ventas
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesTrendData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-gray-200 dark:stroke-gray-700"
                        />
                        <XAxis
                          dataKey="name"
                          className="text-sm text-gray-600 dark:text-gray-400"
                        />
                        <YAxis
                          className="text-sm text-gray-600 dark:text-gray-400"
                          tickFormatter={value => `$${value}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                          }}
                          formatter={value => formatCurrency(value)}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="stroke-primary-500 dark:stroke-primary-400"
                          dot={{ fill: 'currentColor', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sales by category pie chart */}
            <div>
              <SalesByCategory data={salesByCategory} />
            </div>
          </div>

          {/* Top products and customers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopProducts products={topProducts} />
            <TopCustomers customers={topCustomers} />
          </div>
        </>
      )}
    </div>
  )
}

export default ReportsPage
