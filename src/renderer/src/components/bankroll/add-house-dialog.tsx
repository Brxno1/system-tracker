import { useState, useEffect } from 'react'
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { HouseBalance } from '@/types'

interface AddHouseDialogProps {
 isOpen: boolean
 onClose: () => void
 onSave: (house: { name: string; balance: number }) => void
 houseToEdit?: HouseBalance | null
}

export function AddHouseDialog({
 isOpen,
 onClose,
 onSave,
 houseToEdit
}: AddHouseDialogProps) {
 const [name, setName] = useState('')
 const [balance, setBalance] = useState('')

 useEffect(() => {
  if (houseToEdit) {
   setName(houseToEdit.name)
   setBalance(houseToEdit.balance.toString())
  } else {
   setName('')
   setBalance('')
  }
 }, [houseToEdit, isOpen])

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (!name || !balance) return

  onSave({
   name,
   balance: parseFloat(balance)
  })
  onClose()
 }

 return (
  <Dialog open={isOpen} onOpenChange={onClose}>
   <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
     <DialogTitle>
      {houseToEdit ? 'Editar Casa' : 'Adicionar Casa'}
     </DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
     <div className="grid gap-2">
      <Label htmlFor="name">Nome da Casa</Label>
      <Input
       id="name"
       placeholder="Ex: Bet365"
       value={name}
       onChange={(e) => setName(e.target.value)}
       disabled={!!houseToEdit} // Disable name editing for now to simplify unique ID logic
      />
     </div>
     <div className="grid gap-2">
      <Label htmlFor="balance">Saldo Atual (R$)</Label>
      <Input
       id="balance"
       type="number"
       step="0.01"
       placeholder="0.00"
       value={balance}
       onChange={(e) => setBalance(e.target.value)}
      />
     </div>
     <DialogFooter>
      <Button type="button" variant="outline" onClick={onClose}>
       Cancelar
      </Button>
      <Button type="submit">Salvar</Button>
     </DialogFooter>
    </form>
   </DialogContent>
  </Dialog>
 )
}
