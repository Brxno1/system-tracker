import { Button } from '@/components/ui/button'
import { useBetsStore } from '@/store'

interface WinnerActionsProps {
 betId: string
 houseA: string
 houseB: string
}

export function WinnerActions({ betId, houseA, houseB }: WinnerActionsProps) {
 const markWinner = useBetsStore((state) => state.markWinner)

 return (
  <div className="flex gap-2">
   <Button
    variant="outline"
    size="sm"
    onClick={() => markWinner(betId, 'A')}
    className="h-7 text-xs hover:border-emerald-500 hover:text-emerald-500"
   >
    {houseA}
   </Button>
   <Button
    variant="outline"
    size="sm"
    onClick={() => markWinner(betId, 'B')}
    className="h-7 text-xs hover:border-emerald-500 hover:text-emerald-500"
   >
    {houseB}
   </Button>
  </div>
 )
}
