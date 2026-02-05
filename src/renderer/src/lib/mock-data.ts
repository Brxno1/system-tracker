import type { SureBet } from '@/types'

/**
 * Mock data for development and testing.
 * Will be removed once AI parsing is implemented.
 */
export const mockBets: SureBet[] = [
  {
    id: '1',
    createdAt: '2025-02-05T10:30:00Z',
    event: 'Flamengo vs Palmeiras',
    houseA: { name: 'Bet365', odds: 2.10, stake: 500 },
    houseB: { name: 'Betano', odds: 1.95, stake: 538.46 },
    totalInvestment: 1038.46,
    projectedProfit: 11.54,
    roi: 1.11,
    status: 'OPEN'
  },
  {
    id: '2',
    createdAt: '2025-02-04T15:45:00Z',
    event: 'Lakers vs Celtics',
    houseA: { name: 'Superbet', odds: 1.85, stake: 400 },
    houseB: { name: 'KTO', odds: 2.05, stake: 360.98 },
    totalInvestment: 760.98,
    projectedProfit: 9.02,
    roi: 1.19,
    status: 'WON',
    winner: 'A',
    realizedProfit: 340
  },
  {
    id: '3',
    createdAt: '2025-02-04T09:15:00Z',
    event: 'Real Madrid vs Barcelona',
    houseA: { name: 'Betano', odds: 2.25, stake: 300 },
    houseB: { name: 'Bet365', odds: 1.70, stake: 397.06 },
    totalInvestment: 697.06,
    projectedProfit: 12.94,
    roi: 1.86,
    status: 'WON',
    winner: 'B',
    realizedProfit: 275
  },
  {
    id: '4',
    createdAt: '2025-02-03T20:00:00Z',
    event: 'Man City vs Arsenal',
    houseA: { name: 'KTO', odds: 1.90, stake: 600 },
    houseB: { name: 'Superbet', odds: 2.00, stake: 570 },
    totalInvestment: 1170,
    projectedProfit: 10,
    roi: 0.85,
    status: 'OPEN'
  }
]
