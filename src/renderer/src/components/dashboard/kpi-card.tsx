import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KPICardProps {
 label: string
 value: string
 variant?: 'default' | 'profit' | 'loss'
}

export function KPICard({ label, value, variant = 'default' }: KPICardProps) {
 return (
  <Card className="transition-colors hover:bg-muted/50">
   <CardContent className="p-4">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p
     className={cn(
      'text-2xl font-semibold tabular-nums',
      variant === 'profit' && 'text-emerald-500',
      variant === 'loss' && 'text-rose-500'
     )}
    >
     {value}
    </p>
   </CardContent>
  </Card>
 )
}
