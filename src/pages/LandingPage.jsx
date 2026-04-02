import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ShoppingCart,
  Store,
  Users,
  TrendingUp,
  Shield,
  Smartphone,
  Zap,
  CreditCard,
  Package,
  BarChart3,
  Calculator,
  Truck,
  Globe,
  ChevronRight,
  Check,
  Star,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: <Store className="h-8 w-8 text-primary-500 dark:text-primary-400" />,
      title: 'PDV Completo',
      description: 'Punto de venta con modo offline, lector de códigos de barras y múltiples métodos de pago',
    },
    {
      icon: <Package className="h-8 w-8 text-success-500 dark:text-success-400" />,
      title: 'Control de Stock',
      description: 'Gestión avanzada de inventario con alertas de bajo stock, categorías y múltiples bodegas',
    },
    {
      icon: <Calculator className="h-8 w-8 text-accent-400 dark:text-accent-300" />,
      title: 'Finanzas',
      description: 'Cuentas por pagar y recibir, flujo de caja, reportes financieros y conciliación bancaria',
    },
    {
      icon: <Globe className="h-8 w-8 text-primary-500 dark:text-primary-400" />,
      title: 'Tienda Online',
      description: 'Vitrina virtual integrada, catálogo digital y pedidos por WhatsApp',
    },
    {
      icon: <Truck className="h-8 w-8 text-warning-500 dark:text-warning-400" />,
      title: 'Delivery',
      description: 'Gestión de entregas, tracking y coordinación con repartidores',
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary-500 dark:text-primary-400" />,
      title: 'Reportes',
      description: 'Dashboards en tiempo real, análisis de ventas y métricas de negocio',
    },
  ]

  const benefits = [
    {
      icon: <Shield className="h-6 w-6 text-primary-500 dark:text-primary-400" />,
      title: 'Seguro',
      description: 'Tus datos protegidos con encriptación de nivel bancario',
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary-500 dark:text-primary-400" />,
      title: 'Móvil',
      description: 'Funciona en tablets, celulares y computadores',
    },
    {
      icon: <Zap className="h-6 w-6 text-primary-500 dark:text-primary-400" />,
      title: 'Rápido',
      description: 'Interfaz ágil para vender más en menos tiempo',
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary-500 dark:text-primary-400" />,
      title: 'Pagos',
      description: 'Integrado con Webpay, Transbank y transferencias',
    },
  ]

  const plans = [
    {
      name: 'Motor de Arranque',
      price: '24.990',
      period: 'por mes · 14 días gratis',
      popular: true,
      description: 'Ideal para quien está empezando',
      features: [
        'PDV básico',
        'Gestión de stock',
        '1 usuario',
        'Soporte por email',
      ],
    },
    {
      name: 'Profesional',
      price: '49.990',
      period: 'por mes · 14 días gratis',
      popular: false,
      description: 'Para negocios en crecimiento',
      features: [
        'Todo el plan Motor de Arranque',
        'Delivery integrado',
        'Tienda online',
        '5 usuarios',
        'Reportes avanzados',
      ],
    },
    {
      name: 'Empresas',
      price: '99.990',
      period: 'por mes · 7 días gratis',
      popular: false,
      description: 'Para operaciones completas',
      features: [
        'Todo el plan Profesional',
        'Producción y fórmulas',
        'Multi-sucursal',
        'Usuarios ilimitados',
        'Soporte prioritario',
      ],
    },
  ]

  const segments = [
    {
      name: 'Minimarkets',
      description: 'Control de stock, PDV ágil y gestión financiera',
    },
    {
      name: 'Panaderías',
      description: 'Producción con fórmulas, control de insumos y vitrina',
    },
    {
      name: 'Cafeterías y Snacks',
      description: 'KDS de cocina, delivery integrado y carta digital',
    },
    {
      name: 'Pequeños Productores',
      description: 'Fórmulas ANVISA, POP automático y trazabilidad',
    },
  ]

  return (
    <>
      <Helmet>
        <title>NegociPro - Sistema POS para Pequeños Negocios</title>
        <meta name="description" content="Sistema POS completo para pequeños negocios. Inventario, ventas, delivery y finanzas. Funciona offline. ¡Prueba gratis 14 días!" />
        <meta property="og:title" content="NegociPro - Sistema POS para Pequeños Negocios" />
        <meta property="og:description" content="Gestión completa para tu negocio: inventario, ventas, delivery y más." />
        <meta name="keywords" content="POS, inventario, ventas, pequeño negocio, tienda, Chile, Latinoamérica" />
      </Helmet>
      <div className="min-h-screen bg-light-base dark:bg-dark-base text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-light-base/95 dark:bg-dark-base/95 backdrop-blur-sm z-50 border-b border-gray-300 dark:border-gray-700 shadow-neo-light-sm dark:shadow-neo-dark-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-2">
              <Store className="h-8 w-8 text-primary-500 dark:text-primary-400" />
              <span className="text-xl font-bold text-gray-800 dark:text-gray-100">NegociPro</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors">
                Funcionalidades
              </a>
              <a href="#segments" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors">
                Segmentos
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors">
                Planes
              </a>
            </nav>
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-neo bg-light-base dark:bg-dark-base text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 shadow-neo-light-sm dark:shadow-neo-dark-sm"
                aria-label="Cambiar tema"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link
                to="/login"
                className="text-gray-800 dark:text-gray-100 hover:text-primary-500 dark:hover:text-primary-400 font-medium"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-primary-500 dark:bg-primary-600 text-white px-4 py-2 rounded-neo hover:bg-primary-400 dark:hover:bg-primary-500 transition-colors font-medium shadow-neo-primary dark:shadow-neo-primary-dark"
              >
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Tu negocio entero en un solo lugar
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              PDV, stock, delivery, finanzas, tienda online — todo conectado en una única plataforma
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-primary-500 dark:bg-primary-600 text-white px-8 py-4 rounded-neo hover:shadow-neo-light-lg dark:hover:shadow-neo-dark-lg transition-all duration-200 font-semibold text-lg inline-flex items-center justify-center gap-2 shadow-neo-primary dark:shadow-neo-primary-dark"
              >
                Comenzar Gratis
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="bg-light-base dark:bg-dark-base text-gray-800 dark:text-gray-100 px-8 py-4 rounded-neo hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 font-semibold text-lg inline-flex items-center justify-center border border-gray-300 dark:border-gray-700 shadow-neo-light dark:shadow-neo-dark"
              >
                Saber más
              </a>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Comienza gratis hoy y gestiona tu negocio como profesional
            </p>
          </div>

          {/* Features Highlight */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            <div className="card-neo p-6 text-center">
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">100%</p>
              <p className="text-gray-600 dark:text-gray-400">Funciona offline</p>
            </div>
            <div className="card-neo p-6 text-center">
              <p className="text-3xl font-bold text-success-500 dark:text-success-400">0</p>
              <p className="text-gray-600 dark:text-gray-400">Costo oculto</p>
            </div>
            <div className="card-neo p-6 text-center">
              <p className="text-3xl font-bold text-primary-500 dark:text-primary-400">∞</p>
              <p className="text-gray-600 dark:text-gray-400">Productos gestionables</p>
            </div>
            <div className="card-neo p-6 text-center">
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">Gratis</p>
              <p className="text-gray-600 dark:text-gray-400">Para empezar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-12 bg-light-base dark:bg-dark-base border-y border-gray-300 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                {benefit.icon}
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{benefit.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-light-base dark:bg-dark-base">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Gestión Completa
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              PDV, stock y finanzas integrados en una sola plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-neo p-8 hover:shadow-neo-lg transition-all duration-200">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Todo lo que tu negocio necesita en un solo lugar
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Diseñado para minimarkets, panaderías, cafeterías y pequeños negocios que quieren
                organizarse y crecer
              </p>
              <div className="space-y-4">
                {[
                  'Soporte especializado: Equipe dedicada lista para resolver cualquier duda',
                  'Precios justos: Sin sorpresas, transparentes y sin tarifas ocultas',
                  'Crecimiento real: Herramientas para vender más y fidelizar clientes',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-success-500 dark:text-success-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-800 dark:text-gray-100">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="card-neo p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Ingresos del mes
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">$3.245.890</p>
                <p className="text-sm text-success-500 dark:text-success-400 mt-1">+15.3% vs mes anterior</p>
              </div>
              <div className="card-neo p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pedidos hoy</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">147</p>
                <p className="text-sm text-primary-500 dark:text-primary-400 mt-1">+23 vs ayer</p>
              </div>
              <div className="card-neo p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Clientes nuevos
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">23</p>
                <p className="text-sm text-success-500 dark:text-success-400 mt-1">+8% vs semana pasada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Segments Section */}
      <section id="segments" className="py-20 px-4 bg-light-base dark:bg-dark-base">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Segmentos
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Hecho a medida para tu negocio
            </p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              NegociPro se adapta a tu segmento con módulos específicos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {segments.map((segment, index) => (
              <div key={index} className="card-neo p-6">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {segment.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {segment.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-light-base dark:bg-dark-base">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Precios
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Simples y transparentes
            </p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Plan base + módulos bajo demanda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`card-neo p-8 hover:shadow-neo-light-lg dark:hover:shadow-neo-dark-lg transition-all ${
                  plan.popular ? 'ring-2 ring-primary-500 dark:ring-primary-400 relative' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 dark:bg-primary-400 text-white px-4 py-1 rounded-neo text-sm font-semibold flex items-center gap-1 shadow-neo-primary dark:shadow-neo-primary-dark">
                      <Star className="h-4 w-4" />
                      Más popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {' '}
                    {plan.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-800 dark:text-gray-100">
                      <Check className="h-5 w-5 text-success-500 dark:text-success-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full text-center py-3 rounded-neo font-semibold transition-all duration-200 shadow-neo-light dark:shadow-neo-dark ${
                    plan.popular
                      ? 'bg-primary-500 dark:bg-primary-400 text-white hover:shadow-neo-light-lg dark:hover:shadow-neo-dark-lg'
                      : 'bg-light-base dark:bg-dark-base text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  Probar gratis
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-3">
                  Sin tarjeta · Cancelar cuando quieras
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            Sin permanencia mínima · Cancela cuando quieras · Soporte incluido en todos los planes
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary-500 dark:bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="text-xl text-primary-100 dark:text-primary-200 mb-8">
            Únete a cientos de establecimientos que ya usan NegociPro para vender más y gastar
            menos
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-500 dark:text-primary-600 px-8 py-4 rounded-neo hover:shadow-neo-light-lg dark:hover:shadow-neo-dark-lg transition-all duration-200 font-semibold text-lg shadow-neo-primary dark:shadow-neo-primary-dark"
          >
            Crear mi cuenta gratis
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-primary-100 dark:text-primary-200 mt-4 text-sm">
            14 días gratis · Sin tarjeta de crédito requerida
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-light-base dark:bg-dark-base text-gray-600 dark:text-gray-400 py-12 px-4 border-t border-gray-300 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Store className="h-6 w-6 text-primary-500 dark:text-primary-400" />
                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">NegociPro</span>
              </div>
              <p className="text-sm">
                Sistema de gestión completo para pequeños negocios en Latinoamérica
              </p>
            </div>
            <div>
              <h4 className="text-gray-800 dark:text-gray-100 font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a
                    href="#segments"
                    className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Segmentos
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Planes
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-800 dark:text-gray-100 font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Sobre nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-800 dark:text-gray-100 font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Términos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Soporte
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-700 pt-8 text-center text-sm">
            <p>© 2026 NegociPro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}

export default LandingPage
