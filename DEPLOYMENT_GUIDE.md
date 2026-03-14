# Guía de Despliegue - NegociPro

## 📋 Índice

1. [Prerrequisitos](#prerrequisitos)
2. [Configuración de Supabase](#configuración-de-supabase)
3. [Despliegue en Vercel](#despliegue-en-vercel)
4. [Configuración de Dominio Personalizado](#configuración-de-dominio-personalizado)
5. [Verificación del Despliegue](#verificación-del-despliegue)
6. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
7. [Solución de Problemas](#solución-de-problemas)

## 🚀 Prerrequisitos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta en [Supabase](https://supabase.com)
- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Git instalado localmente
- ✅ Node.js 18+ instalado
- ✅ npm o yarn instalado

## 🔧 Configuración de Supabase

### 1. Crear Proyecto

1. Ve a [Supabase](https://supabase.com) e inicia sesión
2. Haz clic en "New Project"
3. Configura tu proyecto:
   - **Nombre**: `negociopro-production` (o el que prefieras)
   - **Database Password**: Genera una contraseña segura y guárdala
   - **Region**: Selecciona la región más cercana a tus usuarios
   - **Pricing Plan**: Empieza con Free Tier

4. Haz clic en "Create new project" y espera a que se cree (puede tomar 2-3 minutos)

### 2. Obtener Credenciales

1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia los siguientes valores:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 3. Ejecutar Migraciones

1. Ve a **SQL Editor** en el panel lateral
2. Copia y pega el contenido de `supabase/migrations/001_initial_schema.sql`
3. Haz clic en "Run" para ejecutar el schema
4. Repite con `002_rls_policies.sql` para las políticas de seguridad

### 4. Configurar Storage (Opcional)

Para permitir subida de imágenes:

1. Ve a **Storage** → **New bucket**
2. Nombre: `products`
3. Make public: ✅
4. Haz clic en "Create bucket"

5. Configura políticas CORS:
   ```sql
   -- Habilitar acceso público
   insert into storage.buckets (id, name, public)
   values ('products', 'products', true);

   -- Política de lectura pública
   create policy "Public Access"
   on storage.objects for select
   using ( bucket_id = 'products' );
   ```

## 🌐 Despliegue en Vercel

### Método 1: Desde GitHub (Recomendado)

#### 1. Preparar Repositorio

```bash
# Inicializar git si no lo has hecho
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit: NegociPro"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/negociopro.git
git branch -M main
git push -u origin main
```

#### 2. Desplegar en Vercel

1. Ve a [Vercel](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa tu repositorio de GitHub
4. Configura el proyecto:

   **Framework Preset**: `Vite`

   **Root Directory**: `./`

   **Environment Variables**:
   ```
   VITE_SUPABASE_URL = https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

5. Haz clic en **"Deploy"**
6. Espera a que termine el despliegue (2-3 minutos)
7. ¡Listo! Tendrás una URL como `https://negocipro.vercel.app`

### Método 2: Desde CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel

# Seguir las instrucciones:
# - Link to existing project? N
# - Project name: negociopro
# - Directory: ./
# - Settings? Link to existing project: N
# - VITE_SUPABASE_URL: (pegar URL)
# - VITE_SUPABASE_ANON_KEY: (pegar key)
```

## 🌍 Configuración de Dominio Personalizado

### 1. Comprar Dominio

Compra un dominio en:
- [Namecheap](https://www.namecheap.com)
- [GoDaddy](https://www.godaddy.com)
- [Google Domains](https://domains.google)

### 2. Configurar en Vercel

1. Ve a tu proyecto en Vercel
2. Navega a **Settings** → **Domains**
3. Haz clic en **"Add"** y ingresa tu dominio (ej: `negocipro.com`)
4. Elige agregar tanto `negocipro.com` como `www.negocipro.com`

### 3. Configurar DNS

Vercel te dará registros DNS para agregar:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Agrega estos registros en tu registrador de dominios.

### 4. Esperar Propagación

La propagación DNS puede tomar 24-48 horas, pero usualmente es mucho más rápido.

## ✅ Verificación del Despliegue

### Checklist

- [ ] La aplicación carga sin errores
- [ ] El registro de usuarios funciona
- [ ] El inicio de sesión funciona
- [ ] Se pueden crear productos
- [ ] Se pueden registrar ventas
- [ ] Los gráficos se muestran correctamente
- [ ] El modo offline funciona
- [ ] Los catálogos se comparten correctamente
- [ ] Las notificaciones de sincronización aparecen
- [ ] La aplicación es responsive en móvil

### Testing Manual

1. **Prueba de Auth**:
   - Regístrate como nuevo usuario
   - Cierra sesión y vuelve a iniciar
   - Intenta recuperar contraseña

2. **Prueba de CRUD**:
   - Crea un producto
   - Edítalo
   - Elimínalo

3. **Prueba de Ventas**:
   - Registra una venta completa
   - Verifica que el stock se actualizó
   - Revisa el dashboard

4. **Prueba Offline**:
   - Abre DevTools → Network → Offline
   - Intenta crear un producto
   - Vuelve a Online
   - Verifica que se sincronizó

5. **Prueba Móvil**:
   - Abre la app en tu celular
   - Verifica que el layout funcione
   - Prueba el menú hamburguesa
   - Prueba el modo oscuro

## 📊 Monitoreo y Mantenimiento

### Vercel Analytics

Vercel incluye analytics automáticos:

1. Ve a **Analytics** en tu proyecto
2. Configura **Web Vitals** para monitorear rendimiento
3. Revisa métricas: FCP, LCP, CLS

### Supabase Logs

Monitorea tu backend:

1. Ve a **Logs** en Supabase
2. Filtra por errores
3. Configura alertas para errores críticos

### Google Analytics (Opcional)

1. Crea una propiedad en [GA4](https://analytics.google.com)
2. Agrega el ID en `.env`:
   ```
   VITE_GA_ID=G-XXXXXXXXXX
   ```
3. Agrega en `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### Actualizaciones

Para actualizar la aplicación:

```bash
# Hacer cambios
git add .
git commit -m "feat: nueva funcionalidad"
git push

# Vercel desplegará automáticamente
```

## 🐛 Solución de Problemas

### Error: "Service Worker registration failed"

**Causa**: HTTPS es requerido para Service Workers

**Solución**:
- Vercel incluye HTTPS automáticamente
- En local, usa `localhost` (tiene HTTPS implícito)

### Error: "Connection to Supabase failed"

**Causa**: Credenciales incorrectas o proyecto pausado

**Solución**:
1. Verifica las variables de entorno en Vercel
2. Verifica que tu proyecto de Supabase no esté pausado
3. Revisa las API keys en Settings → API

### Error: "Build failed"

**Causa**: Dependencias faltantes o error en código

**Solución**:
```bash
# Prueba construir localmente
npm run build

# Si falla, revisa los errores y corrige
npm run lint
```

### Las imágenes no cargan

**Causa**: Bucket de storage no configurado

**Solución**:
1. Configura el bucket de storage en Supabase
2. Verifica las políticas CORS
3. Usa URLs externas mientras tanto

### El modo offline no funciona

**Causa**: Service Worker no registrado correctamente

**Solución**:
1. Limpia el cache del navegador
2. Desregistra Service Workers:
   ```javascript
   navigator.serviceWorker.getRegistrations().then(registrations => {
     registrations.forEach(registration => registration.unregister())
   })
   ```
3. Recarga la página

### Error: "Row Level Security policy violation"

**Causa**: Políticas RLS no aplicadas

**Solución**:
1. Ejecuta `002_rls_policies.sql`
2. Verifica que las políticas estén activas
3. Revisa Authentication → Policies

## 📚 Recursos Útiles

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs en Vercel y Supabase
2. Consulta la documentación oficial
3. Busca issues similares en GitHub
4. Contacta al soporte de Vercel o Supabase

## 🎉 ¡Felicidades!

Tu aplicación NegociPro está ahora en producción. Los usuarios pueden empezar a gestionar sus negocios desde cualquier lugar, incluso sin conexión a internet.

**Próximos pasos**:
- Configurar Analytics
- Añadir más tests
- Implementar sistema de pagos
- Añadir más features

---

**Última actualización**: Marzo 2025
**Versión**: 1.0.0
