import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Send, Mic, MicOff, Sparkles, Minimize2, Maximize2, Trash2 } from 'lucide-react'
import { useToast } from '../common'
import { useInventory } from '../../hooks/useInventory'
import { useSales } from '../../hooks/useSales'
import { useContacts } from '../../hooks/useContacts'
import { useAuth } from '../../hooks/useAuth'
import { useReports } from '../../hooks/useReports'

const STORAGE_KEY = 'magorya_chat_history'

const MagoryaChat = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const { profile } = useAuth()
  const { createProduct, products } = useInventory()
  const { createSale, sales } = useSales()
  const { createContact, contacts } = useContacts()

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

**Lo que puedo hacer por ti:**

📊 **Análisis del negocio:**
• "¿Cómo va mi negocio?" - Resumen completo
• "Resumen de hoy" - Estado actual

🤖 **Inteligencia:**
• "Tendencias" - Análisis de ventas
• "Sugerencias" - Recomendaciones
• "Rentabilidad" - Análisis de ganancias

💰 **Ventas:**
• "¿Cuánto vendí hoy/semana?"
• "Registrar venta"

📦 **Inventario:**
• "Crear producto X"
• "Productos con stock bajo"

👥 **Contactos:**
• "Crear contacto Juan"
• "Buscar cliente X"

🧭 **Navegación:**
• "Ir a inventario/ventas/contactos"

💬 **Escribe o usa el micrófono 🎤**

¡Solo dime qué necesitas! 💪✨`,
    }]
  }

  const [messages, setMessages] = useState(loadMessages)
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [conversationState, setConversationState] = useState(null)
  const [activeForm, setActiveForm] = useState(null) // { type: 'contact' | 'product', step: number, data: {} }
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch (error) {
      console.error('Error saving chat history:', error)
    }
  }, [messages])

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: '¡Memoria limpiada! 🧹✨\n\nHe olvidado todas nuestras conversaciones. ¿En qué te ayudo? 😊',
    }])
    toast.success('Historial limpiado')
  }

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
        toast.error('No pude escucharte bien.')
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

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''))
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

  const getBusinessSummary = () => {
    const totalProducts = products?.length || 0
    const lowStock = products?.filter(p => p.stock_quantity <= p.min_stock_alert).length || 0
    const totalContacts = contacts?.length || 0
    const customers = contacts?.filter(c => c.contact_type === 'customer').length || 0

    const today = new Date()
    const todaySales = sales?.filter(s => {
      const saleDate = new Date(s.transaction_date || s.created_at)
      return saleDate.toDateString() === today.toDateString()
    }).length || 0

    return `📊 **Resumen de tu negocio:**

📦 **Productos:** ${totalProducts} totales
⚠️ **Stock bajo:** ${lowStock} productos

👥 **Contactos:** ${totalContacts} (${customers} clientes)

💰 **Ventas hoy:** ${todaySales} transacciones

