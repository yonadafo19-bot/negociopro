# Guía de Testing - NegociPro

## 📋 Índice

1. [Tipos de Testing](#tipos-de-testing)
2. [Testing Manual](#testing-manual)
3. [Testing Automatizado](#testing-automatizado)
4. [Testing E2E](#testing-e2e)
5. [Testing de Performance](#testing-de-performance)
6. [Testing de Seguridad](#testing-de-seguridad)
7. [Checklist Pre-Deploy](#checklist-pre-deploy)

## 🧪 Tipos de Testing

### Niveles de Testing

```
┌─────────────────────────────────────┐
│     E2E Testing (Cypress)          │  ← Testea toda la app
├─────────────────────────────────────┤
│   Integration Testing (Vitest)     │  ← Testea integración de componentes
├─────────────────────────────────────┤
│    Unit Testing (Vitest)           │  ← Testea funciones individuales
└─────────────────────────────────────┘
```

## 👨‍💻 Testing Manual

### Checklist de Funcionalidades

#### Autenticación
- [ ] Registro de nuevo usuario
- [ ] Inicio de sesión con credenciales correctas
- [ ] Error con credenciales incorrectas
- [ ] Cierre de sesión
- [ ] Recuperación de contraseña
- [ ] Persistencia de sesión (recargar página)

#### Dashboard
- [ ] Se muestra el saludo personalizado
- [ ] Las tarjetas de estadísticas muestran datos correctos
- [ ] Los gráficos se renderizan correctamente
- [ ] Las alertas de stock bajo aparecen
- [ ] Las ventas recientes se listan
- [ ] Los botones de quick actions funcionan

#### Inventario
- [ ] Listado de productos se muestra
- [ ] Búsqueda de productos funciona
- [ ] Filtros por categoría funcionan
- [ ] Filtro de stock bajo funciona
- [ ] Crear nuevo producto:
  - [ ] Validación de campos requeridos
  - [ ] Cálculo automático de margen
  - [ ] Preview de imagen
  - [ ] Producto se guarda correctamente
- [ ] Editar producto:
  - [ ] Datos se cargan correctamente
  - [ ] Cambios se guardan
- [ ] Eliminar producto:
  - [ ] Confirmación aparece
  - [ ] Producto se elimina de la lista
- [ ] Indicador de stock funciona
- [ ] Tarjetas responsive en móvil

#### Ventas
- [ ] Listado de ventas se muestra
- [ ] Filtros por tipo funcionan
- [ ] Crear nueva venta:
  - [ ] Selección de cliente (opcional)
  - [ ] Selector de productos funciona
  - [ ] Búsqueda de productos funciona
  - [ ] Agregar producto al carrito:
    - [ ] Verifica stock disponible
    - [ ] No permite sobreventa
    - [ ] Actualiza subtotal
  - [ ] Modificar cantidad:
    - [ ] Botones +/− funcionan
    - [ ] Input manual funciona
    - [ ] Respeta stock máximo
  - [ ] Eliminar del carrito funciona
  - [ ] Cálculo de IVA (16%)
  - [ ] Total es correcto
  - [ ] Selección de método de pago
  - [ ] Venta se registra
  - [ ] Stock se actualiza
- [ ] Ver detalles de venta
- [ ] Eliminar venta (con confirmación)

#### Contactos
- [ ] Listado de contactos se muestra
- [ ] Filtros por tipo funcionan (clientes, proveedores, empleados)
- [ ] Crear nuevo contacto:
  - [ ] Validación de campos
  - [ ] Selección de tipo
  - [ ] Contacto se guarda
- [ ] Editar contacto funciona
- [ ] Eliminar contacto funciona
- [ ] Badges de colores por tipo

#### Reportes
- [ ] Métricas de rendimiento se calculan correctamente:
  - [ ] Ingresos totales
  - [ ] Gastos totales
  - [ ] Utilidad
  - [ ] Margen de utilidad
  - [ ] Ticket promedio
- [ ] Comparativas funcionan:
  - [ ] Hoy vs ayer
  - [ ] Esta semana vs semana pasada
  - [ ] Este mes vs mes pasado
- [ ] Top productos muestra correctamente
- [ ] Top clientes muestra correctamente
- [ ] Gráfico de tendencia de ventas:
  - [ ] Últimos 30 días
  - [ ] Datos correctos
  - [ ] Responsive
- [ ] Gráfico de ventas por categoría:
  - [ ] Porcentajes correctos
  - [ ] Colores correctos
- [ ] Exportar a Excel funciona

#### Catálogos
- [ ] Listado de catálogos se muestra
- [ ] Stats se calculan correctamente
- [ ] Crear catálogo:
  - [ ] Selección de productos funciona
  - [ ] Selección de tema funciona
  - [ ] Toggle público/privado funciona
  - [ ] Catálogo se crea
- [ ] Editar catálogo funciona
- [ ] Eliminar catálogo funciona
- [ ] Vista previa funciona
- [ ] Compartir catálogo:
  - [ ] Link se genera correctamente
  - [ ] Copiar al portapapeles funciona
  - [ ] Abrir en nueva pestaña funciona
- [ ] Página pública:
  - [ ] Se muestra sin auth
  - [ ] Productos se listan
  - [ ] Contacto por WhatsApp funciona
  - [ ] Tema se aplica correctamente
  - [ ] Contador de vistas incrementa

#### Sincronización
- [ ] Indicador de estado online funciona
- [ ] Al desconectar:
  - [ ] Indicador cambia a offline
  - [ ] Se puede seguir usando la app
- [ ] Crear producto offline:
  - [ ] Se guarda en IndexedDB
  - [ ] Aparece en cola de sync
- [ ] Al reconectar:
  - [ ] Sincronización automática inicia
  - [ ] Datos se suben a Supabase
  - [ ] Cola se vacía
- [ ] Sincronización manual funciona
- [ ] Página de sync muestra estadísticas correctas

#### UI/UX
- [ ] Modo oscuro/claro toggle funciona
- [ ] Persistencia de tema
- [ ] Menú móvil funciona
- [ ] Navegación correcta
- [ ] Active states en links
- [ ] Loading states funcionan
- [ ] Error states se muestran
- [ ] Empty states aparecen cuando no hay datos
- [ ] Responsive en todos los breakpoints
- [ ] Scroll funciona correctamente
- [ ] Hover states funcionan

## 🤖 Testing Automatizado

### Configurar Vitest

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

### Crear archivo de configuración

**vitest.config.js**:
```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Setup de testing

**src/test/setup.js**:
```javascript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Limpiar después de cada test
afterEach(() => {
  cleanup()
})

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock de IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return [] }
  unobserve() {}
}
```

### Ejemplo de Test Unitario

**src/hooks/__tests__/useAuth.test.js**:
```javascript
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { AuthProvider } from '../../context/AuthContext'

describe('useAuth', () => {
  it('debería iniciar sin usuario', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
  })

  it('debería tener loading en false inicialmente', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.loading).toBe(false)
  })
})
```

### Ejemplo de Test de Componente

**src/components/common/__tests__/Button.test.jsx**:
```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  it('debería renderizarse correctamente', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('debería llamar a onClick al hacer click', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByText('Click me'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('debería estar deshabilitado cuando disabled es true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

## 🎭 Testing E2E con Playwright

### Instalar Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

### Configuración

**playwright.config.js**:
```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Ejemplo de Test E2E

**e2e/auth.spec.js**:
```javascript
import { test, expect } from '@playwright/test'

test.describe('Autenticación', () => {
  test('registro de nuevo usuario', async ({ page }) => {
    await page.goto('/register')

    // Llenar formulario
    await page.fill('[name="fullName"]', 'Juan Pérez')
    await page.fill('[name="businessName"]', 'Mi Negocio')
    await page.fill('[name="email"]', 'juan@example.com')
    await page.fill('[name="password"]', 'Password123!')
    await page.fill('[name="confirmPassword"]', 'Password123!')

    // Enviar formulario
    await page.click('button[type="submit"]')

    // Verificar redirección al dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Hola, Juan')
  })

  test('inicio de sesión', async ({ page }) => {
    await page.goto('/login')

    await page.fill('[name="email"]', 'juan@example.com')
    await page.fill('[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
  })
})
```

**e2e/inventory.spec.js**:
```javascript
import { test, expect } from '@playwright/test'

test.describe('Inventario', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('crear producto', async ({ page }) => {
    await page.goto('/inventory')
    await page.click('button:has-text("Nuevo Producto")')

    await page.fill('[name="name"]', 'Producto de Prueba')
    await page.fill('[name="sku"]', 'TEST-001')
    await page.selectOption('[name="category"]', 'Electrónicos')
    await page.fill('[name="salePrice"]', '100')
    await page.fill('[name="stockQuantity"]', '50')

    await page.click('button:has-text("Crear Producto")')

    // Verificar que el producto aparece en la lista
    await expect(page.locator('text=Producto de Prueba')).toBeVisible()
  })

  test('buscar producto', async ({ page }) => {
    await page.goto('/inventory')
    await page.fill('input[placeholder*="Buscar"]', 'Producto')
    await expect(page.locator('text=Producto de Prueba')).toBeVisible()
  })
})
```

## ⚡ Testing de Performance

### Lighthouse CI

```bash
npm install -D @lhci/cli
```

**lighthouserc.js**:
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

### Métricas Objetivo

- **Performance**: >90
- **Accessibility**: >90
- **Best Practices**: >90
- **SEO**: >90
- **PWA**: 100

## 🔒 Testing de Seguridad

### OWASP ZAP

```bash
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000 \
  -r report.html
```

### Checklist de Seguridad

- [ ] No hay credenciales hardcoded
- [ ] Variables de entorno están en `.env.local` (no en repo)
- [ ] RLS de Supabase está activado
- [ ] HTTPS está habilitado
- [ ] Headers de seguridad están configurados:
  - [ ] X-Content-Type-Options
  - [ ] X-Frame-Options
  - [ ] X-XSS-Protection
  - [ ] Content-Security-Policy
- [ ] No hay XSS vulnerabilities
- [ ] SQL injection está prevenido (Supabase lo maneja)
- [ ] Auth tokens se almacenan de forma segura

## ✅ Checklist Pre-Deploy

### Código

- [ ] No hay `console.log` en producción
- [ ] No hay código comentado
- [ ] Variables tienen nombres descriptivos
- [ ] No hay `any` types (si usas TypeScript)
- [ ] Componentes están bien documentados
- [ ] Linting pasa sin errores
- [ ] Tests pasan
- [ ] Build de producción es exitoso

### Funcionalidad

- [ ] Todas las features principales funcionan
- [ ] No hay bugs críticos
- [ ] Error handling está implementado
- [ ] Loading states funcionan
- [ ] Validaciones están en su lugar
- [ ] Responsive design funciona
- [ ] Accesibilidad está considerada

### Performance

- [ ] Bundle size es razonable (<500KB)
- [ ] Time to Interactive <3s
- [ ] First Contentful Paint <1.5s
- [ ] Imágenes están optimizadas
- [ ] Code splitting está implementado
- [ ] Lazy loading funciona

### SEO

- [ ] Meta tags están presentes
- [ ] Open Graph tags están presentes
- [ ] Manifest está configurado
- [ ] Sitemap está generado
- [ ] Robots.txt está presente

### Deploy

- [ ] Variables de entorno están configuradas
- [ ] Dominio está configurado
- [ ] HTTPS está habilitado
- [ ] Analytics está configurado
- [ ] Error tracking está configurado
- [ ] Backup plan está listo

## 🚀 Ejecutar Tests

### Todos los tests

```bash
# Unit tests
npm run test

# Tests con UI
npm run test:ui

# Tests con coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Performance tests
npm run lighthouse

# Linting
npm run lint

# Type checking
npm run type-check
```

### CI/CD Pipeline

**.github/workflows/test.yml**:
```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 📊 Reportes

### Generar Reporte

```bash
# Coverage report
npm run test:coverage
open coverage/index.html

# E2E report
npx playwright test --reporter=html
open playwright-report/index.html

# Lighthouse report
npm run lighthouse
open lighthouse-report.html
```

---

**Última actualización**: Marzo 2025
**Versión**: 1.0.0
