import { useBetsStore } from '@/store'

interface WinnerActionsProps {
 betId: string
 houseA: string
 houseB: string
}

export function WinnerActions({ betId, houseA, houseB }: WinnerActionsProps) {
 const markWinner = useBetsStore((state) => state.markWinner)

 return (
  <div className="flex gap-1">
   <button
    onClick={() => markWinner(betId, 'A')}
    className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-emerald-500/20 hover:text-emerald-400"
   >
    {houseA}
   </button>
   <button
    onClick={() => markWinner(betId, 'B')}
    className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-emerald-500/20 hover:text-emerald-400"
   >
    {houseB}
   </button>
  </div>
 )
}