${lowStock > 0 ? `\n🚨 Tienes ${lowStock} productos con stock bajo.` : ''}`
  }

  const getLowStockProducts = () => {
    const lowStock = products?.filter(p => p.stock_quantity <= p.min_stock_alert) || []
    if (lowStock.length === 0) {
      return '✅ Todos tus productos tienen stock suficiente. 📦'
    }
    let response = `⚠️ **Productos con stock bajo:**\n\n`
    lowStock.slice(0, 5).forEach(p => {
      response += `• **${p.name}** - Stock: ${p.stock_quantity}\n`
    })
    if (lowStock.length > 5) {
      response += `\n... y ${lowStock.length - 5} más.`
    }
    response += '\n\n¿Quieres que te lleve al inventario?'
    setConversationState({ action: 'check_low_stock' })
    return response
  }

  const getSalesInfo = (period) => {
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
    }

    const total = filteredSales.reduce((sum, s) => sum + (s.total || 0), 0)
    const count = filteredSales.length

    if (count === 0) {
      setConversationState({ action: 'create_sale' })
      return `💰 **Ventas ${period}:**\n\n• Transacciones: 0\n• Total: $0\n\n¿Quieres registrar una venta?`
    }
    return `💰 **Ventas ${period}:**\n\n• Transacciones: ${count}\n• Total: $${total.toLocaleString()}\n\n¡Buen trabajo! 🎉`
  }

  const searchProduct = (query) => {
    const found = products?.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku?.toLowerCase().includes(query.toLowerCase()) ||
      p.category?.toLowerCase().includes(query.toLowerCase())
    ) || []

    if (found.length === 0) {
      setConversationState({ action: 'create_product' })
      return `No encontré "${query}". ¿Quieres crearlo?`
    }

    if (found.length === 1) {
      const p = found[0]
      return `📦 **${p.name}**\n\n• Stock: ${p.stock_quantity}\n• Precio: $${p.selling_price}\n• Costo: $${p.cost_price}`
    }

    let response = `Encontré ${found.length} productos:\n\n`
    found.slice(0, 5).forEach(p => {
      response += `• **${p.name}** - Stock: ${p.stock_quantity}\n`
    })
    return response
  }

  const searchContact = (query) => {
    const found = contacts?.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email?.toLowerCase().includes(query.toLowerCase())
    ) || []

    if (found.length === 0) {
      setConversationState({ action: 'create_contact' })
      return `No encontré "${query}". ¿Quieres crearlo?`
    }

    let response = `👥 **Contactos:**\n\n`
    found.slice(0, 5).forEach(c => {
      const typeEmoji = c.contact_type === 'customer' ? '🛒' : c.contact_type === 'supplier' ? '🚚' : '👤'
      response += `${typeEmoji} **${c.name}**\n`
    })
    return response
  }

  const getSmartSuggestions = () => {
    const suggestions = []

    const lowStock = products?.filter(p => p.stock_quantity <= p.min_stock_alert) || []
    if (lowStock.length > 0) {
      suggestions.push(`📦 ${lowStock.length} productos con stock bajo`)
    }

    const today = new Date()
    const todaySales = sales?.filter(s => {
      const saleDate = new Date(s.transaction_date || s.created_at)
      return saleDate.toDateString() === today.toDateString()
    }).length || 0
    if (todaySales === 0) {
      suggestions.push(`💸 No tienes ventas hoy`)
    }

    if (suggestions.length === 0) {
      return '✨ ¡Todo está excelente! Tu negocio funciona bien. ¿Hay algo más en lo que pueda ayudarte?'
    }
    return `💡 **Sugerencias:**\n\n` + suggestions.join('\n')
  }

  const processCommand = async (userInput) => {
    const input = userInput.toLowerCase().trim()
    setIsProcessing(true)

    try {
      // FORMULARIO CONVERSACIONAL ACTIVO
      if (activeForm) {
        const form = activeForm
        let newData = { ...form.data }

        // Extraer información del input
        if (form.step === 1) { // Nombre
          newData.name = userInput
          setActiveForm({ ...form, step: 2, data: newData })
          return `¡Perfecto! El nombre es **${userInput}** 👤

Ahora necesito el **tipo** de contacto:
• cliente
• proveedor
• empleado

¿Cuál es?`
        }

        if (form.step === 2) { // Tipo
          const typeMap = { 'cliente': 'customer', 'proveedor': 'supplier', 'empleado': 'employee' }
          newData.contact_type = typeMap[input] || 'customer'
          setActiveForm({ ...form, step: 3, data: newData })
          return `Entendido, es ${input}.

Ahora dame el **teléfono** (o escribe "omitir"):`
        }

        if (form.step === 3) { // Teléfono
          if (input !== 'omitir' && input !== 'no' && input.length > 3) {
            newData.phone = userInput
          }
          setActiveForm({ ...form, step: 4, data: newData })
          return `Último dato: el **email** (o escribe "omitir"):`
        }

        if (form.step === 4) { // Email - FINAL
          if (input !== 'omitir' && input !== 'no' && input.includes('@')) {
            newData.email = userInput
          }

          // Crear el contacto
          try {
            await createContact(newData)
            setActiveForm(null)
            return `✅ ¡Contacto creado exitosamente!

👤 **Nombre:** ${newData.name}
📋 **Tipo:** ${newData.contact_type === 'customer' ? 'Cliente' : newData.contact_type === 'supplier' ? 'Proveedor' : 'Empleado'}
${newData.phone ? `📞 **Teléfono:** ${newData.phone}` : ''}
${newData.email ? `📧 **Email:** ${newData.email}` : ''}

