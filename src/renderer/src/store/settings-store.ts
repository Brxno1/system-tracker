import { create } from 'zustand'

interface SettingsState {
  geminiApiKey: string | null
  isInitialized: boolean
}

interface SettingsActions {
  init: () => Promise<void>
  setGeminiApiKey: (key: string) => Promise<void>
  clearGeminiApiKey: () => Promise<void>
}

type SettingsStore = SettingsState & SettingsActions

interface PersistedSettings {
  geminiApiKey?: string
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  geminiApiKey: null,
  isInitialized: false,

  init: async () => {
    if (get().isInitialized) return

    const settings = (await window.api.store.get('settings')) as PersistedSettings | undefined
    set({
      geminiApiKey: settings?.geminiApiKey ?? null,
      isInitialized: true
    })
  },

  setGeminiApiKey: async (key) => {
    set({ geminiApiKey: key })

    const currentSettings = (await window.api.store.get('settings')) as PersistedSettings
    await window.api.store.set('settings', {
      ...currentSettings,
      geminiApiKey: key
    })
  },

  clearGeminiApiKey: async () => {
    set({ geminiApiKey: null })

    const currentSettings = (await window.api.store.get('settings')) as PersistedSettings
    await window.api.store.set('settings', {
      ...currentSettings,
      geminiApiKey: undefined
    })
  }
}))
