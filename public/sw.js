const SW_VERSION = '2.2.0'
const CACHE_NAME = `negociopro-v${SW_VERSION}`
const RUNTIME_CACHE = `negociopro-runtime-v${SW_VERSION}`

// Archivos estáticos a precachear
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
]

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache')
      // Agregar URLs una por una para no fallar si alguna no existe
      return Promise.allSettled(
        urlsToCache.map(url =>
          cache.add(url).catch(err => {
            console.warn('Failed to cache:', url, err)
          })
        )
      )
    })
  )
  self.skipWaiting()
})

// Activate event - clean old caches AND clear entire storage
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Borrar TODOS los caches para forzar actualización
          console.log('Deleting cache:', cacheName)
          return caches.delete(cacheName)
        })
      )
    }).then(() => {
      // También borrar caches individuales por seguridad
      return caches.delete(CACHE_NAME)
    }).then(() => {
      // Borrar runtime cache también
      return caches.delete(RUNTIME_CACHE)
    })
  )
  self.clients.claim()
})

// Fetch event - Network first, fallback to cache, then offline page
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorar requests a Supabase (siempre red)
  if (url.hostname.includes('supabase.co')) {
    // No modificar requests de Supabase de ninguna manera
    event.respondWith(
      fetch(request).catch(error => {
        console.error('Supabase fetch error:', error)
        throw error
      })
    )
    return
  }

  // Ignorar requests de extensiones del navegador
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
    event.respondWith(fetch(request))
    return
  }

  // Estrategia: Network First para HTML, Cache First para assets estáticos
  if (request.mode === 'navigate') {
    // Network First para navegación
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Solo cachear si la URL es HTTP/HTTPS
          if (request.url.startsWith('http')) {
            const clone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) =>
              cache.put(request, clone).catch(() => {})
            )
          }
          return response
        })
        .catch(() => {
          // Fallback a cache
          return caches.match(request).then((cached) => {
            return cached || new Response('Offline', { status: 503 })
          })
        })
    )
  } else {
    // Cache First para assets estáticos (JS, CSS, imágenes)
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Actualizar en background (solo para requests HTTP/HTTPS)
          if (request.url.startsWith('http')) {
            fetch(request).then((response) => {
              if (response && response.status === 200) {
                const clone = response.clone()
                caches.open(RUNTIME_CACHE).then((cache) =>
                  cache.put(request, clone).catch(() => {})
                )
              }
            }).catch(() => {})
          }
          return cached
        }

        return fetch(request)
          .then((response) => {
            // Solo cachear responses exitosas de HTTP/HTTPS
            if (!response || response.status !== 200 || !request.url.startsWith('http')) {
              return response
            }

            const clone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) =>
              cache.put(request, clone).catch(() => {})
            )
            return response
          })
          .catch(() => {
            // Si es una imagen, retornar un placeholder
            if (request.destination === 'image') {
              return new Response('Placeholder', { status: 404 })
            }
          })
      })
    )
  }
})

// Background sync for queued requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-queue') {
    event.waitUntil(syncQueue())
  }
})

async function syncQueue() {
  try {
    // Get all queued items from IndexedDB
    const queue = await getQueueFromDB()

    // Process each item
    for (const item of queue) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body,
        })

        if (response.ok) {
          // Remove from queue on success
          await removeFromQueue(item.id)
        }
      } catch (error) {
        console.error('Failed to sync item:', item.id, error)
      }
    }
  } catch (error) {
    console.error('Sync failed:', error)
  }
}

function getQueueFromDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SyncQueueDB', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['queue'], 'readonly')
      const store = transaction.objectStore('queue')
      const getAllRequest = store.getAll()

      getAllRequest.onerror = () => reject(getAllRequest.error)
      getAllRequest.onsuccess = () => resolve(getAllRequest.result)
    }
  })
}

function removeFromQueue(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SyncQueueDB', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['queue'], 'readwrite')
      const store = transaction.objectStore('queue')
      const deleteRequest = store.delete(id)

      deleteRequest.onerror = () => reject(deleteRequest.error)
      deleteRequest.onsuccess = () => resolve()
    }
  })
}
