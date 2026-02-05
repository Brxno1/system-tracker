import { Badge } from '@/components/ui/badge'
import type { BetStatus } from '@/types'

interface StatusBadgeProps {
  status: BetStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={
        status === 'OPEN'
          ? 'border-amber-500/50 text-amber-500 hover:bg-amber-500/10'
          : 'border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10'
      }
    >
      {status === 'OPEN' ? 'Aberta' : 'Finalizada'}
    </Badge>
  )
}
