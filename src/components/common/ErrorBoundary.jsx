import React from 'react'
import { Card, Button } from './index'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

/**
 * Error Boundary - Captura errores en React
 * Protege la aplicación de crashes completos
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })

    // Opcional: Enviar error a servicio de monitoreo
    // this.logErrorToService(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <Card className="max-w-lg w-full" padding="lg">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ¡Algo salió mal!
              </h1>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Ha ocurrido un error inesperado. No te preocupes, nuestros desarrolladores han sido
                notificados.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                  <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                    Error details (dev mode):
                  </p>
                  <pre className="text-xs text-red-700 dark:text-red-500 overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={this.handleReset} icon={RefreshCw} className="flex-1">
                  Intentar de nuevo
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  icon={Home}
                  className="flex-1"
                >
                  Ir al inicio
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
