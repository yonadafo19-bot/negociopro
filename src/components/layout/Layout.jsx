import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Header from './Header'
import Sidebar from './Sidebar'
import { MagoryaChat } from '../chat'
import { Sparkles, X } from 'lucide-react'

const Layout = () => {
  const { loading } = useAuth()
  const [showChat, setShowChat] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header />

      {/* Sidebar (desktop) */}
      <Sidebar />

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-neo-primary to-neo-accent dark:from-dark-primary dark:to-dark-accent text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          aria-label="Abrir asistente Magorya"
        >
          <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Magorya Chat */}
      <MagoryaChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}

export default Layout
