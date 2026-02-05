import { cn } from '@/lib/utils'
import type { BetStatus } from '@/types'

interface StatusBadgeProps {
 status: BetStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
 return (
  <span
   className={cn(
    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
    status === 'OPEN'
     ? 'bg-amber-500/20 text-amber-400'
     : 'bg-emerald-500/20 text-emerald-400'
   )}
  >
   {status === 'OPEN' ? 'Aberta' : 'Finalizada'}
  </span>
 )
}
