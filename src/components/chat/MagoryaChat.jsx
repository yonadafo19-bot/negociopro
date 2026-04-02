import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Send, Mic, MicOff, Sparkles, Minimize2, Maximize2, Trash2, Package, DollarSign, Users, BookOpen, BarChart3, Settings } from 'lucide-react'
import { useToast } from '../common'
import { useInventory } from '../../hooks/useInventory'
import { useSales } from '../../hooks/useSales'
import { useContacts } from '../../hooks/useContacts'
import { useAuth } from '../../hooks/useAuth'
import { useCatalogs } from '../../hooks/useCatalogs'
import { notify } from '../../services/notificationsService'

const STORAGE_KEY = 'magorya_chat_history'

const MagoryaChat = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const { profile, user } = useAuth()
  const { createProduct, products, updateProduct } = useInventory()
  const { createSale, transactions } = useSales()
  const { createContact, contacts } = useContacts()
  const { createCatalog } = useCatalogs()

  const loadMessages = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
    return [{
      id: 1,
      role: 'assistant',
      content: `¡Hola ${profile?.full_name?.split(' ')[0] || 'amiga'}! 💛✨ Soy **Magorya**, tu asistente inteligente.

**Puedo ayudarte con TODO tu negocio:**

🧭 **Navegación rápida:**
• "inventario" / "productos" / "ir a productos"
• "ventas" / "ir a ventas"
• "contactos" / "clientes"
• "reportes" / "estadísticas"
• "catálogos"
• "configuración"

📦 **Inventario - CREAR productos:**
• "crear producto nombre [nombre] precio [precio] stock [stock]"
• Ej: "crear producto Leche precio 1500 stock 50"
• "nuevo producto Pan precio 800 stock 100"

💰 **Ventas - REGISTRAR ventas:**
• "registrar venta [total] por [producto]"
• Ej: "venta de 5000 por Leche"
• "nueva venta 10000"

👥 **Contactos - CREAR clientes:**
• "crear cliente [nombre] telefono [fono] email [email]"
• Ej: "crear cliente Juan telefono 98765432"

📚 **Catálogos - CREAR catálogos:**
• "crear catalogo [nombre]"

📊 **Consultas del negocio:**
• "¿cómo va mi negocio?"
• "ventas de hoy"
• "productos con stock bajo"
• "resumen"

💬 **Escribe o usa el micrófono 🎤**

¡Puedo hacer TODO por ti! Solo pídeme 💪✨`,
    }]
  }

  const [messages, setMessages] = useState(loadMessages)
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-focus
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  // Save messages
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  // Speech Recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'es-ES'

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = event => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      toast.error('No pude escuchar. Intenta de nuevo.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [toast])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Tu navegador no soporta reconocimiento de voz.')
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

  const clearHistory = () => {
    setMessages([messages[0]])
    localStorage.removeItem(STORAGE_KEY)
    toast.success('Historial limpiado')
  }

  // Formatear moneda CLP
  const formatCLP = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount)
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { id: Date.now(), role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    const userInput = input
    setInput('')
    setIsProcessing(true)

    let response = ''

    try {
      const lowerInput = userInput.toLowerCase().trim()

      // ============================================
      // NAVEGACIÓN - Orden específico (más específico primero)
      // ============================================

      // Reportes/Estadísticas
      if (lowerInput.includes('reporte') || lowerInput.includes('reportes') || lowerInput.includes('estadística') || lowerInput.includes('estadísticas')) {
        navigate('/app/reports')
        response = '📊 ¡Vamos a los reportes y estadísticas!'
      }
      // Configuración/Ajustes
      else if (lowerInput.includes('configuración') || lowerInput.includes('ajustes') || lowerInput.includes('config')) {
        navigate('/app/settings')
        response = '⚙️ ¡Vamos a la configuración!'
      }
      // Catálogos
      else if (lowerInput.includes('catálogo') || lowerInput.includes('catalogos') || lowerInput === 'catalogo') {
        navigate('/app/catalogs')
        response = '📚 ¡Vamos a los catálogos!'
      }
      // Contactos/Clientes
      else if (lowerInput.includes('contacto') || lowerInput.includes('cliente') || lowerInput === 'contactos' || lowerInput === 'clientes') {
        navigate('/app/contacts')
        response = '👥 ¡Vamos a los contactos!'
      }
      // Inventario/Productos - ESTA PRIMERO para evitar conflicto
      else if (lowerInput === 'inventario' || lowerInput === 'ir a inventario' || lowerInput.startsWith('ir a inventario') ||
               lowerInput.startsWith('ir al inventario') || lowerInput === 'ir inventario' ||
               (lowerInput.includes('ir') && lowerInput.includes('inventario'))) {
        navigate('/app/inventory')
        response = '📦 ¡Vamos al inventario!'
      }
      // Ventas - SOLO si no es "ir a inventario"
      else if (lowerInput === 'ventas' || lowerInput === 'ir a ventas' || lowerInput.startsWith('ir a ventas') ||
               lowerInput === 'ir ventas' || (lowerInput.includes('ir') && lowerInput.includes('ventas'))) {
        navigate('/app/sales')
        response = '💰 ¡Vamos a las ventas!'
      }
      // Dashboard/Inicio
      else if (lowerInput.includes('dashboard') || lowerInput.includes('inicio') || lowerInput === 'home') {
        navigate('/app/dashboard')
        response = '🏠 ¡Vamos al inicio!'
      }

      // ============================================
      // CREAR PRODUCTO - Formato natural
      // ============================================
      else if (lowerInput.includes('crear producto') || lowerInput.includes('nuevo producto') || lowerInput.includes('agregar producto')) {
        // Intentar parsear: crear producto Leche precio 1500 stock 50
        const words = lowerInput.split(/\s+/)

        let productName = ''
        let price = null
        let stock = null
        let cost = null

        // Buscar precio
        const precioIndex = words.findIndex(w => w === 'precio' || w === 'precios' || w === ':')
        if (precioIndex !== -1 && words[precioIndex + 1]) {
          price = parseFloat(words[precioIndex + 1].replace(/[$.,]/g, ''))
        }

        // Buscar stock
        const stockIndex = words.findIndex(w => w === 'stock' || w === 'existencia')
        if (stockIndex !== -1 && words[stockIndex + 1]) {
          stock = parseInt(words[stockIndex + 1])
        }

        // Buscar costo
        const costoIndex = words.findIndex(w => w === 'costo' || w === 'cost')
        if (costoIndex !== -1 && words[costoIndex + 1]) {
          cost = parseFloat(words[costoIndex + 1].replace(/[$.,]/g, ''))
        }

        // Extraer nombre (lo que está entre "producto" y precio/stock/costo)
        const productoIndex = words.indexOf('producto')
        if (productoIndex !== -1) {
          const nameWords = []
          for (let i = productoIndex + 1; i < words.length; i++) {
            const word = words[i]
            if (['precio', 'precios', 'stock', 'costo', 'cost', ':'].includes(word)) break
            if (word.length > 1) nameWords.push(word)
          }
          productName = nameWords.join(' ')
        }

        if (!productName) {
          response = '📦 ¿Cuál es el **nombre** del producto?\n\nEjemplo: "crear producto Leche precio 1500 stock 50"'
        } else {
          try {
            const productData = {
              name: productName.charAt(0).toUpperCase() + productName.slice(1),
              selling_price: price || 0,
              stock_quantity: stock || 0,
              cost_price: cost || price || 0,
              min_stock_alert: 10,
              sku: `${productName.substring(0, 3).toUpperCase()}-${Date.now()}`,
            }

            const result = await createProduct(productData)

            if (result.error) {
              response = `❌ Error al crear producto: ${result.error.message}`
            } else {
              // Notificar
              if (user?.id) {
                await notify.product.created(user.id, result.data || productData)
              }
              response = `✅ ¡Producto creado!\n\n📦 **${productData.name}**\n💰 Precio: ${formatCLP(productData.selling_price)}\n📊 Stock: ${productData.stock_quantity} unidades`
            }
          } catch (error) {
            response = `❌ Error: ${error.message}`
          }
        }
      }

      // ============================================
      // REGISTRAR VENTA
      // ============================================
      else if (lowerInput.includes('registrar venta') || lowerInput.includes('nueva venta') || lowerInput.includes('crear venta') ||
               lowerInput.startsWith('venta ') || lowerInput === 'venta') {
        // Parsear: venta de 5000 por Leche
        let amount = 0
        let productName = ''

        // Buscar monto
        const amountMatch = userInput.match(/(\d+[\d.,]*)\s*(pesos|clp|\$)?/i)
        if (amountMatch) {
          amount = parseFloat(amountMatch[1].replace(/[$.,]/g, ''))
        }

        // Buscar producto después de "por"
        const porIndex = lowerInput.indexOf(' por ')
        if (porIndex !== -1) {
          productName = userInput.substring(porIndex + 5).trim()
        }

        if (amount === 0) {
          response = '💰 ¿Cuál es el monto de la venta?\n\nEjemplo: "venta de 5000 por Leche" o "registrar venta 10000"'
        } else {
          try {
            const saleData = {
              total: amount,
              payment_method: 'cash',
              notes: productName ? `Venta por: ${productName}` : 'Venta registrada por chat',
              items: [{
                name: productName || 'Vario',
                quantity: 1,
                price: amount,
                subtotal: amount,
              }],
            }

            const result = await createSale(saleData)

            if (result.error) {
              response = `❌ Error: ${result.error.message}`
            } else {
              // Notificar
              if (user?.id) {
                await notify.sale.created(user.id, result.data || { ...saleData, transaction_date: new Date().toISOString() })
              }
              response = `✅ ¡Venta registrada!\n\n💰 **Monto:** ${formatCLP(amount)}\n📦 ${productName ? 'Producto: ' + productName : ''}`
            }
          } catch (error) {
            response = `❌ Error: ${error.message}`
          }
        }
      }

      // ============================================
      // CREAR CLIENTE
      // ============================================
      else if (lowerInput.includes('crear cliente') || lowerInput.includes('nuevo cliente') || lowerInput.includes('agregar cliente')) {
        // Parsear: crear cliente Juan telefono 98765432 email juan@ejemplo.com
        const words = lowerInput.split(/\s+/)

        let customerName = ''
        let phone = ''
        let email = ''

        // Buscar nombre
        const clienteIndex = words.indexOf('cliente')
        if (clienteIndex !== -1) {
          const nameWords = []
          for (let i = clienteIndex + 1; i < words.length; i++) {
            const word = words[i]
            if (['telefono', 'tel', 'email', 'correo'].includes(word)) break
            if (word.length > 1) nameWords.push(word)
          }
          customerName = nameWords.join(' ')
        }

        // Buscar teléfono
        const telefonoIndex = words.findIndex(w => w === 'telefono' || w === 'tel')
        if (telefonoIndex !== -1 && words[telefonoIndex + 1]) {
          phone = words[telefonoIndex + 1].replace(/\D/g, '')
        }

        // Buscar email
        const emailIndex = words.findIndex(w => w === 'email' || w === 'correo')
        if (emailIndex !== -1 && words[emailIndex + 1]) {
          email = words[emailIndex + 1]
        }

        if (!customerName) {
          response = '👤 ¿Cuál es el **nombre** del cliente?\n\nEjemplo: "crear cliente Juan telefono 98765432"'
        } else {
          try {
            const contactData = {
              name: customerName.charAt(0).toUpperCase() + customerName.slice(1),
              phone: phone || null,
              email: email || null,
              contact_type: 'customer',
            }

            const result = await createContact(contactData)

            if (result.error) {
              response = `❌ Error: ${result.error.message}`
            } else {
              // Notificar
              if (user?.id) {
                await notify.customer.created(user.id, result.data || contactData)
              }
              response = `✅ ¡Cliente creado!\n\n👤 **${contactData.name}**\n📱 ${phone || 'Sin teléfono'}\n📧 ${email || 'Sin email'}`
            }
          } catch (error) {
            response = `❌ Error: ${error.message}`
          }
        }
      }

      // ============================================
      // CREAR CATÁLOGO
      // ============================================
      else if (lowerInput.includes('crear catálogo') || lowerInput.includes('crear catalogo') || lowerInput.includes('nuevo catálogo')) {
        // Extraer nombre del catálogo
        const catalogoIndex = lowerInput.indexOf('catálogo') !== -1 ? lowerInput.indexOf('catálogo') : lowerInput.indexOf('catalogo')
        let catalogName = userInput.substring(catalogoIndex + 8).trim()

        if (!catalogName) {
          response = '📚 ¿Cuál es el **nombre** del catálogo?\n\nEjemplo: "crear catálogo Productos de Verano"'
        } else {
          try {
            const catalogData = {
              name: catalogName.charAt(0).toUpperCase() + catalogName.slice(1),
              description: `Catálogo creado por asistente Magorya`,
              theme: 'default',
              product_ids: [],
            }

            const result = await createCatalog(catalogData)

            if (!result) {
              response = '✅ ¡Catálogo creado!\n\n📚 **' + catalogData.name + '**\n\nAhora ve a catálogos para agregar productos.'
            } else {
              response = '✅ ¡Catálogo creado!\n\n📚 **' + catalogData.name + '**'
            }
          } catch (error) {
            response = `❌ Error: ${error.message}`
          }
        }
      }

      // ============================================
      // CONSULTAS DEL NEGOCIO
      // ============================================
      // Resumen del negocio
      else if (lowerInput.includes('¿cómo va') || lowerInput.includes('resumen') || lowerInput.includes('estado del negocio') ||
               lowerInput === 'como va' || lowerInput === 'resumen') {
        const productCount = products?.length || 0
        const salesCount = transactions?.length || 0
        const today = new Date().toDateString()
        const todaySales = transactions?.filter(t => {
          const saleDate = new Date(t.transaction_date).toDateString()
          return saleDate === today && t.transaction_type === 'sale'
        }) || []
        const todayTotal = todaySales.reduce((sum, s) => sum + parseFloat(s.total_amount || 0), 0)

        response = `📊 **Resumen de tu negocio:**

📦 **Productos:** ${productCount}
💰 **Ventas totales:** ${salesCount}
👥 **Clientes:** ${contacts.length}

📅 **Hoy:**
• Ventas: ${todaySales.length}
• Total: ${formatCLP(todayTotal)}

${salesCount > 0 ? '¡Tu negocio está activo! 🎉' : '¡Vamos a darle vida! 💪'}`
      }

      // Ventas de hoy
      else if (lowerInput.includes('ventas de hoy') || lowerInput.includes('vendí hoy') || lowerInput.includes('cuánto vendí hoy') ||
               lowerInput === 'ventas hoy') {
        const today = new Date().toDateString()
        const todaySales = transactions?.filter(t => {
          const saleDate = new Date(t.transaction_date).toDateString()
          return saleDate === today && t.transaction_type === 'sale'
        }) || []

        if (todaySales.length === 0) {
          response = '💰 **Ventas de hoy:**\n\nAún no tienes ventas registradas hoy.\n\n¿Quieres registrar una venta?'
        } else {
          const total = todaySales.reduce((sum, s) => sum + parseFloat(s.total_amount || 0), 0)
          response = `💰 **Ventas de hoy:**\n\n• ${todaySales.length} ventas\n• Total: ${formatCLP(total)}\n\n¡Excelente día! 🎉`
        }
      }

      // Productos con stock bajo
      else if (lowerInput.includes('stock bajo') || lowerInput.includes('productos con poco stock') || lowerInput.includes('poco stock')) {
        const lowStock = products?.filter(p => p.stock_quantity <= p.min_stock_alert) || []
        if (lowStock.length === 0) {
          response = '✅ ¡Buenas noticias! No tienes productos con stock bajo.'
        } else {
          response = `⚠️ **Productos con stock bajo:**\n\n${lowStock.map(p => `• ${p.name}: ${p.stock_quantity} unidades (mínimo: ${p.min_stock_alert})`).join('\n')}`
        }
      }

      // ============================================
      // AYUDA
      // ============================================
      else if (lowerInput.includes('ayuda') || lowerInput.includes('help') || lowerInput.includes('qué puedes') || lowerInput === 'ayuda') {
        response = `💪 **¡Puedo hacer TODO por ti!**

🧭 **Navegación:**
• "inventario" / "ventas" / "contactos" / "reportes" / "catálogos"

📦 **Crear productos:**
• "crear producto [nombre] precio [precio] stock [stock]"

💰 **Registrar ventas:**
• "venta de [monto] por [producto]"

👥 **Crear clientes:**
• "crear cliente [nombre] telefono [fono]"

📚 **Crear catálogos:**
• "crear catálogo [nombre]"

📊 **Consultas:**
• "resumen" / "ventas de hoy" / "stock bajo"`
      }

      // ============================================
      // DEFAULT - Respuesta amigable
      // ============================================
      else {
        response = `💭 Hmm, no estoy segura de lo que necesitas.

**Puedo intentar:**

🧭 **Ir a:** "inventario", "ventas", "contactos", "reportes", "catálogos"

📦 **Crear:** "crear producto [nombre] precio [precio] stock [stock]"

💰 **Vender:** "venta de [monto] por [producto]"

👤 **Cliente:** "crear cliente [nombre] telefono [fono]"

📊 **Consultar:** "resumen", "ventas de hoy", "stock bajo"

Escribe **ayuda** para ver todo lo que puedo hacer ✨`
      }

    } catch (error) {
      console.error('Error processing message:', error)
      response = '❌ Lo siento, hubo un error. ¿Podrías intentar de nuevo? 😕'
    }

    // Add assistant response
    const assistantMessage = { id: Date.now() + 1, role: 'assistant', content: response }
    setMessages(prev => [...prev, assistantMessage])
    setIsProcessing(false)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
      isMinimized ? 'w-16 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!isMinimized && (
            <>
              <h3 className="text-white font-semibold text-sm drop-shadow-md">Magorya ✨</h3>
              <p className="text-white/90 text-xs drop-shadow">Asistente IA</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title={isMinimized ? 'Expandir' : 'Minimizar'}>
            {isMinimized ? <Maximize2 className="h-4 w-4 text-white" /> : <Minimize2 className="h-4 w-4 text-white" />}
          </button>
          {!isMinimized && (
            <button onClick={clearHistory} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Limpiar historial">
              <Trash2 className="h-4 w-4 text-white" />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Cerrar">
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[460px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 dark:from-indigo-500 dark:to-purple-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-700 shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm flex gap-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleListening}
                disabled={!recognitionRef.current}
                className={`icon-btn-neo-sm ${
                  isListening ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' : ''
                }`}
                title={isListening ? 'Escuchando...' : 'Micrófono'}
              >
                {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe o usa el micrófono... 🎤"
                disabled={isProcessing}
                className="flex-1 input-neo-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className="btn-neo-primary bg-gradient-to-br from-violet-500 to-purple-600 dark:from-indigo-500 dark:to-purple-600"
                title="Enviar"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
            {isListening && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center animate-pulse font-medium">
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