¿Hay algo más en lo que pueda ayudarte? 😊`
          } catch (error) {
            setActiveForm(null)
            return `❌ Hubo un error al crear el contacto: ${error.message}. ¿Intentamos de nuevo?`
          }
        }

        // FORMULARIO DE PRODUCTO
        if (form.type === 'product') {
          if (form.step === 1) { // Nombre
            newData.name = userInput
            setActiveForm({ ...form, step: 2, data: newData })
            return `¡Perfecto! El producto es **${userInput}** 📦

Ahora necesito el **precio de venta**:
¿A cuánto lo vas a vender?`
          }

          if (form.step === 2) { // Precio de venta
            const price = parseFloat(input.replace(/[$,.]/g, ''))
            if (isNaN(price) || price <= 0) {
              return `❌ Precio inválido. Por favor ingresa un número válido.`
            }
            newData.selling_price = price
            setActiveForm({ ...form, step: 3, data: newData })
            return `Precio de venta: $${price.toLocaleString()}

Ahora el **precio de costo**:
¿A cuánto te costó?`
          }

          if (form.step === 3) { // Precio de costo
            const cost = parseFloat(input.replace(/[$,.]/g, ''))
            if (isNaN(cost) || cost < 0) {
              return `❌ Costo inválido. Por favor ingresa un número válido.`
            }
            newData.cost_price = cost
            setActiveForm({ ...form, step: 4, data: newData })
            const margin = ((newData.selling_price - cost) / cost * 100).toFixed(1)
            return `Costo: $${cost.toLocaleString()}
Margen: ${margin}%

Ahora el **stock inicial**:
¿Cuántas unidades tienes?`
          }

          if (form.step === 4) { // Stock
            const stock = parseInt(input.replace(/[^0-9]/g, ''))
            if (isNaN(stock) || stock < 0) {
              return `❌ Stock inválido. Por favor ingresa un número válido.`
            }
            newData.stock_quantity = stock
            newData.min_stock_alert = Math.max(5, Math.floor(stock * 0.2))
            newData.sku = `SKU-${Date.now()}`
            newData.category = 'General'

            // Crear el producto
            try {
              await createProduct(newData)
              setActiveForm(null)
              return `✅ ¡Producto creado exitosamente!

📦 **Nombre:** ${newData.name}
💰 **Precio venta:** $${newData.selling_price.toLocaleString()}
📉 **Costo:** $${newData.cost_price.toLocaleString()}
📊 **Stock:** ${newData.stock_quantity} unidades
🔔 **Alerta:** ${newData.min_stock_alert} unidades

¿Hay algo más en lo que pueda ayudarte? 😊`
            } catch (error) {
              setActiveForm(null)
              return `❌ Hubo un error al crear el producto: ${error.message}. ¿Intentamos de nuevo?`
            }
          }
        }
      }

      // COMANDOS PARA INICIAR FORMULARIO CONVERSACIONAL
      const formTriggers = ['pídeme', 'pideme', 'dame los datos', 'tú créalo', 'tu crealo', 'pide datos', 'crealo tú', 'crealo tu', 'formularios', 'quiero que me preguntes']

      // Respuestas afirmativas/negativas
      const affirmative = ['si', 'sí', 'claro', 'yes', 'y', 'ok', 'vale']
      const negative = ['no', 'nop', 'nope']
      const isAffirmative = affirmative.some(a => input === a || input.includes(a))
      const isNegative = negative.some(n => input === n || input.includes(n))

      if (conversationState && (isAffirmative || isNegative)) {
        const state = conversationState
        setConversationState(null)
        if (isAffirmative) {
          if (state.action === 'create_contact') {
            navigate('/app/contacts')
            return 'Abriendo formulario de contacto... 📝'
          }
          if (state.action === 'create_product') {
            navigate('/app/inventory')
            return 'Abriendo formulario de producto... 📦'
          }
          if (state.action === 'create_sale') {
            navigate('/app/sales')
            return 'Abriendo formulario de venta... 💸'
          }
          if (state.action === 'check_low_stock') {
            navigate('/app/inventory')
            return '¡Te llevo al inventario! 📦'
          }
        }
        return '¿Hay algo más en lo que pueda ayudarte? 😊'
      }

      // Ayuda
      const ayudaPatterns = ['ayuda', 'help', 'que puedes', 'qué puedes', 'que haces', 'qué haces', 'para que sirves', 'para qué sirves', 'que puedes hacer', 'qué puedes hacer']
      if (ayudaPatterns.some(p => input.includes(p))) {
        return `Soy Magorya, tu asistente inteligente 💛✨

