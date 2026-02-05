import { create } from 'zustand'
import type { SureBet } from '@/types'

interface BetsState {
  bets: SureBet[]
  isLoading: boolean
  isInitialized: boolean
}

interface BetsActions {
  // Initialization
  init: () => Promise<void>

  // CRUD
  addBet: (bet: Omit<SureBet, 'id' | 'createdAt'>) => Promise<void>
  updateBet: (id: string, updates: Partial<SureBet>) => Promise<void>
  deleteBet: (id: string) => Promise<void>

  // Business logic
  markWinner: (id: string, winner: 'A' | 'B') => Promise<void>
}

type BetsStore = BetsState & BetsActions

export const useBetsStore = create<BetsStore>((set, get) => ({
  // State
  bets: [],
  isLoading: false,
  isInitialized: false,

  // Initialize from persisted storage
  init: async () => {
    if (get().isInitialized) return

    set({ isLoading: true })
    try {
      const bets = (await window.api.store.get('bets')) as SureBet[] | undefined
      set({ bets: bets ?? [], isInitialized: true })
    } finally {
      set({ isLoading: false })
    }
  },

  // Add a new bet
  addBet: async (betData) => {
    const newBet: SureBet = {
      ...betData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'OPEN'
    }

    const updatedBets = [...get().bets, newBet]
    set({ bets: updatedBets })
    await window.api.store.set('bets', updatedBets)
  },

  // Update an existing bet
  updateBet: async (id, updates) => {
    const updatedBets = get().bets.map((bet) =>
      bet.id === id ? { ...bet, ...updates } : bet
    )
    set({ bets: updatedBets })
    await window.api.store.set('bets', updatedBets)
  },

  // Delete a bet
  deleteBet: async (id) => {
    const updatedBets = get().bets.filter((bet) => bet.id !== id)
    set({ bets: updatedBets })
    await window.api.store.set('bets', updatedBets)
  },

  // Mark winner and calculate realized profit
  markWinner: async (id, winner) => {
    const bet = get().bets.find((b) => b.id === id)
    if (!bet) return

    // Calculate realized profit based on winner
    const winningHouse = winner === 'A' ? bet.houseA : bet.houseB
    const realizedProfit = winningHouse.stake * winningHouse.odds - bet.totalInvestment

    await get().updateBet(id, {
      status: 'WON',
      winner,
      realizedProfit
    })
  }
}))
