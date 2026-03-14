# Sistema Offline y Sincronización - NegociPro

## 📱 Descripción General

NegociPro cuenta con un sistema completo de funcionamiento offline que permite a los usuarios continuar trabajando sin conexión a internet. Todos los cambios se guardan localmente y se sincronizan automáticamente cuando se recupera la conexión.

## 🔄 Funcionamiento

### 1. Service Worker

El service worker (`public/sw.js`) se encarga de:
- Cachear los assets estáticos de la aplicación
- Interceptando las peticiones de red
- Sirviendo contenido desde el caché cuando no hay conexión
- Sincronizando en segundo plano cuando se restablece la conexión

### 2. Cola de Sincronización

La cola de sincronización (`src/services/syncQueue.js`) utiliza IndexedDB para:
- Guardar operaciones pendientes (creaciones, actualizaciones, eliminaciones)
- Mantener el orden de las operaciones
- Permitir consulta de estadísticas
- Soportar diferentes tipos de recursos (productos, ventas, contactos, catálogos)

### 3. Contexto de Conexión

El `ConnectionContext` monitorea:
- Estado de conexión online/offline
- Número de cambios pendientes
- Estado de sincronización
- Hora de última sincronización exitosa

## 📦 Recursos Soportados

### Productos
- **Crear**: `queueCreateProduct(product)`
- **Actualizar**: `queueUpdateProduct(productId, updates)`
- **Eliminar**: `queueDeleteProduct(productId)`

### Transacciones (Ventas/Gastos)
- **Crear**: `queueTransaction(transaction, items)`

### Contactos
- **Crear**: `queueCreateContact(contact)`
- **Actualizar**: `queueUpdateContact(contactId, updates)`

### Catálogos
- **Crear**: `queueCreateCatalog(catalog, productIds)`

## 🎯 Componentes

### ConnectionStatus

Componente flotante que muestra:
- Estado de conexión (conectado/desconectado)
- Número de cambios pendientes
- Botón de sincronización manual
- Mensajes de error si los hay

```jsx
import ConnectionStatus from './components/connection/ConnectionStatus'

// En App.jsx
<ConnectionStatus />
```

### Hooks Personalizados

```jsx
// Crear producto offline
const createProduct = useOfflineCreateProduct()
await createProduct(productData)

// Crear venta offline
const createTransaction = useOfflineCreateTransaction()
await createTransaction(transactionData, items)

// Obtener estadísticas de sincronización
const { isOnline, pendingSync, canSync } = useSyncStats()
```

## 🔧 Configuración

### Registro del Service Worker

El service worker se registra automáticamente en `App.jsx`:

```jsx
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration)
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error)
      })
  }
}, [])
```

### Provider de Conexión

Envolver la aplicación con los providers necesarios:

```jsx
<BrowserRouter>
  <ThemeProvider>
    <AuthProvider>
      <ConnectionProvider>
        <AppRoutes />
        <ConnectionStatus />
      </ConnectionProvider>
    </AuthProvider>
  </ThemeProvider>
</BrowserRouter>
```

## 📊 PWA Features

### Manifest

El archivo `public/manifest.json` configura:
- Nombre de la aplicación
- Iconos de diferentes tamaños
- Colores de tema
- Modo de visualización (standalone)
- Shortcuts para acciones rápidas

### Metadatos PWA

Incluidos en `index.html`:
- Apple mobile web app capable
- Theme color
- Iconos Apple touch
- Open Graph y Twitter Cards

## 🧪 Testing Offline

### Chrome DevTools

1. Abrir DevTools (F12)
2. Ir a la pestaña "Network"
3. Seleccionar "Offline" en el throttling dropdown
4. Recargar la página

### Comandos Útiles

```javascript
// Simular offline
window.dispatchEvent(new Event('offline'))

// Simular online
window.dispatchEvent(new Event('online'))

// Ver estado
navigator.onLine // true/false

// Ver Service Worker
navigator.serviceWorker.getRegistrations()

// Limpiar todos los caches
caches.keys().then(names => names.forEach(name => caches.delete(name)))
```

## 🔍 Monitoreo

### Página de Sincronización

Accesible en `/sync`, muestra:
- Estado de conexión actual
- Cambios pendientes de sincronización
- Última sincronización exitosa
- Registro de actividad
- Botones de sincronización manual

### Logs

Cada sincronización genera logs con timestamp:
- `✅ Sincronización completada`
- `❌ Error: [mensaje]`
- `🔄 Iniciando sincronización...`

## ⚠️ Consideraciones

### Conflictos

El sistema actual maneja conflictos con la estrategia "last write wins". En producción, deberías considerar:
- Validación de conflictos
- Resolución manual de conflictos
- Versionado de registros

### Capacidad

IndexedDB tiene límites de almacenamiento:
- Mínimo recomendado: 50MB
- Máximo típico: 50% del espacio disponible en disco
- Monitorear uso con `navigator.storage.estimate()`

### Seguridad

- Los datos en IndexedDB no están encriptados
- Considerar encriptación sensible
- Limpiar cola al cerrar sesión

## 🚀 Optimizaciones Futuras

1. **Compresión de datos**: Reducir tamaño de payloads
2. **Deduplicación**: Evitar operaciones duplicadas
3. **Batch sync**: Agrupar múltiples operaciones
4. **Delta sync**: Solo sincronizar cambios
5. **Conflict resolution**: Sistema robusto de resolución

## 📚 Referencias

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Background Sync](https://developer.mozilla.org/en-US/docs/Web/API/Background_Sync_API)
- [PWA Best Practices](https://web.dev/pwa/)

## 🐛 Troubleshooting

### Service Worker no se registra

Verificar que la app se sirve sobre HTTPS o localhost:
```javascript
if (location.protocol === 'https:' || location.hostname === 'localhost') {
  // Registrar SW
}
```

### IndexedDB bloques en modo privado

Algunos navegadores bloquean IndexedDB en modo privado. Manejar con:
```javascript
try {
  await syncQueue.init()
} catch (error) {
  console.warn('IndexedDB not available:', error)
}
```

### Sincronización no se ejecuta

Verificar que Background Sync API esté disponible:
```javascript
if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
  // Usar background sync
}
```

## 📞 Soporte

Para problemas o sugerencias sobre el sistema offline, contacta al equipo de desarrollo de NegociPro.
