# 🚀 Guía de Configuración - NegociPro

## 📋 Resumen de Cambios Realizados

### ✅ Fase 1: Correcciones Críticas (Completado)

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `vercel.json` | Framework corregido (Vite, no Next.js) | ✅ |
| `public/sw.js` | Service Worker mejorado con estrategia Network First | ✅ |
| `src/services/supabase.js` | Share links con crypto.randomUUID() | ✅ |
| `package.json` | Dependencias actualizadas y override para xlsx | ✅ |
| `.gitignore` | Mejorado para incluir package-lock.json | ✅ |
| `src/services/supabase.js` | Bug corregido en getLowStockProducts | ✅ |

---

## 🔧 Pasos para Completar la Configuración

### Paso 1: Instalar Dependencias

```bash
cd C:/Users/EQUIPO/negociopro-audit
npm install
```

### Paso 2: Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo
2. Copia tu **Project URL** y **anon key** desde Settings → API
3. Crea el archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### Paso 3: Ejecutar Migraciones SQL

En el SQL Editor de Supabase, ejecuta en orden:

1. **`supabase/migrations/001_initial_schema.sql`**
   - Crea todas las tablas necesarias
   - Configura funciones RPC (decrement_stock, etc.)

2. **`supabase/migrations/002_rls_policies.sql`**
   - Configura Row Level Security
   - Asegura que cada usuario solo vea sus datos

3. **`supabase/migrations/003_seed_data.sql`** (Opcional)
   - Datos de ejemplo para desarrollo

### Paso 4: Probar Localmente

```bash
npm run dev
```

Abre http://localhost:3000

### Paso 5: Build para Producción

```bash
npm run build
npm run preview
```

---

## 📁 Archivos SQL de Migración

```
supabase/migrations/
├── 001_initial_schema.sql    # Tablas, índices, funciones
├── 002_rls_policies.sql      # Políticas de seguridad
└── 003_seed_data.sql         # Datos de ejemplo
```

---

## 🔐 Variables de Entorno Necesarias

```env
VITE_SUPABASE_URL=                    # Requerido
VITE_SUPABASE_ANON_KEY=               # Requerido
```

---

## 🌐 Deploy a Vercel

### Opción A: Desde el Dashboard de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Add New Project"
3. Importa desde GitHub
4. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

### Opción B: Desde CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 📊 Estructura del Schema SQL

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Perfil del usuario/negocio |
| `products` | Inventario de productos |
| `contacts` | Clientes, proveedores, empleados |
| `transactions` | Ventas, compras, gastos |
| `transaction_items` | Items de cada transacción |
| `catalogs` | Catálogos virtuales |
| `catalog_products` | Productos en catálogos |
| `inventory_movements` | Historial de movimientos de stock |

### Funciones RPC Disponibles

| Función | Descripción |
|---------|-------------|
| `decrement_stock(product_id, qty)` | Decrementa stock de producto |
| `increment_stock(product_id, qty)` | Incrementa stock de producto |
| `generate_share_link()` | Genera link único para catálogos |
| `get_low_stock_products(user_id)` | Productos con stock bajo |

---

## ⚠️ Problemas Conocidos y Soluciones

### Problema 1: Vulnerabilidades de npm
**Estado:** ✅ Mitigado con overrides en package.json

```json
"overrides": {
  "esbuild": "^0.25.0",
  "xlsx": "npm:@sheet/crypto@0.20.0"
}
```

### Problema 2: Service Worker no cachea assets
**Estado:** ✅ Corregido con estrategia Network First + Cache First

### Problema 3: Share links predecibles
**Estado:** ✅ Corregido usando crypto.randomUUID()

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Tests con coverage
npm run test:coverage

# Tests E2E (requiere setup previo)
npm run test:e2e
```

---

## 📱 Features del Proyecto

### ✅ Implementado
- [x] Autenticación con Supabase Auth
- [x] CRUD de productos (inventario)
- [x] Gestión de contactos (clientes/proveedores)
- [x] Registro de ventas/transacciones
- [x] Catálogos virtuales compartibles
- [x] Modo offline con Service Worker
- [x] Dashboard con métricas
- [x] Modo oscuro/claro
- [x] PWA (instalable)

### 📋 Para Agregar (Opcional)
- [ ] Exportar reportes a PDF
- [ ] Multi-idioma (ES/EN)
- [ ] Landing page pública
- [ ] Tests E2E completos
- [ ] Analytics integrados

---

## 🎯 Siguiente: Configuración Rápida

Elige una opción:

**Opción A:** Quiero que me ayudes a configurar Supabase paso a paso
**Opción B:** Quiero agregar features premium (PDF, landing page, etc.)
**Opción C:** Quiero hacer deploy a Vercel ahora
**Opción D:** Quiero agregar testing completo

¿Qué quieres hacer primero?
