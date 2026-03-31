import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Send, Mic, MicOff, Sparkles, Minimize2, Maximize2 } from 'lucide-react'
import { useToast } from '../common'
import { useInventory } from '../../hooks/useInventory'
import { useSales } from '../../hooks/useSales'
import { useContacts } from '../../hooks/useContacts'
import { useAuth } from '../../hooks/useAuth'

const MagoryaChat = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const { profile } = useAuth()
  const { createProduct, updateProduct, deleteProduct, products } = useInventory()
  const { createSale, createExpense } = useSales()
  const { createContact, updateContact, deleteContact, contacts } = useContacts()

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `¡Hola ${profile?.full_name?.split(' ')[0] || 'amiga'}! 💛✨ Soy Magorya, tu asistente personal. ¿En qué te ayudo hoy? Puedo:

📦 **Inventario:** Agregar, editar o eliminar productos
💰 **Ventas:** Registrar ventas o gastos
👥 **Contactos:** Crear o gestionar contactos
🧭 **Navegación:** Llevarte a cualquier página

¡Escribe o háblame y te ayudo! 😊`,
    },
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Configurar Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'es-ES'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
        toast.error('No pude escucharte bien. Intenta de nuevo.')
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  // Text-to-Speech
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 1.0
      utterance.pitch = 1.1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Tu navegador no soporta reconocimiento de voz')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Procesar comandos - El cerebro de Magorya
  const processCommand = async (userInput) => {
    const input = userInput.toLowerCase().trim()
    setIsProcessing(true)

    try {
      // COMANDOS DE NAVEGACIÓN
      if (input.includes('ir a') || input.includes('ve a') || input.includes('navega') || input.includes('abre')) {
        if (input.includes('inventario') || input.includes('productos')) {
          navigate('/app/inventory')
          return '¡Te llevo al inventario! 📦'
        }
        if (input.includes('venta') || input.includes('ventas') || input.includes('pos')) {
          navigate('/app/sales')
          return '¡Vamos a las ventas! 💰'
        }
        if (input.includes('contacto') || input.includes('clientes')) {
          navigate('/app/contacts')
          return '¡Allá vamos a tus contactos! 👥'
        }
        if (input.includes('reporte') || input.includes('reportes')) {
          navigate('/app/reports')
          return '¡Tus reportes están aquí! 📊'
        }
        if (input.includes('dashboard') || input.includes('inicio')) {
          navigate('/app/dashboard')
          return '¡Volviendo al inicio! 🏠'
        }
      }

      // COMANDOS DE INVENTARIO - CREAR
      if (input.includes('agrega') || input.includes('crear') || input.includes('nuevo producto')) {
        const nameMatch = input.match(/producto\s+["']?([^"']+)["']?/i) || input.match(/agrega\s+["']?([^"']+)["']?/i)
        if (nameMatch) {
          const productName = nameMatch[1]
          await createProduct({
            name: productName,
            sku: `SKU-${Date.now()}`,
            category: 'General',
            cost_price: 1000,
            selling_price: 1500,
            stock_quantity: 10,
          })
          return `¡Listo! Agregué "${productName}" a tu inventario ✨¿Quiéres agregar algo más?`
        }
        navigate('/app/inventory')
        return 'Te abro el formulario para que agregues tu producto 📝'
      }

      // COMANDOS DE VENTAS
      if (input.includes('venta') || input.includes('vender')) {
        if (input.includes('registrar') || input.includes('nueva')) {
          navigate('/app/sales')
          setTimeout(() => {
            // Trigger open modal if possible
            const saleBtn = document.querySelector('[data-action="new-sale"]')
            saleBtn?.click()
          }, 500)
          return '¡Abriendo formulario de venta! 💸'
        }
      }

      // COMANDOS DE CONTACTOS
      if (input.includes('contacto') && (input.includes('nuevo') || input.includes('crear') || input.includes('agregar'))) {
        const nameMatch = input.match(/contacto\s+["']?([^"']+)["']?/i)
        if (nameMatch) {
          const contactName = nameMatch[1]
          await createContact({
            name: contactName,
            contact_type: 'customer',
          })
          return `¡Perfecto! Creé el contacto de "${contactName}" 👥`
        }
        navigate('/app/contacts')
        return 'Te llevo a contactos para crear uno nuevo 📝'
      }

      // COMANDOS DE AYUDA
      if (input.includes('ayuda') || input.includes('help') || input.includes('qué puedes') || input.includes('¿qué haces')) {
        return `¡Claro que te ayudo! 😊 Puedo hacer:

📦 **Productos:** "Agrega producto X" o "Crea producto Y"
💰 **Ventas:** "Registrar venta" o "Nueva venta"
👥 **Contactos:** "Crear contacto Juan"
🧭 **Navegar:** "Ir a inventario" o "Ve a ventas"
❓ **Preguntar:** "¿Cuántos productos tengo?"

¡Solo dime qué necesitas! 💪`
      }

      // PREGUNTAS SOBRE DATOS
      if (input.includes('cuántos') || input.includes('cuanto')) {
        if (input.includes('producto')) {
          return `Tienes ${products.length} productos en tu inventario 📦`
        }
        if (input.includes('contacto') || input.includes('cliente')) {
          return `Tienes ${contacts.length} contactos registrados 👥`
        }
      }

      // RESPUESTA AMIGABLE POR DEFECTO
      const responses = [
        `¡Interesante! ¿Podrías darme más detalles? 🤔`,
        `¡Claro! ¿Qué más necesitas? 💛`,
        `¡Entendido! ¿Hay algo más en lo que pueda ayudarte? ✨`,
        `¡Perfecto! ¿Te ayudo con algo más? 😊`,
        `¡Super! ¿Qué más quieres hacer? 💪`,
      ]
      return responses[Math.floor(Math.random() * responses.length)]

    } catch (error) {
      console.error('Error procesando comando:', error)
      return `¡Ups! Tuve un problema: ${error.message}. ¿Intentamos de otra forma? 😅`
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage = { id: Date.now(), role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    // Simular pequeño delay para naturalidad
    await new Promise((resolve) => setTimeout(resolve, 500))

    const response = await processCommand(input)
    const assistantMessage = { id: Date.now() + 1, role: 'assistant', content: response }
    setMessages((prev) => [...prev, assistantMessage])

    // Hablar la respuesta
    speak(response)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 bg-neo-surface dark:bg-dark-surface rounded-2xl shadow-2xl border border-neo-border dark:border-dark-border overflow-hidden transition-all duration-300 ${
        isMinimized ? 'w-16 h-16' : 'w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-neo-primary to-neo-accent dark:from-dark-primary dark:to-dark-accent p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            {!isMinimized && (
              <>
                <h3 className="text-white font-semibold text-sm">Magorya ✨</h3>
                <p className="text-white/70 text-xs">Tu asistente virtual</p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isMinimized ? 'Maximizar' : 'Minimizar'}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4 text-white" /> : <Minimize2 className="h-4 w-4 text-white" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Cerrar chat"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[460px] overflow-y-auto p-4 space-y-4 bg-neo-bg dark:bg-dark-bg">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-neo-primary dark:bg-dark-primary text-white'
                      : 'bg-neo-surface dark:bg-dark-surface text-neo-text dark:text-dark-text border border-neo-border dark:border-dark-border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-neo-surface dark:bg-dark-surface p-3 rounded-2xl border border-neo-border dark:border-dark-border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-neo-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-neo-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-neo-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neo-border dark:border-dark-border bg-neo-surface dark:bg-dark-surface">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleListening}
                disabled={!recognitionRef.current}
                className={`p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-neo-danger dark:bg-dark-danger text-white animate-pulse'
                    : 'bg-neo-bg dark:bg-dark-bg text-neo-text dark:text-dark-text hover:bg-neo-bg-alt dark:hover:bg-dark-bg-alt'
                }`}
                aria-label={isListening ? 'Detener grabación' : 'Iniciar grabación'}
              >
                {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe o usa el micrófono 🎤"
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-neo-bg dark:bg-dark-bg border border-neo-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neo-primary dark:focus:ring-dark-primary text-neo-text dark:text-dark-text text-sm disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className="p-2 bg-neo-primary dark:bg-dark-primary text-white rounded-lg hover:bg-neo-primary-light dark:hover:bg-dark-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Enviar mensaje"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            {isListening && (
              <p className="text-xs text-neo-text-muted dark:text-dark-text-muted mt-2 text-center animate-pulse">
                🎤 Te estoy escuchando...
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default MagoryaChat
