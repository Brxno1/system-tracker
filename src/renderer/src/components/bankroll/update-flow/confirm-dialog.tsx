import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCurrency } from '@/lib/utils'
import type { ParsedBankroll } from '@/lib/ai/schemas'

interface ConfirmDialogProps {
 isOpen: boolean
 onClose: () => void
 onConfirm: () => void
 data: ParsedBankroll | null
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, data }: ConfirmDialogProps) {
 if (!data) return null

 const totalBalance = data.houses.reduce((acc, h) => acc + h.balance, 0)

 return (
  <Dialog open={isOpen} onOpenChange={onClose}>
   <DialogContent className="max-w-2xl">
    <DialogHeader>
     <DialogTitle>Confirmar Leitura da IA</DialogTitle>
     <DialogDescription>
      A IA identificou as seguintes casas e saldos. Verifique antes de salvar.
     </DialogDescription>
    </DialogHeader>

    <div className="rounded-md border">
     <ScrollArea className="h-[300px]">
      <Table>
       <TableHeader>
        <TableRow>
         <TableHead>Casa</TableHead>
         <TableHead className="text-right">Saldo</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {data.houses.map((house, index) => (
         <TableRow key={index}>
          <TableCell className="font-medium">{house.name}</TableCell>
          <TableCell className="text-right tabular-nums">
           {formatCurrency(house.balance)}
          </TableCell>
         </TableRow>
        ))}
       </TableBody>
      </Table>
     </ScrollArea>
    </div>

    <div className="flex items-center justify-between rounded-lg bg-muted p-4">
     <span className="font-semibold">Total Identificado</span>
     <span className="text-xl font-bold text-primary">{formatCurrency(totalBalance)}</span>
    </div>

    <DialogFooter>
     <Button variant="outline" onClick={onClose}>
      Cancelar
     </Button>
     <Button onClick={onConfirm}>Confirmar e Atualizar</Button>
    </DialogFooter>
   </DialogContent>
  </Dialog>
 )
}
