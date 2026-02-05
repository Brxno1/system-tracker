import { Edit, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { HouseBalance } from '@/types'

interface HouseCardProps {
 house: HouseBalance
 onEdit: (house: HouseBalance) => void
 onDelete: (name: string) => void
}

export function HouseCard({ house, onEdit, onDelete }: HouseCardProps) {
 const lastUpdate = new Date(house.updatedAt).toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
 })

 return (
  <Card className="transition-all hover:bg-muted/50">
   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">{house.name}</CardTitle>
    <div className="flex gap-1">
     <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      onClick={() => onEdit(house)}
     >
      <Edit className="h-4 w-4" />
     </Button>
     <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-destructive"
      onClick={() => onDelete(house.name)}
     >
      <Trash2 className="h-4 w-4" />
     </Button>
    </div>
   </CardHeader>
   <CardContent>
    <div className="text-2xl font-bold">{formatCurrency(house.balance)}</div>
    <p className="text-xs text-muted-foreground">Atualizado em {lastUpdate}</p>
   </CardContent>
  </Card>
 )
}
