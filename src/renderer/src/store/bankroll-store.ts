import { create } from 'zustand'
import type { HouseBalance } from '@/types'

interface BankrollState {
  houses: HouseBalance[]
  isLoading: boolean
  isInitialized: boolean
}

interface BankrollActions {
  // Initialization
  init: () => Promise<void>

  // CRUD
  updateHouseBalance: (name: string, balance: number) => Promise<void>
  updateMultipleHouses: (updates: Array<{ name: string; balance: number }>) => Promise<void>
  deleteHouse: (name: string) => Promise<void>
}

type BankrollStore = BankrollState & BankrollActions

export const useBankrollStore = create<BankrollStore>((set, get) => ({
  // State
  houses: [],
  isLoading: false,
  isInitialized: false,

  // Initialize from persisted storage
  init: async () => {
    if (get().isInitialized) return

    set({ isLoading: true })
    try {
      const houses = (await window.api.store.get('houses')) as HouseBalance[] | undefined
      set({ houses: houses ?? [], isInitialized: true })
    } finally {
      set({ isLoading: false })
    }
  },

  // Update or create a house balance
  updateHouseBalance: async (name, balance) => {
    const now = new Date().toISOString()
    const houses = get().houses
    const existingIndex = houses.findIndex(
      (h) => h.name.toLowerCase() === name.toLowerCase()
    )

    let updatedHouses: HouseBalance[]
    if (existingIndex >= 0) {
      updatedHouses = houses.map((h, i) =>
        i === existingIndex ? { ...h, balance, updatedAt: now } : h
      )
    } else {
      updatedHouses = [...houses, { name, balance, updatedAt: now }]
    }

    set({ houses: updatedHouses })
    await window.api.store.set('houses', updatedHouses)
  },

  // Bulk update from AI parsing
  updateMultipleHouses: async (updates) => {
    const now = new Date().toISOString()
    const currentHouses = [...get().houses]

    for (const { name, balance } of updates) {
      const existingIndex = currentHouses.findIndex(
        (h) => h.name.toLowerCase() === name.toLowerCase()
      )

      if (existingIndex >= 0) {
        currentHouses[existingIndex] = { ...currentHouses[existingIndex], balance, updatedAt: now }
      } else {
        currentHouses.push({ name, balance, updatedAt: now })
      }
    }

    set({ houses: currentHouses })
    await window.api.store.set('houses', currentHouses)
  },

  // Delete a house
  deleteHouse: async (name) => {
    const updatedHouses = get().houses.filter(
      (h) => h.name.toLowerCase() !== name.toLowerCase()
    )
    set({ houses: updatedHouses })
    await window.api.store.set('houses', updatedHouses)
  }
}))

// Derived selectors
export const selectTotalBankroll = (state: BankrollStore) =>
  state.houses.reduce((sum, house) => sum + house.balance, 0)
