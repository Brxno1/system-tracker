import { z } from 'zod'

// Schema for parsing a single Sure Bet screenshot
export const ParsedBetSchema = z.object({
  event: z.string().describe('The name of the sporting event (e.g., "Flamengo vs Palmeiras")'),
  houseA: z.object({
    name: z.string().describe('Name of the first bookmaker'),
    odds: z.number().describe('Odds value for the first outcome'),
    stake: z.number().describe('Calculated stake amount for the first outcome')
  }),
  houseB: z.object({
    name: z.string().describe('Name of the second bookmaker'),
    odds: z.number().describe('Odds value for the second outcome'),
    stake: z.number().describe('Calculated stake amount for the second outcome')
  }),
  profit: z.number().describe('Projected profit amount'),
  roi: z.number().describe('Return on Investment percentage (e.g., 1.5 for 1.5%)')
})

// Schema for parsing a list of House Balances from a screenshot
export const ParsedBankrollSchema = z.object({
  houses: z.array(
    z.object({
      name: z.string().describe('Name of the bookmaker'),
      balance: z.number().describe('Current balance amount found in the image')
    })
  ).describe('List of bookmakers and their balances found in the screenshot')
})

export type ParsedBet = z.infer<typeof ParsedBetSchema>
export type ParsedBankroll = z.infer<typeof ParsedBankrollSchema>