**Puedo hacer:**
• "¿Cómo va mi negocio?" - Resumen completo
• "Crear producto/contacto X"
• "Productos con stock bajo"
• "¿Cuánto vendí hoy/semana?"
• "Ir a inventario/ventas/contactos"
• "Sugerencias" - Recomendaciones

¡Escribe o usa el micrófono! 🎤`
      }

      // Resumen del negocio
      if (input.includes('como va') || input.includes('cómo va') || input.includes('resumen') || input.includes('mi negocio') || input.includes('estado')) {
        return getBusinessSummary()
      }

      // Stock bajo
      if (input.includes('stock bajo') || input.includes('poco stock') || input.includes('reponer') || input.includes('alerta')) {
        return getLowStockProducts()
      }

      // Ventas
      if (input.includes('venta') || input.includes('vendí')) {
        if (input.includes('hoy')) return getSalesInfo('hoy')
        if (input.includes('semana')) return getSalesInfo('semana')
        if (input.includes('registrar') || input.includes('nueva') || input.includes('crear')) {
          navigate('/app/sales')
          return 'Abriendo formulario de venta... 💸'
        }
        return getSalesInfo('hoy')
      }

      // Productos
      if (input.includes('producto')) {
        // Verificar si quiere formulario conversacional
        const useForm = formTriggers.some(t => input.includes(t)) ||
                        (conversationState?.action === 'create_product' && isAffirmative)

        // Crear - PRIMERO
        if (input.includes('crear') || input.includes('nuevo') || input.includes('agrega') || input === 'producto' || useForm) {
          const nameMatch = input.match(/producto\s+["']?([^"']+)["']?/i) || input.match(/crear\s+(["']?)(.+?)\1/i)
          if (nameMatch && nameMatch[1] && !useForm) {
            const productName = nameMatch[1]
            await createProduct({
              name: productName,
              sku: `SKU-${Date.now()}`,
              category: 'General',
              cost_price: 1000,
              selling_price: 1500,
              stock_quantity: 10,
            })
            return `✅ Creé "${productName}" en tu inventario.`
          }
          // Iniciar formulario conversacional
          setConversationState(null)
          setActiveForm({ type: 'product', step: 1, data: {} })
          return `¡Perfecto! Voy a crear el producto contigo 📦

¿Cuál es el **nombre** del producto?`
        }
        // Buscar - DESPUÉS
        const searchMatch = input.match(/producto\s+(["']?)(.+?)\1$/i)
        if (searchMatch) {
          return searchProduct(searchMatch[2])
        }
        if (input.includes('cuántos') || input.includes('cuantos')) {
          return `Tienes ${products?.length || 0} productos. 📦`
        }
      }

      // Contactos
      if (input.includes('contacto') || input.includes('cliente')) {
        // Verificar si quiere formulario conversacional
        const useForm = formTriggers.some(t => input.includes(t)) ||
                        (conversationState?.action === 'create_contact' && isAffirmative)

        // Crear con formulario conversacional
        if (input.includes('crear') || input.includes('nuevo') || input === 'contacto' || input === 'cliente' || useForm) {
          const nameMatch = input.match(/(?:contacto|cliente)\s+["']?([^"']+)["']?/i)
          if (nameMatch && nameMatch[1] && !useForm) {
            const contactName = nameMatch[1]
            await createContact({
              name: contactName,
              contact_type: 'customer',
            })
            return `✅ Creé el contacto de "${contactName}". 👥`
          }
          // Iniciar formulario conversacional
          setConversationState(null)
          setActiveForm({ type: 'contact', step: 1, data: {} })
          return `¡Perfecto! Voy a crear el contacto contigo 📝

