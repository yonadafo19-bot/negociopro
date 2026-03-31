# Configuración de Google Analytics 4

## 📊 Pasos para configurar Analytics

### 1. Crear propiedad en Google Analytics

1. Ve a: https://analytics.google.com/
2. Clic en "Empezar a medir"
3. Selecciona "Cuenta de Google Analytics 4" (¡NO Universal Analytics!)
4. Cuenta:
   - **Nombre de la cuenta:** NegociPro
   - **Nombre de la propiedad:** NegociPro Web
   - **URL del sitio web:** https://negociopro.vercel.app (o tu dominio)
   - **Categoría del sector:** Tecnología → Software

### 2. Configurar flujo de datos

1. Selecciona "Plataforma web"
2. URL: https://negociopro.vercel.app
3. **Nombre del flujo de datos:** NegociPro Web

### 3. Obtener Measurement ID

Google te dará un ID como:
```
G-XXXXXXXXXX
```

### 4. Copiar el Measurement ID al proyecto

En tu archivo `.env`:
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 5. Verificar que funciona

1. Inicia tu app local: `npm run dev`
2. Ve a https://negocipro.vercel.app
3. Abre la consola del navegador (F12)
4. Deberías ver: `Service Worker registered: ...`
5. En Google Analytics → Realtime → Ver usuarios en tiempo real

## 🎯 Eventos que se trackean automáticamente:

- Page views (cambio de página)
- Navegación en la app
- Usuarios activos

## 📈 Métricas importantes:

- Sesiones
- Usuarios activos
- Páginas vistas
- Tiempo en la app
- Tasa de rebote
- Origen de tráfico

---

**¿Y LISTO!** 🎉

Ahora puedes ver cuánta gente visita tu proyecto y qué hacen.
