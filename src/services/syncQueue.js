// Sync Queue Service for offline functionality

class SyncQueue {
  constructor() {
    this.dbName = 'SyncQueueDB'
    this.dbVersion = 1
    this.storeName = 'queue'
    this.db = null
  }

  // Initialize IndexedDB
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = event => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('resourceType', 'resourceType', { unique: false })
        }
      }
    })
  }

  // Add item to queue
  async addItem(item) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.add({
        ...item,
        timestamp: Date.now(),
        synced: false,
      })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  // Get all items from queue
  async getAllItems() {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  // Get items by resource type
  async getItemsByType(resourceType) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('resourceType')
      const request = index.getAll(resourceType)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  // Remove item from queue
  async removeItem(id) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  // Clear all items
  async clear() {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  // Get queue stats
  async getStats() {
    const items = await this.getAllItems()
    const byType = items.reduce((acc, item) => {
      acc[item.resourceType] = (acc[item.resourceType] || 0) + 1
      return acc
    }, {})

    return {
      total: items.length,
      byType,
      oldest: items.length > 0 ? Math.min(...items.map(i => i.timestamp)) : null,
      newest: items.length > 0 ? Math.max(...items.map(i => i.timestamp)) : null,
    }
  }
}

// Export singleton instance
export const syncQueue = new SyncQueue()

// Helper functions for common operations
export const queueOperations = {
  // Queue a product creation
  queueCreateProduct: async product => {
    return syncQueue.addItem({
      resourceType: 'product',
      operation: 'create',
      data: product,
    })
  },

  // Queue a product update
  queueUpdateProduct: async (productId, updates) => {
    return syncQueue.addItem({
      resourceType: 'product',
      operation: 'update',
      resourceId: productId,
      data: updates,
    })
  },

  // Queue a product deletion
  queueDeleteProduct: async productId => {
    return syncQueue.addItem({
      resourceType: 'product',
      operation: 'delete',
      resourceId: productId,
    })
  },

  // Queue a transaction (sale/expense)
  queueTransaction: async (transaction, items) => {
    return syncQueue.addItem({
      resourceType: 'transaction',
      operation: 'create',
      data: { transaction, items },
    })
  },

  // Queue a contact creation
  queueCreateContact: async contact => {
    return syncQueue.addItem({
      resourceType: 'contact',
      operation: 'create',
      data: contact,
    })
  },

  // Queue a contact update
  queueUpdateContact: async (contactId, updates) => {
    return syncQueue.addItem({
      resourceType: 'contact',
      operation: 'update',
      resourceId: contactId,
      data: updates,
    })
  },

  // Queue a catalog creation
  queueCreateCatalog: async (catalog, productIds) => {
    return syncQueue.addItem({
      resourceType: 'catalog',
      operation: 'create',
      data: { catalog, productIds },
    })
  },
}
