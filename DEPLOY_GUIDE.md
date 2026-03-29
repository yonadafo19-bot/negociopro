# 🚀 NegociPro - Guía de Deploy Completo

## ✅ Estado Actual del Proyecto

### Correcciones Realizadas
| Archivo | Fix | Estado |
|---------|-----|--------|
| `vercel.json` | Framework corregido (Vite) | ✅ |
| `public/sw.js` | Service Worker mejorado | ✅ |
| `src/services/supabase.js` | Share links seguros | ✅ |
| `package.json` | Dependencias actualizadas | ✅ |
| Componentes | Imports corregidos | ✅ |
| Build | Exitoso | ✅ |

---

## 🌐 Opción 1: Deploy a Vercel (Recomendado)

### Paso 1: Preparar el Repositorio

```bash
# En tu máquina local
cd C:/Users/EQUIPO/negociopro-audit

# Inicializar git si no está inicializado
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "feat: NegociPro listo para producción

- Sistema de gestión para pequeños negocios
- Inventario, ventas, contactos, catálogos
- Modo offline con Service Worker
- PWA instalable
- Autenticación con Supabase
- Dashboard con métricas
"
```

### Paso 2: Subir a GitHub

1. Crea un repositorio nuevo en GitHub: `github.com/new`
2. Nombre: `negociopro`
3. No inicializar con README (ya existe uno)
4. Luego ejecuta:

```bash
# Renombrar rama a main
git branch -M main

# Agregar remote
git remote add origin https://github.com/TU_USUARIO/negociopro.git

# Push
git push -u origin main
```

### Paso 3: Deploy en Vercel

#### Desde el Dashboard (Más Fácil)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. Configura:

**Framework Preset:** `Vite`

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

**Variables de Entorno:**
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

4. Click en **Deploy**

---

## 🔧 Configuración de Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Click en "New Project"
3. Nombre: `negociopro`
4. Contraseña: Guarda esta contraseña
5. Región: Más cercana a ti

### 2. Ejecutar Migraciones SQL

En el **SQL Editor** de Supabase, ejecuta en orden:

**Archivo 1:** `supabase/migrations/001_initial_schema.sql`
- Crea todas las tablas
- Funciones RPC
- Triggers

**Archivo 2:** `supabase/migrations/002_rls_policies.sql`
- Configura seguridad por usuario
- Row Level Security

### 3. Obtener Credenciales

1. En Supabase, ve a **Settings → API**
2. Copia:
   - **Project URL**
   - **anon/public key**

---

## 🎯 URL del Deploy

Una vez completado, tu app estará en:

```
https://tu-proyecto.vercel.app
```

---

## 📱 Post-Deploy Checklist

- [ ] Autenticación funcional
- [ ] Registro de usuarios
- [ ] Crear productos en inventario
- [ ] Registrar ventas
- [ ] Crear catálogo compartible
- [ ] Modo offline funciona
- [ ] PWA instalable
- [ ] Dark mode funciona

---

## 🐛 Problemas Comunes

### Error: "Database not found"

**Solución:** Ejecuta las migraciones SQL en el SQL Editor de Supabase.

### Error: "Invalid API key"

**Solución:** Verifica que las variables de entorno estén correctas en Vercel.

### Error: "Service Worker failed"

**Solución:** El service worker debe estar en la raíz de `/public`.

---

## 📊 Métricas de Éxito

### Lighthouse Score Objetivo

| Métrica | Objetivo |
|---------|----------|
| Performance | > 90 |
| Accessibility | > 90 |
| Best Practices | > 90 |
| SEO | > 90 |

### Features Portafolio-Worthy

✅ Full-stack (React + Supabase)
✅ Autenticación real
✅ Base de datos relacional
✅ PWA + Offline
✅ Code splitting
✅ Modo oscuro
✅ Export Excel
✅ Catálogos compartibles
✅ Dashboard con gráficos

---

## 🎨 Screenshots para Portafolio

### Páginas a Capturar

1. **Login/Register** - Autenticación
2. **Dashboard** - Métricas y gráficos
3. **Inventario** - CRUD de productos
4. **Ventas** - POS/Terminal de ventas
5. **Catálogos** - Vista de catálogo compartible
6. **Reportes** - Gráficos y exportación
7. **Settings** - Configuración de usuario

---

## 📝 Descripción para Portafolio

```
NegociPro - Sistema de Gestión para Pequeños Negocios

Full-stack application built with React 19, Vite, Supabase, and TailwindCSS.

Features:
- Complete inventory management with low stock alerts
- Point of Sale (POS) system with multiple payment methods
- Customer and supplier relationship management
- Advanced reporting with charts and Excel export
- Shareable product catalogs with view tracking
- Offline-first PWA with background sync
- Dark mode support

Tech Stack:
- Frontend: React 19, Vite 5, TailwindCSS 3, Recharts
- Backend: Supabase (PostgreSQL + Auth + Storage)
- PWA: Service Workers, IndexedDB, Background Sync
- State: Zustand, React Context
- Deploy: Vercel

Key Implementations:
- Row Level Security (RLS) for multi-tenant data isolation
- Offline queue with automatic sync on reconnection
- Code splitting for optimal bundle sizes
- PWA manifest with install prompts
```

---

## 🔗 Links Útiles

- **Demo:** [Tu URL de Vercel]
- **Repo:** [github.com/TU_USUARIO/negociopro]
- **Supabase:** [supabase.com/dashboard]

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en Vercel
2. Verifica las variables de entorno
3. Revisa el SQL Editor de Supabase
4. Checkea la consola del navegador

---

¡Éxito con tu portafolio! 🚀
