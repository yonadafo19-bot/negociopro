import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Send, Mic, MicOff, Sparkles, Minimize2, Maximize2, Trash2 } from 'lucide-react'
import { useToast } from '../common'
import { useInventory } from '../../hooks/useInventory'
import { useSales } from '../../hooks/useSales'
import { useContacts } from '../../hooks/useContacts'
import { useAuth } from '../../hooks/useAuth'
import { useReports } from '../../hooks/useReports'
import { supabase } from '../../services/supabase'

const STORAGE_KEY = 'magorya_chat_history'

const MagoryaChat = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const { profile } = useAuth()
  const { createProduct, updateProduct, deleteProduct, products } = useInventory()
  const { createSale, createExpense, sales, expenses } = useSales()
  const { createContact, updateContact, deleteContact, contacts } = useContacts()
  const { stats, getReport } = useReports()

  // Cargar mensajes guardados (memoria persistente)
  const loadMessages = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
    // Mensaje de bienvenida por defecto
    return [{
      id: 1,
      role: 'assistant',
      content: `¡Hola ${profile?.full_name?.split(' ')[0] || 'amiga'}! 💛✨ Soy **Magorya**, tu asistente inteligente.

Tengo acceso a **toda tu información de negocios** y puedo ayudarte con:

📦 **Inventario** - Productos, stock, precios
💰 **Ventas y Gastos** - Transacciones, reportes
👥 **Contactos** - Clientes, proveedores
📊 **Análisis** - Resúmenes, métricas, tendencias
🧭 **Navegación** - Ir a cualquier página

**Pregúntame lo que quieras:**
• "¿Cómo va mi negocio?"
• "¿Cuánto vendí hoy?"
• "Productos con poco stock"
• "Ventas de esta semana"

¡Escribe o háblame! 😊`,
    }]
  }

  const [messages, setMessages] = useState(loadMessages)
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

  // Guardar mensajes automáticamente (memoria persistente)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch (error) {
      console.error('Error saving chat history:', error)
    }
  }, [messages])

  // Función para limpiar historial
  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: `¡Memoria limpiada! 🧹✨\n\nHe olvidado todas nuestras conversaciones anteriores. Podemos empezar de nuevo.\n\n¿En qué te ayudo? 😊`,
    }])
    toast.success('Historial de chat limpiado')
  }

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
  }, [toast])

  // Text-to-Speech
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = SpeechSynthesisUtterance(text.replace(/\*\*/g, ''))
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

  // Obtener resumen del negocio
  const getBusinessSummary = () => {
    const totalProducts = products?.length || 0
    const lowStock = products?.filter(p => p.stock_quantity <= p.min_stock_alert).length || 0
    const totalContacts = contacts?.length || 0
    const customers = contacts?.filter(c => c.contact_type === 'customer').length || 0
    const suppliers = contacts?.filter(c => c.contact_type === 'supplier').length || 0

    const today = new Date()
    const todaySales = sales?.filter(s => {
      const saleDate = new Date(s.transaction_date || s.created_at)
      return saleDate.toDateString() === today.toDateString()
    }).length || 0

    return `📊 **Resumen de tu negocio:**

📦 **Productos:** ${totalProducts} totales
⚠️ **Stock bajo:** ${lowStock} productos necesitan reposición

👥 **Contactos:** ${totalContacts} totales
   • Clientes: ${customers}
   • Proveedores: ${suppliers}

💰 **Ventas hoy:** ${todaySales} transacciones

${lowStock > 0 ? `\n🚨 **Alerta:** Tienes ${lowStock} productos con stock bajo. ¡Revisa tu inventario!` : ''}

${todaySales === 0 ? '\n💡 **Tip:** No tienes ventas hoy. ¿Quieres registrar una?' : ''}`
  }

  // Obtener productos con stock bajo
  const getLowStockProducts = () => {
    const lowStock = products?.filter(p => p.stock_quantity <= p.min_stock_alert) || []
    if (lowStock.length === 0) {
      return '✅ ¡Excelente! Todos tus productos tienen stock suficiente. 📦'
    }
    let response = `⚠️ **Productos con stock bajo:**\n\n`
    lowStock.forEach(p => {
      response += `• **${p.name}** - Stock: ${p.stock_quantity} (mín: ${p.min_stock_alert})\n`
    })
    response += '\n¿Quieres que te lleve al inventario para reponer?'
    return response
  }

  // Obtener ventas del periodo
  const getSalesInfo = (period = 'hoy') => {
    const today = new Date()
    let filteredSales = sales || []

    if (period === 'hoy') {
      filteredSales = sales?.filter(s => {
        const saleDate = new Date(s.transaction_date || s.created_at)
        return saleDate.toDateString() === today.toDateString()
      }) || []
    } else if (period === 'semana') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredSales = sales?.filter(s => {
        const saleDate = new Date(s.transaction_date || s.created_at)
        return saleDate >= weekAgo
      }) || []
    } else if (period === 'mes') {
      const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1)
      filteredSales = sales?.filter(s => {
        const saleDate = new Date(s.transaction_date || s.created_at)
        return saleDate >= monthAgo
      }) || []
    }

    const total = filteredSales.reduce((sum, s) => sum + (s.total || 0), 0)
    const count = filteredSales.length

    return `💰 **Ventas ${period}:**\n\n• Transacciones: ${count}\n• Total: $${total.toLocaleString()}\n\n${count === 0 ? '¿Quieres registrar una venta?' : '¡Buen trabajo! 🎉'}`
  }

  // Buscar producto
  const searchProduct = (query) => {
    const found = products?.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku?.toLowerCase().includes(query.toLowerCase()) ||
      p.category?.toLowerCase().includes(query.toLowerCase())
    ) || []

    if (found.length === 0) {
      return `No encontré ningún producto con "${query}". ¿Quieres crear uno?`
    }

    if (found.length === 1) {
      const p = found[0]
      return `📦 **${p.name}**\n\n• SKU: ${p.sku || 'N/A'}\n• Categoría: ${p.category || 'N/A'}\n• Stock: ${p.stock_quantity}\n• Precio venta: $${p.selling_price}\n• Costo: $${p.cost_price}\n\n${p.stock_quantity <= p.min_stock_alert ? '⚠️ ¡Stock bajo!' : '✅ Stock OK'}`
    }

    let response = `Encontré ${found.length} productos:\n\n`
    found.slice(0, 5).forEach(p => {
      response += `• **${p.name}** - Stock: ${p.stock_quantity} - $${p.selling_price}\n`
    })
    if (found.length > 5) {
      response += `\n... y ${found.length - 5} más.`
    }
    return response
  }

  // Buscar contacto
  const searchContact = (query) => {
    const found = contacts?.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email?.toLowerCase().includes(query.toLowerCase()) ||
      c.phone?.toLowerCase().includes(query.toLowerCase())
    ) || []

    if (found.length === 0) {
      return `No encontré ningún contacto con "${query}". ¿Quieres crear uno?`
    }

    let response = `👥 **Contactos encontrados:**\n\n`
    found.slice(0, 5).forEach(c => {
      const typeEmoji = c.contact_type === 'customer' ? '🛒' : c.contact_type === 'supplier' ? '🚚' : '👤'
      response += `${typeEmoji} **${c.name}** - ${c.contact_type || 'Sin tipo'}\n`
    })
    return response
  }

  // CEREBRO DE MAGORYA - Procesamiento inteligente
  const processCommand = async (userInput) => {
    const input = userInput.toLowerCase().trim()
    setIsProcessing(true)

    try {
      // COMANDOS DE RESUMEN/ESTADO
      if (input.includes('cómo va') || input.includes('como va') || input.includes('estado') ||
          input.includes('resumen') || input.includes('mi negocio') || input.includes('información')) {
        return getBusinessSummary()
      }

      // COMANDOS DE STOCK BAJO
      if (input.includes('stock bajo') || input.includes('poco stock') || input.includes('reponer') ||
          input.includes('falta stock') || input.includes('alerta')) {
        return getLowStockProducts()
      }

      // COMANDOS DE VENTAS
      if (input.includes('venta') || input.includes('vendí') || input.includes('ingresos')) {
        if (input.includes('hoy')) return getSalesInfo('hoy')
        if (input.includes('semana') || input.includes('esta semana')) return getSalesInfo('semana')
        if (input.includes('mes') || input.includes('este mes')) return getSalesInfo('mes')
        if (input.includes('registrar') || input.includes('nueva') || input.includes('crear')) {
          navigate('/app/sales')
          setTimeout(() => {
            const saleBtn = document.querySelector('[data-action="new-sale"]')
            saleBtn?.click()
          }, 500)
          return 'Abriendo formulario de nueva venta 💸'
        }
        return getSalesInfo('hoy')
      }

      // COMANDOS DE PRODUCTOS
      if (input.includes('producto')) {
        // Buscar producto específico
        const searchMatch = input.match(/producto\s+(["']?)(.+?)\1$/i) ||
                            input.match(/buscar\s+(["']?)(.+?)\1$/i) ||
                            input.match(/buscar producto\s+(["']?)(.+?)\1$/i)
        if (searchMatch) {
          return searchProduct(searchMatch[2])
        }

        // Crear producto
        if (input.includes('agrega') || input.includes('crear') || input.includes('nuevo')) {
          const nameMatch = input.match(/producto\s+["']?([^"']+)["']?/i) ||
                          input.match(/agrega\s+["']?([^"']+)["']?/i)
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
            return `✅ ¡Listo! Agregué **"${productName}"** a tu inventario.\n\n¿Quieres agregar algo más?`
          }
          navigate('/app/inventory')
          return 'Te abro el formulario para agregar un producto 📝'
        }

        // Cuántos productos
        if (input.includes('cuántos') || input.includes('cuantos') || input.includes('cuanto')) {
          return `Tienes **${products?.length || 0}** productos en tu inventario 📦`
        }
      }

      // COMANDOS DE CONTACTOS
      if (input.includes('contacto') || input.includes('cliente') || input.includes('proveedor')) {
        const searchMatch = input.match(/(?:contacto|cliente|proveedor)\s+(["']?)(.+?)\1$/i) ||
                            input.match(/buscar\s+(["']?)(.+?)\1$/i)
        if (searchMatch) {
          return searchContact(searchMatch[2])
        }

        if (input.includes('nuevo') || input.includes('crear') || input.includes('agregar')) {
          const nameMatch = input.match(/contacto\s+["']?([^"']+)["']?/i) ||
                          input.match(/cliente\s+["']?([^"']+)["']?/i)
          if (nameMatch) {
            const contactName = nameMatch[1]
            await createContact({
              name: contactName,
              contact_type: 'customer',
            })
            return `✅ ¡Perfecto! Creé el contacto de **"${contactName}"** 👥`
          }
          navigate('/app/contacts')
          return 'Te llevo a contactos para crear uno nuevo 📝'
        }

        if (input.includes('cuántos') || input.includes('cuantos')) {
          return `Tienes **${contacts?.length || 0}** contactos registrados 👥`
        }
      }

      // BÚSQUEDA GENERAL
      if (input.includes('buscar') && !input.includes('producto') && !input.includes('contacto')) {
        const query = input.replace(/buscar\s+/, '').trim()
        // Buscar en productos y contactos
        const productResults = searchProduct(query)
        const contactResults = searchContact(query)
        return `📦 **Productos:**\n${productResults}\n\n👥 **Contactos:**\n${contactResults}`
      }

      // COMANDOS DE NAVEGACIÓN
      if (input.includes('ir a') || input.includes('ve a') || input.includes('navega') ||
          input.includes('abre') || input.includes('llevara') || input.includes('llévame')) {
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
        if (input.includes('reporte') || input.includes('reportes') || input.includes('analític')) {
          navigate('/app/reports')
          return '¡Tus reportes están aquí! 📊'
        }
        if (input.includes('catalogo') || input.includes('catálogo')) {
          navigate('/app/catalogs')
          return '¡Abriendo catálogos! 📚'
        }
        if (input.includes('ajuste') || input.includes('configuración') || input.includes('settings')) {
          navigate('/app/settings')
          return '¡Allá vamos a la configuración! ⚙️'
        }
        if (input.includes('dashboard') || input.includes('inicio') || input.includes('home')) {
          navigate('/app/dashboard')
          return '¡Volviendo al inicio! 🏠'
        }
      }

      // COMANDOS DE AYUDA
      if (input.includes('ayuda') || input.includes('help') || input.includes('qué puedes') ||
          input.includes('¿qué haces') || input.includes('qué hace') || input.includes('qué puedes hacer')) {
        return `¡Claro que te ayudo! 😊 Soy Magorya y **tengo acceso a toda tu información de negocios**.

**Lo que puedo hacer:**

📊 **Análisis del negocio:**
• "¿Cómo va mi negocio?"
• "Resumen de hoy"
• "Productos con stock bajo"

💰 **Ventas:**
• "¿Cuánto vendí hoy/semana/mes?"
• "Registrar nueva venta"
• "Ventas del periodo"

📦 **Productos:**
• "Buscar producto X"
• "Agrega producto nombre"
• "¿Cuántos productos tengo?"

👥 **Contactos:**
• "Buscar cliente X"
• "Crear contacto Juan"
• "¿Cuántos clientes?"

🧭 **Navegación:**
• "Ir a inventario/ventas/contactos"
• "Ve a reportes"

¡Solo dime qué necesitas! 💪✨`
      }

      // RESPUESTAS AMIGABLES POR DEFECTO
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

    await new Promise((resolve) => setTimeout(resolve, 500))

    const response = await processCommand(input)
    const assistantMessage = { id: Date.now() + 1, role: 'assistant', content: response }
    setMessages((prev) => [...prev, assistantMessage])

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
                <p className="text-white/70 text-xs">Asistente Inteligente</p>
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
          {!isMinimized && (
            <button
              onClick={clearHistory}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Limpiar historial"
              title="Limpiar historial"
            >
              <Trash2 className="h-4 w-4 text-white" />
            </button>
          )}
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
                  className={`max-w-[85%] p-3 rounded-2xl ${
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
                placeholder="Pregunta lo que quieras... 🎤"
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
