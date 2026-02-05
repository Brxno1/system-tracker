export interface SureBet {
  id: string
  createdAt: string // ISO Date string
  event: string
  houseA: {
    name: string
    odds: number
    stake: number
  }
  houseB: {
    name: string
    odds: number
    stake: number
  }
  totalInvestment: number
  projectedProfit: number
  roi: number
  status: 'OPEN' | 'WON'
  winner?: 'A' | 'B'
  realizedProfit?: number
}

export interface HouseBalance {
  name: string
  balance: number
  updatedAt: string // ISO Date string
}

export type BetStatus = SureBet['status']
