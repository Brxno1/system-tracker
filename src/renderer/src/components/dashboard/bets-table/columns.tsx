import { ColumnDef } from '@tanstack/react-table'
import type { SureBet } from '@/types'
import { cn, formatCurrency } from '@/lib/utils'

export const columns: ColumnDef<SureBet>[] = [
 {
  accessorKey: 'createdAt',
  header: 'Data',
  cell: ({ row }) => {
   const date = new Date(row.getValue('createdAt'))
   return (
    <span className="text-sm text-muted-foreground tabular-nums">
     {date.toLocaleDateString('pt-BR')}, {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
    </span>
   )
  }
 },
 {
  id: 'houseA',
  header: 'Casa A',
  cell: ({ row }) => {
   const bet = row.original
   return (
    <span
     className={cn(
      'font-medium tabular-nums',
      bet.status === 'OPEN' && 'text-muted-foreground',
      bet.status === 'WON' && bet.winner === 'A' && 'text-emerald-500',
      bet.status === 'WON' && bet.winner === 'B' && 'text-rose-500'
     )}
    >
     {bet.houseA.name.toUpperCase()} @ {bet.houseA.odds.toFixed(2)} - {formatCurrency(bet.houseA.stake)}
    </span>
   )
  }
 },
 {
  id: 'houseB',
  header: 'Casa B',
  cell: ({ row }) => {
   const bet = row.original
   return (
    <span
     className={cn(
      'font-medium tabular-nums',
      bet.status === 'OPEN' && 'text-muted-foreground',
      bet.status === 'WON' && bet.winner === 'B' && 'text-emerald-500',
      bet.status === 'WON' && bet.winner === 'A' && 'text-rose-500'
     )}
    >
     {bet.houseB.name.toUpperCase()} @ {bet.houseB.odds.toFixed(2)} - {formatCurrency(bet.houseB.stake)}
    </span>
   )
  }
 },
 {
  id: 'roi',
  header: 'ROI',
  cell: ({ row }) => {
   const bet = row.original
   const roi = (bet.projectedProfit / bet.totalInvestment) * 100
   return (
    <span className="text-muted-foreground tabular-nums">
     {roi.toFixed(2)}%
    </span>
   )
  }
 },
 {
  id: 'profit',
  header: 'Lucro',
  cell: ({ row }) => {
   const bet = row.original
   const profit = bet.status === 'WON' ? bet.realizedProfit ?? 0 : bet.projectedProfit
   return (
    <span className="text-emerald-500 font-medium tabular-nums">
     {formatCurrency(profit)}
    </span>
   )
  }
 }
]
