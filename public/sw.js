const CACHE_NAME = 'negociopro-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  // Agregar más assets según sea necesario
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

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }

      // Clone the request
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      }).catch((error) => {
        console.log('Fetch failed:', error)
        // You could return a custom offline page here
        return caches.match('/offline.html')
      })
    })
  )
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
