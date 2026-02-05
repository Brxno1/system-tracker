import { ColumnDef } from '@tanstack/react-table'
import type { SureBet } from '@/types'

export const columns: ColumnDef<SureBet>[] = [
 {
  accessorKey: 'createdAt',
  header: 'Data',
  cell: ({ row }) => {
   const date = new Date(row.getValue('createdAt'))
   return (
    <span className="text-sm text-muted-foreground">
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
   const color = bet.status === 'OPEN'
    ? 'text-muted-foreground'
    : bet.winner === 'A' ? 'text-emerald-500' : 'text-rose-500'
   return (
    <span className={color}>
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
   const color = bet.status === 'OPEN'
    ? 'text-muted-foreground'
    : bet.winner === 'B' ? 'text-emerald-500' : 'text-rose-500'
   return (
    <span className={color}>
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
    <span className="text-muted-foreground">
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
    <span className="text-emerald-500 font-medium">
     {formatCurrency(profit)}
    </span>
   )
  }
 }
]

function formatCurrency(value: number): string {
 return new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
 }).format(value)
}
