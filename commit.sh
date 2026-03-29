#!/bin/bash
# ────────────────────────────────────────────────────────────────
# NegociPro — Script de commit inicial
# Uso: bash commit.sh
# ────────────────────────────────────────────────────────────────

echo "⚡ NegociPro — Preparando commit..."

# Verificar que estamos en el repo correcto
if [ ! -f "package.json" ]; then
  echo "❌ Error: ejecuta este script desde la raíz del proyecto"
  exit 1
fi

# Configurar git si es necesario (primera vez)
if [ -z "$(git config user.email)" ]; then
  echo "📧 Configura tu email de GitHub:"
  read -r GIT_EMAIL
  git config user.email "$GIT_EMAIL"
fi

if [ -z "$(git config user.name)" ]; then
  echo "👤 Configura tu nombre:"
  read -r GIT_NAME
  git config user.name "$GIT_NAME"
fi

# Inicializar git si no existe
if [ ! -d ".git" ]; then
  echo "📁 Inicializando repositorio git..."
  git init
  git remote add origin https://github.com/yonadafo19-bot/negociopro.git
fi

# Agregar todos los archivos
echo "📦 Agregando archivos..."
git add .

# Mostrar qué se va a commitear
echo ""
echo "📋 Archivos a commitear:"
git status --short
echo ""

# Hacer el commit
git commit -m "feat: NegociPro v3.0 — ERP SaaS mobile-first para minimarkets LATAM

✨ Características implementadas:
- POS completo con carrito, stock enforceado, 4 métodos de pago
- Inventario con alertas, SKU, vencimientos, IA para imágenes de proveedores
- Libro de Fiados con cobro, abonos, email de boleta
- Sistema de puntos por compra (1 pto, x2 si supera \$20.000)
- Dashboard en tiempo real con reloj, KPIs y últimas ventas
- Notificaciones inteligentes con detalle expandible
- Caja Chica con tipos personalizables y ajuste +/-
- Cierre de Caja con historial permanente
- Contactos: clientes, proveedores, empleados con historial
- Configuración: empleados, Telegram Bot, exportar datos, seguridad
- Exportar Excel, PDF, Backup JSON, WhatsApp, Gmail

🛠️ Stack: Next.js 15 + React 19 + Framer Motion 11 + Claude AI
🎨 Diseño: Neumorfismo dark/light, amber accent, mobile-first 480px"

echo ""
echo "✅ Commit creado!"
echo ""
echo "🚀 Subiendo a GitHub..."
git push -u origin main

echo ""
echo "✅ ¡Listo! Código subido a:"
echo "   https://github.com/yonadafo19-bot/negociopro"
