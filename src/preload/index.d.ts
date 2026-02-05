import { ElectronAPI } from '@electron-toolkit/preload'

interface StoreAPI {
  get: (key: string) => Promise<unknown>
  set: (key: string, value: unknown) => Promise<boolean>
  delete: (key: string) => Promise<boolean>
  getAll: () => Promise<Record<string, unknown>>
  clear: () => Promise<boolean>
}

interface API {
  store: StoreAPI
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
