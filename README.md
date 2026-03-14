# 🏪 NegociPro

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Sistema completo de gestión para pequeños negocios y emprendedores en Latinoamérica**

[Características](#-características) • [Demo](#-demo-en-vivo) • [Instalación](#-instalación) • [Documentación](#-documentación) • [Contribuir](#-contribuir)

</div>

---

## ✨ Características

### 💼 Gestión de Negocio

- **📦 Inventario Completo**: Control de stock, alertas de bajo inventario, categorías, SKU, precios de costo y venta
- **💰 Punto de Venta (POS)**: Registro de ventas, carrito de compras, múltiples métodos de pago, cálculo automático de IVA
- **👥 Gestión de Contactos**: Clientes, proveedores y empleados con información detallada
- **📊 Dashboard en Tiempo Real**: Métricas clave, gráficos de ventas, alertas de stock, resumen financiero

### 📈 Analytics y Reportes

- **📉 Reportes Avanzados**: Ventas por período, productos más vendidos, mejores clientes, márgenes de ganancia
- **📊 Gráficos Interactivos**: Tendencias, comparativas, distribuciones con Recharts
- **📥 Exportar a Excel**: Reportes completos descargables para análisis externo
- **🎯 Comparativas**: Hoy vs ayer, esta semana vs semana pasada, este mes vs mes pasado

### 🛒 Catálogos Virtuales

- **🔗 Links Compartibles**: Genera catálogos públicos con URL única
- **🎨 5 Temas de Color**: Personaliza la apariencia de tus catálogos
- **📱 Vista Pública Optimizada**: Perfecta para compartir por WhatsApp o redes sociales
- **👁️ Contador de Vistas**: Monitorea la popularidad de tus catálogos
- **🛍️ Contacto Directo**: Los clientes pueden pedir por WhatsApp directamente

### 📱 Modo Offline

- **💾 Funciona Sin Internet**: Opera completamente offline usando Service Workers
- **🔄 Sincronización Automática**: Los cambios se sincronizan al volver la conexión
- **📊 Cola de Operaciones**: IndexedDB para guardar cambios pendientes
- **🔔 Indicador de Estado**: Notificaciones visuales de conexión y sincronización

### 🎨 UI/UX

- **🌓 Modo Oscuro/Claro**: Toggle de tema con persistencia
- **📱 Diseño Responsive**: Optimizado para móvil, tablet y desktop
- **♿ Accesible**: WCAG AA compliant con alto contraste
- **⚡ Rápido**: Code splitting, lazy loading, optimizado para performance
- **🎭 Animaciones Suaves**: Transiciones y micro-interacciones agradables

---

## 🛠️ Stack Tecnológico

### Frontend

```
React 19          - UI Library
Vite 5            - Build Tool & Dev Server
React Router 6    - Client-side Routing
TailwindCSS 3     - Styling
Zustand           - State Management
Recharts          - Charts & Graphs
Lucide React      - Icons
XLSX              - Excel Export
UUID              - Unique IDs
```

### Backend

```
Supabase          - BaaS (Backend as a Service)
├── PostgreSQL    - Database
├── Auth          - Authentication
├── Storage       - File Storage
└── RLS           - Row Level Security
```

### DevOps

```
Vercel            - Hosting & CI/CD
GitHub            - Version Control
ESLint            - Linting
Vitest            - Unit Testing
Playwright        - E2E Testing
```

---

## 🎥 Demo en Vivo

[![NegociPro Demo](https://img.shields.io/badge/Demo-En%20Vivo-success.svg?style=for-the-badge)](https://negociopro.vercel.app)

Prueba la aplicación en: **[negociopro.vercel.app](https://negociopro.vercel.app)**

### Credenciales de Demo

```
Email: demo@negoci.pro
Password: Demo123!
```

---

## 📦 Instalación

### Requisitos Previos

- Node.js 18+ y npm/yarn
- Cuenta en [Supabase](https://supabase.com)
- Git instalado

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/negociopro.git
cd negociopro
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Crea un proyecto nuevo en [Supabase](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta `supabase/migrations/001_initial_schema.sql`
3. Ejecuta `supabase/migrations/002_rls_policies.sql`
4. Copia tu **Project URL** y **anon key** desde **Settings → API**

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 5. Iniciar Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📁 Estructura del Proyecto

```
negociopro/
├── public/
│   ├── sw.js                 # Service Worker para offline
│   ├── manifest.json         # PWA Manifest
│   ├── offline.html          # Página offline
│   └── favicon.svg           # Favicon
├── src/
│   ├── components/           # Componentes React
│   │   ├── common/          # Botones, inputs, modales, etc.
│   │   ├── layout/          # Header, Sidebar, Layout
│   │   ├── dashboard/       # Componentes del dashboard
│   │   ├── inventory/       # Componentes de inventario
│   │   ├── sales/           # Componentes de ventas
│   │   ├── contacts/        # Componentes de contactos
│   │   ├── reports/         # Componentes de reportes
│   │   ├── catalogs/        # Componentes de catálogos
│   │   └── connection/      # Componentes de conexión
│   ├── context/             # Context API
│   │   ├── AuthContext.jsx  # Contexto de autenticación
│   │   ├── ThemeContext.jsx # Contexto de tema
│   │   └── ConnectionContext.jsx # Contexto de conexión
│   ├── hooks/               # Custom Hooks
│   │   ├── useAuth.js       # Hook de autenticación
│   │   ├── useInventory.js  # Hook de inventario
│   │   ├── useSales.js      # Hook de ventas
│   │   ├── useContacts.js   # Hook de contactos
│   │   ├── useReports.js    # Hook de reportes
│   │   ├── useCatalogs.js   # Hook de catálogos
│   │   └── useOfflineMutation.js # Hook offline
│   ├── pages/               # Páginas principales
│   │   ├── Auth/            # Login, registro, etc.
│   │   ├── Dashboard.jsx    # Dashboard principal
│   │   ├── Inventory.jsx    # Página de inventario
│   │   ├── Sales.jsx        # Página de ventas
│   │   ├── Contacts.jsx     # Página de contactos
│   │   ├── Reports.jsx      # Página de reportes
│   │   ├── Catalogs.jsx     # Página de catálogos
│   │   ├── Settings.jsx     # Configuración
│   │   ├── SyncSettings.jsx # Configuración de sync
│   │   └── PublicCatalog.jsx # Catálogo público
│   ├── routes/              # Configuración de rutas
│   ├── services/            # Servicios API
│   │   └── supabase.js     # Cliente de Supabase
│   ├── utils/               # Utilidades
│   │   └── validators.js   # Validadores de formularios
│   ├── App.jsx              # Componente principal
│   └── main.jsx             # Entry point
├── supabase/
│   └── migrations/          # Migraciones SQL
│       ├── 001_initial_schema.sql
│       └── 002_rls_policies.sql
├── docs/                    # Documentación
│   ├── DEPLOYMENT_GUIDE.md  # Guía de despliegue
│   ├── TESTING_GUIDE.md     # Guía de testing
│   └── OFFLINE_DOCUMENTATION.md # Docs de offline
├── .eslintrc.json          # Configuración de ESLint
├── vite.config.js          # Configuración de Vite
├── tailwind.config.js      # Configuración de Tailwind
├── vercel.json             # Configuración de Vercel
├── package.json            # Dependencias y scripts
└── README.md               # Este archivo
```

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Build
npm run build            # Build para producción
npm run preview          # Preview del build local

# Calidad de Código
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Corregir problemas de linting
npm run format           # Formatear código con Prettier

# Testing
npm run test             # Ejecutar tests unitarios
npm run test:ui          # Tests con UI de Vitest
npm run test:coverage    # Tests con coverage report
npm run test:e2e         # Ejecutar tests E2E con Playwright

# Deploy
npm run predeploy        # Build + tests antes de deploy
npm run deploy:vercel    # Deploy a Vercel
```

---

## 📚 Documentación

- **[Guía de Despliegue](./DEPLOYMENT_GUIDE.md)** - Instrucciones completas de despliegue a producción
- **[Guía de Testing](./TESTING_GUIDE.md)** - Estrategias de testing y ejemplos
- **[Documentación Offline](./OFFLINE_DOCUMENTATION.md)** - Sistema offline y sincronización

---

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:coverage
```

---

## 🌐 Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/negociopro)

1. Haz clic en el botón de arriba
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno
4. ¡Deploy automático en cada push!

### Manual

```bash
npm run build
vercel --prod
```

Ver [Guía de Despliegue](./DEPLOYMENT_GUIDE.md) para más detalles.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue el estilo de código existente
- Escribe tests para nuevas features
- Actualiza la documentación
- Mantén los commits pequeños y enfocados

---

## 📝 Roadmap

### Versión 1.1 (Próximas features)

- [ ] Sistema de facturación electrónica
- [ ] Integración con pasarelas de pago (Stripe, MercadoPago)
- [ ] Múltiples monedas y idiomas
- [ ] Exportar a PDF
- [ ] Modo multi-sucursal
- [ ] Backup y restore de datos

### Versión 2.0 (Futuro)

- [ ] App móvil nativa (React Native)
- [ ] Sincronización en tiempo real con WebSockets
- [ ] Análisis predictivo con IA
- [ ] Integración con contabilidad electrónica
- [ ] Marketplace de integraciones

---

## 🐛 Problemas Conocidos

Consulta los [issues](https://github.com/tu-usuario/negociopro/issues) para ver problemas conocidos y reportar nuevos.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## 👨‍💻 Autor

**Tu Nombre**

- Twitter: [@tuusuario](https://twitter.com/tuusuario)
- GitHub: [@tuusuario](https://github.com/tuusuario)

---

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) - Backend as a Service increíble
- [Vercel](https://vercel.com) - Hosting y deploy fantástico
- [Vite](https://vitejs.dev) - Herramienta de build super rápida
- [React](https://react.dev) - Librería UI revolucionaria

---

## 📞 Soporte

- 📧 Email: support@negoci.pro
- 💬 Discord: [Únete a nuestra comunidad](https://discord.gg/negociopro)
- 📖 Docs: [negoci.pro/docs](https://negoci.pro/docs)

---

<div align="center">

**Hecho con ❤️ para emprendedores latinos**

⭐ Si te gusta este proyecto, dale una estrella en GitHub!

[⬆ Volver al inicio](#-negociopro)

</div>
