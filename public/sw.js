const CACHE_NAME = 'negociopro-v2'
const RUNTIME_CACHE = 'negociopro-runtime-v2'

// Archivos estáticos a precachear
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
]

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache')
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
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
    event.respondWith(fetch(request))
    return
  }

  // Estrategia: Network First para HTML, Cache First para assets estáticos
  if (request.mode === 'navigate') {
    // Network First para navegación
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache la respuesta exitosa
          const clone = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() => {
          // Fallback a cache
          return caches.match(request).then((cached) => {
            return cached || caches.match('/offline.html')
          })
        })
    )
  } else {
    // Cache First para assets estáticos (JS, CSS, imágenes)
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Actualizar en background
          fetch(request).then((response) => {
            const clone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone))
          })
          return cached
        }

        return fetch(request)
          .then((response) => {
            // Cache respuestas exitosas
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            const clone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone))
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
