import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ConnectionProvider } from './context/ConnectionContext'
import { ColorProvider } from './context/ColorContext'
import { ToastProvider } from './components/common'
import { GoogleAnalytics } from './components/analytics'
import AppRoutes from './routes'
import ConnectionStatus from './components/connection/ConnectionStatus'
import { useEffect } from 'react'

function App() {
  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration)
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error)
        })
    }
  }, [])

  return (
    <BrowserRouter>
      <ThemeProvider>
        <ColorProvider>
          <AuthProvider>
            <ConnectionProvider>
              <ToastProvider>
                {/* Google Analytics - Add your Measurement ID */}
                <GoogleAnalytics measurementId={import.meta.env.VITE_GA_MEASUREMENT_ID || ''} />
                <AppRoutes />
                <ConnectionStatus />
              </ToastProvider>
            </ConnectionProvider>
          </AuthProvider>
        </ColorProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
