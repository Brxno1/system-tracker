import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HouseCard } from './house-card'
import type { HouseBalance } from '@/types'

interface HouseListProps {
 houses: HouseBalance[]
 onAdd: () => void
 onEdit: (house: HouseBalance) => void
 onDelete: (name: string) => void
}

export function HouseList({ houses, onAdd, onEdit, onDelete }: HouseListProps) {
 if (houses.length === 0) {
  return (
   <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50">
    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
     <h3 className="mt-4 text-lg font-semibold">Nenhuma casa registrada</h3>
     <p className="mb-4 mt-2 text-sm text-muted-foreground">
      Adicione sua primeira casa de aposta para acompanhar seu bankroll.
     </p>
     <Button onClick={onAdd}>
      <Plus className="mr-2 h-4 w-4" />
      Adicionar Casa
     </Button>
    </div>
   </div>
  )
 }

 return (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
   <Button
    variant="outline"
    className="flex h-full min-h-[140px] w-full flex-col items-center justify-center border-dashed hover:border-primary hover:bg-muted/50"
    onClick={onAdd}
   >
    <Plus className="h-6 w-6 text-muted-foreground" />
    <span className="mt-2 font-medium text-muted-foreground">Adicionar Casa</span>
   </Button>

   {houses.map((house) => (
    <HouseCard
     key={house.name}
     house={house}
     onEdit={onEdit}
     onDelete={onDelete}
    />
   ))}
  </div>
 )
}
