import type { SureBet } from '@/types'

export const mockBets: SureBet[] = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1).toString(),
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  event: `Event ${i + 1}`,
  houseA: { name: 'House A', odds: 1.5 + Math.random(), stake: 100 + i * 10 },
  houseB: { name: 'House B', odds: 1.5 + Math.random(), stake: 100 + i * 10 },
  totalInvestment: 200 + i * 20,
  projectedProfit: 10 + Math.random() * 50,
  roi: 1 + Math.random() * 5,
  status: Math.random() > 0.5 ? 'OPEN' : 'WON',
  winner: Math.random() > 0.5 ? 'A' : 'B',
  realizedProfit: Math.random() > 0.5 ? 50 : undefined
}))
