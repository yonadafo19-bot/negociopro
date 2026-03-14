# Changelog - NegociPro

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planificado
- Sistema de facturación electrónica
- Integración con pasarelas de pago
- Múltiples monedas
- Exportar a PDF

## [1.0.0] - 2025-03-13

### Agregado
- **Sistema de Autenticación Completo**
  - Registro de usuarios con validación
  - Inicio de sesión con credenciales
  - Cierre de sesión seguro
  - Recuperación de contraseña
  - Perfil de usuario editable
  - Gestión de nombre del negocio

- **Gestión de Inventario**
  - CRUD completo de productos
  - Campos: nombre, SKU, categoría, stock, precios, imagen
  - Alertas de stock bajo
  - Búsqueda y filtros por categoría
  - Tarjetas con preview de imagen
  - Cálculo automático de margen de ganancia
  - Soft delete para preservar historial

- **Punto de Venta (POS)**
  - Carrito de compras completo
  - Selector de productos con búsqueda
  - Prevención de sobreventa
  - Selección de clientes (opcional)
  - Múltiples métodos de pago
  - Cálculo automático de IVA (16%)
  - Registro de gastos
  - Historial de transacciones

- **Gestión de Contactos**
  - Clientes, proveedores y empleados
  - Información detallada (email, teléfono, dirección, RFC)
  - Filtros por tipo
  - Búsqueda de contactos
  - CRUD completo

- **Dashboard Interactivo**
  - Saludo personalizado
  - Tarjetas de estadísticas (productos, ventas, clientes, balance)
  - Gráfico de ventas últimos 7 días
  - Alertas de stock bajo
  - Accesos rápidos a features principales
  - Ventas recientes

- **Reportes y Analytics**
  - Top 10 productos más vendidos
  - Top 10 clientes por volumen de compra
  - Ventas por categoría (gráfico de pie)
  - Tendencia de ventas (gráfico de línea)
  - Métricas de rendimiento:
    - Ingresos totales
    - Gastos totales
    - Utilidad
    - Margen de utilidad
    - Ticket promedio
  - Comparativas:
    - Hoy vs ayer
    - Esta semana vs semana pasada
    - Este mes vs mes pasado
  - Exportar a Excel

- **Catálogos Virtuales**
  - Creación de catálogos compartibles
  - Selección de productos
  - 5 temas de colores
  - Catálogos públicos/privados
  - Links únicos para compartir
  - Vista previa de catálogo
  - Compartir por WhatsApp/Email
  - Contador de vistas
  - Página pública optimizada
  - Contacto directo por WhatsApp

- **Modo Offline**
  - Service Worker con cache-first strategy
  - IndexedDB para cola de sincronización
  - Detección automática de conexión
  - Sincronización automática al reconectar
  - Sincronización manual
  - Indicador visual de estado
  - Soporte offline para todas las operaciones
  - Página offline visualmente atractiva

- **UI/UX**
  - Diseño responsive completo
  - Modo oscuro/claro con persistencia
  - Toggle de tema
  - Animaciones suaves
  - Loading states
  - Error states
  - Empty states
  - Header responsive con menú hamburguesa
  - Sidebar fijo en desktop
  - Navegación con active states

- **PWA Features**
  - Manifest completo
  - Iconos de múltiples tamaños
  - Shortcuts para acciones rápidas
  - Instalable como app
  - Splash screen
  - Theme color

- **Documentación**
  - README completo con badges
  - Guía de despliegue detallada
  - Guía de testing exhaustiva
  - Documentación de sistema offline
  - Changelog

### Stack Tecnológico
- React 19
- Vite 5
- React Router DOM 6
- Zustand
- TailwindCSS 3
- Supabase (PostgreSQL + Auth + Storage)
- Recharts
- XLSX
- Lucide React

### DevOps
- Configuración de Vercel
- CI/CD con GitHub Actions
- ESLint configurado
- Vitest para unit tests
- Playwright para E2E tests
- Lighthouse para performance

### Seguridad
- Row Level Security (RLS) en Supabase
- Headers de seguridad
- Validación de inputs
- Sanitización de datos
- Prevención de XSS

### Performance
- Code splitting
- Lazy loading
- Optimización de bundle
- Imágenes optimizadas
- Service Worker para cache

### Configuración
- Environment variables
- Migraciones SQL
- Políticas RLS
- Service Worker
- Manifest PWA
- Vercel config

---

## [0.1.0] - 2025-03-01

### Agregado
- Estructura inicial del proyecto
- Configuración de Vite + React
- TailwindCSS setup
- Estructura de carpetas
- README básico

---

## Convenciones de Commits

- `feat:` Nueva feature
- `fix:` Bug fix
- `docs:` Cambios en documentación
- `style:` Cambios de formato (espacios, etc)
- `refactor:` Refactorización de código
- `test:` Agregar tests
- `chore:` Actualizar tareas de build/config

---

## Enlaces

- [Repositorio](https://github.com/tu-usuario/negociopro)
- [Issues](https://github.com/tu-usuario/negociopro/issues)
- [Releases](https://github.com/tu-usuario/negociopro/releases)

---

**Nota:** Este proyecto sigue versionamiento semántico. Para más información, ver [semver.org](https://semver.org/).
