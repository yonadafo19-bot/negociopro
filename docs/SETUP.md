# 🚀 Guía de Configuración - NegociPro

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta en [Supabase](https://supabase.com)
- Editor de código (VS Code recomendado)

## 🗄️ Configuración de Supabase

### 1. Crear Proyecto

1. Ve a [supabase.com](https://supabase.com)
2. Click en "New Project"
3. Completa los datos:
   - **Nombre**: negociopro
   - **Database Password**: (guarda esta contraseña)
   - **Region**: Más cercana a tu ubicación
4. Espera a que el proyecto se cree (~2 minutos)

### 2. Ejecutar Migraciones

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Click en **New Query**
3. Copia y pega el contenido de `001_initial_schema.sql`
4. Click en **Run** ▶️
5. Repite para `002_rls_policies.sql`
6. (Opcional) Repite para `003_seed_data.sql` si quieres datos de prueba

### 3. Obtener Credenciales

1. En el dashboard, ve a **Settings** → **API**
2. Copia los siguientes valores:
   ```
   Project URL: https://xxxxx.supabase.co
   anon/public key: eyJhbGc...
   ```

## 💻 Configuración Local

### 1. Instalar Dependencias

```bash
cd negociopro
npm install
```

### 2. Configurar Variables de Entorno

Crea el archivo `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## ✅ Verificar Instalación

### 1. Registro de Usuario

1. Ve a http://localhost:3000/register
2. Completa el formulario:
   - **Nombre**: Tu nombre
   - **Negocio**: Nombre de tu negocio
   - **Email**: tu@email.com
   - **Contraseña**: (mínimo 6 caracteres)
3. Click en "Crear Cuenta"

### 2. Verificar en Supabase

1. En Supabase, ve a **Authentication** → **Users**
2. Deberías ver tu nuevo usuario
3. Ve a **Table Editor** → **profiles**
4. Deberías ver tu perfil creado automáticamente

### 3. Probar Dashboard

1. Deberías estar redirigido al Dashboard
2. Verás las estadísticas en 0 (todavía no hay datos)

## 🎨 Personalización

### Cambiar Colores

Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Tu color primario
      }
    }
  }
}
```

### Cambiar Logo

Reemplaza `public/favicon.svg` con tu logo.

## 🚨 Solución de Problemas

### Error: "Supabase credentials not found"

**Solución**: Verifica que `.env` existe y tiene las credenciales correctas.

### Error: "Loading infinito"

**Solución**: Verifica la consola del navegador. Probablemente es un error en AuthContext.

### Error: "RLS policy violated"

**Solución**: Ejecuta las migraciones RLS nuevamente en Supabase SQL Editor.

### Puerto 3000 ocupado

**Solución**: Cambia el puerto en `vite.config.js`:

```javascript
server: {
  port: 3001, // Cambia a otro puerto
}
```

## 📚 Próximos Pasos

1. ✅ Configuración completa
2. ➡️ Agrega productos al inventario
3. ➡️ Registra tu primera venta
4. ➡️ Explora los reportes

## 🆘 Ayuda

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de React](https://react.dev)
- [Documentación de Vite](https://vitejs.dev)