Empecemos. ¿Cuál es el **nombre** del contacto?`
        }
        // Buscar - DESPUÉS
        const searchMatch = input.match(/(?:contacto|cliente)\s+(["']?)(.+?)\1$/i)
        if (searchMatch) {
          return searchContact(searchMatch[2])
        }
        if (input.includes('cuántos') || input.includes('cuantos')) {
          return `Tienes ${contacts?.length || 0} contactos. 👥`
        }
      }

      // Sugerencias
      if (input.includes('sugerencia') || input.includes('recomendacion')) {
        return getSmartSuggestions()
      }

      // Navegación
      if (input.includes('ir a') || input.includes('ve a') || input.includes('abre') || input.includes('llevara')) {
        if (input.includes('inventario') || input.includes('productos')) {
          navigate('/app/inventory')
          return '¡Te llevo al inventario! 📦'
        }
        if (input.includes('venta') || input.includes('ventas')) {
          navigate('/app/sales')
          return '¡Vamos a las ventas! 💰'
        }
        if (input.includes('contacto') || input.includes('clientes')) {
          navigate('/app/contacts')
          return '¡A contactos! 👥'
        }
        if (input.includes('reporte') || input.includes('reportes')) {
          navigate('/app/reports')
          return '¡Tus reportes! 📊'
        }
        if (input.includes('dashboard') || input.includes('inicio')) {
          navigate('/app/dashboard')
          return '¡Volviendo al inicio! 🏠'
        }
      }

      // Respuestas por defecto
      const responses = [
        '¿Podrías darme más detalles? 🤔',
        '¿Qué más necesitas? 💛',
        '¿Hay algo más en lo que pueda ayudarte? ✨',
        '¡Dime! 😊',
      ]
      return responses[Math.floor(Math.random() * responses.length)]

    } catch (error) {
      console.error('Error:', error)
      return `¡Ups! Algo salió mal. ¿Intentamos de nuevo? 😅`
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage = { id: Date.now(), role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsProcessing(true)

    await new Promise(resolve => setTimeout(resolve, 500))

    const response = await processCommand(currentInput)
    const assistantMessage = { id: Date.now() + 1, role: 'assistant', content: response }
    setMessages(prev => [...prev, assistantMessage])

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
    <div className={`fixed bottom-4 right-4 z-50 bg-neo-surface dark:bg-dark-surface rounded-2xl shadow-2xl border border-neo-border dark:border-dark-border overflow-hidden transition-all duration-300 ${
      isMinimized ? 'w-16 h-16' : 'w-96 h-[600px]'
    }`}>
      <div className="bg-gradient-to-r from-neo-primary to-neo-accent dark:from-dark-primary dark:to-dark-accent p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!isMinimized && (
            <>
              <h3 className="text-white font-semibold text-sm">Magorya ✨</h3>
              <p className="text-white/70 text-xs">Asistente IA</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded-lg">
            {isMinimized ? <Maximize2 className="h-4 w-4 text-white" /> : <Minimize2 className="h-4 w-4 text-white" />}
          </button>
          {!isMinimized && (
            <button onClick={clearHistory} className="p-1 hover:bg-white/10 rounded-lg" title="Limpiar historial">
              <Trash2 className="h-4 w-4 text-white" />
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="h-[460px] overflow-y-auto p-4 space-y-4 bg-neo-bg dark:bg-dark-bg">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-neo-primary dark:bg-dark-primary text-white'
                    : 'bg-neo-surface dark:bg-dark-surface text-neo-text dark:text-dark-text border border-neo-border dark:border-dark-border'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-neo-surface dark:bg-dark-surface p-3 rounded-2xl border border-neo-border dark:border-dark-border flex gap-1">
                  <div className="w-2 h-2 bg-neo-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-neo-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-neo-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-neo-border dark:border-dark-border bg-neo-surface dark:bg-dark-surface">
            <div className="flex items-center gap-2">
              <button onClick={toggleListening} disabled={!recognitionRef.current} className={`p-2 rounded-lg ${
                isListening
                  ? 'bg-neo-danger dark:bg-dark-danger text-white animate-pulse'
                  : 'bg-neo-bg dark:bg-dark-bg text-neo-text dark:text-dark-text'
              }`}>
                {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe o usa el micrófono... 🎤"
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-neo-bg dark:bg-dark-bg border border-neo-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neo-primary text-neo-text dark:text-dark-text text-sm disabled:opacity-50"
              />
              <button onClick={handleSend} disabled={!input.trim() || isProcessing} className="p-2 bg-neo-primary dark:bg-dark-primary text-white rounded-lg disabled:opacity-50">
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
