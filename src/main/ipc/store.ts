import { ipcMain } from 'electron'

// Type-safe store schema
interface StoreSchema {
  bets: unknown[]
  houses: unknown[]
  settings: {
    geminiApiKey?: string
  }
}

// Store instance (initialized lazily)
let store: Awaited<ReturnType<typeof createStore>> | null = null

async function createStore() {
  const Store = (await import('electron-store')).default
  return new Store<StoreSchema>({
    name: 'sures-data',
    defaults: {
      bets: [],
      houses: [],
      settings: {}
    }
  })
}

async function getStore() {
  if (!store) {
    store = await createStore()
  }
  return store
}

/**
 * Register all IPC handlers for electron-store operations.
 * Call this once in main/index.ts before creating the window.
 */
export function registerStoreHandlers(): void {
  // Generic get
  ipcMain.handle('store:get', async (_event, key: keyof StoreSchema) => {
    const s = await getStore()
    return s.get(key)
  })

  // Generic set
  ipcMain.handle('store:set', async (_event, key: keyof StoreSchema, value: StoreSchema[typeof key]) => {
    const s = await getStore()
    s.set(key, value)
    return true
  })

  // Delete a key
  ipcMain.handle('store:delete', async (_event, key: keyof StoreSchema) => {
    const s = await getStore()
    s.delete(key)
    return true
  })

  // Get entire store (for debugging/init)
  ipcMain.handle('store:getAll', async () => {
    const s = await getStore()
    return s.store
  })

  // Clear all data
  ipcMain.handle('store:clear', async () => {
    const s = await getStore()
    s.clear()
    return true
  })
}
