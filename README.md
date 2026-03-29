# ⚡ NegociPro v3.0

**ERP SaaS mobile-first para minimarkets en Latinoamérica**

> Sistema de gestión completo para el comercio de barrio: ventas, inventario, fiados, contactos, caja chica, notificaciones inteligentes y más — todo en una sola app.

![NegociPro](https://img.shields.io/badge/NegociPro-v3.0-F0B429?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?style=for-the-badge)

---

## ✨ Características

### 💼 Gestión del Negocio
- **📦 Inventario Completo** — Stock en tiempo real, alertas críticas, SKU, categorías, precios, vencimientos. Subida de imágenes de facturas de proveedores con análisis por IA
- **💰 Punto de Venta (POS)** — Carrito interactivo, categorías dinámicas, límite de stock enforceado, 4 métodos de pago (Efectivo / Tarjeta / Transfer / Fiado)
- **💸 Libro de Fiados** — Registro de deudas, cobro de abonos, buscador, envío de boleta por email, historial completo
- **💸 Caja Chica** — Gastos diarios con ajuste +/-, tipos de gasto personalizables con emoji picker, presupuesto y barra de progreso
- **🔒 Cierre de Caja** — Conteo de billetes (todos los denominados CLP), cuadre automático, historial permanente

### 👥 Contactos y Clientes
- **CRUD completo** — Clientes, proveedores y empleados
- **Sistema de puntos** — 1 pto/producto, doble si compra supera $20.000. Niveles: Ocasional → Frecuente → VIP
- **Historial de actividad** — Cada compra queda registrada con fecha, monto y puntos ganados
- **Perfil detallado** — Email, teléfono, Telegram, notas internas, deuda, compras

### 📊 Dashboard en Tiempo Real
- Reloj en tiempo real con saludo dinámico
- KPIs: ventas del día, transacciones, stock crítico, total en calle
- Top productos del día calculados de ventas reales
- Últimas ventas con método de pago y cliente
- Botón **Nueva Venta** prominente

### 🔔 Notificaciones Inteligentes
- Orden inteligente: reales primero (más nuevas arriba), demo al final
- 1er tap → marca leída con ✅
- 2do tap → expande detalle completo (total, productos, fecha, hora, método, cliente fiado)
- Cubre todas las acciones: ventas, fiados, abonos, stock crítico, cierres, nuevos contactos

### ⚙️ Configuración
- **Datos del negocio** — Nombre, RUT, dirección, email, giro
- **Empleados y accesos** — CRUD, roles, PIN, permisos granulares
- **Telegram Bot** — Token + Chat ID, toggles de notificaciones por evento, prueba de conexión real
- **Exportar datos** — Excel (CSV), PDF imprimible, Backup JSON, WhatsApp, Gmail
- **Seguridad** — Cambio de PIN maestro, MFA toggle, bloqueo automático

### 📤 Exportación de Datos
- **Excel** — CSV con BOM, descarga directa, 3 secciones (inventario, ventas, fiados)
- **PDF** — Reporte HTML estilizado con KPIs, tablas y auto-print
- **Backup** — JSON completo con todos los datos (inventario, ventas, fiados, contactos)
- **WhatsApp** — Resumen del día pre-redactado listo para enviar
- **Gmail** — Abre Gmail con asunto y cuerpo completo pre-llenado

---

## 🛠️ Stack Tecnológico

```
React 19          — UI y estado (useState, useMemo, useEffect)
Next.js 15        — Framework, routing, build
Framer Motion 11  — Animaciones y transiciones
Anthropic Claude  — IA para análisis de imágenes de proveedores
Estilos inline    — Sistema neumórfico dark/light custom
```

> **Sin backend por ahora** — Toda la data es estado local (React). Preparado para conectar Supabase en el futuro.

---

## 🎨 Sistema de Diseño

- **Estilo:** Neumorfismo dark/light
- **Color accent:** Amber `#F0B429` (personalizable, 8 colores preset)
- **Fuentes:** Bricolage Grotesque · DM Sans · JetBrains Mono
- **Contenedor:** Mobile-first 480px (optimizado para teléfono)
- **Modo oscuro/claro:** Toggle con persistencia

---

## 📂 Estructura del Proyecto

```
negociopro/
├── src/
│   ├── app/
│   │   ├── layout.jsx          # Layout raíz
│   │   ├── page.jsx            # Página principal
│   │   └── globals.css         # Estilos globales
│   └── components/
│       └── AppMockup.jsx       # App completa (~7.800 líneas)
├── public/
├── package.json
├── next.config.js
├── vercel.json                 # Deploy Vercel con 1 clic
├── jsconfig.json               # Alias @/* configurado
├── .gitignore
├── .env.example                # Variables de entorno necesarias
└── README.md
```

---

## 🚀 Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/yonadafo19-bot/negociopro.git
cd negociopro

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local y agrega tu API key de Anthropic

# 4. Correr en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🌐 Deploy en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yonadafo19-bot/negociopro)

1. Clic en el botón de arriba
2. Conecta tu cuenta de GitHub
3. Agrega la variable: `NEXT_PUBLIC_ANTHROPIC_API_KEY`
4. Deploy automático ✅

---

## 🗺️ Roadmap

- [ ] Backend con Supabase (PostgreSQL + Auth + RLS)
- [ ] Modo offline con Service Workers + IndexedDB
- [ ] Catálogos virtuales con URL compartible
- [ ] Reportes avanzados con Recharts
- [ ] App nativa con React Native / Expo
- [ ] Multi-sucursal
- [ ] Integración con SII (Chile) para boletas electrónicas

---

## 📄 Licencia

Proyecto privado — © 2026 NegociPro. Todos los derechos reservados.
