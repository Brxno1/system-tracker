import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useBankrollStore, selectTotalBankroll } from '@/store'
import { KPICard } from '@/components/dashboard/kpi-card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { HouseList } from './house-list'
import { AddHouseDialog } from './add-house-dialog'
import type { HouseBalance } from '@/types'

export function Bankroll() {
 const houses = useBankrollStore((state) => state.houses)
 const updateHouseBalance = useBankrollStore((state) => state.updateHouseBalance)
 const deleteHouse = useBankrollStore((state) => state.deleteHouse)
 const totalBankroll = useBankrollStore(selectTotalBankroll)

 const [isDialogOpen, setIsDialogOpen] = useState(false)
 const [houseToEdit, setHouseToEdit] = useState<HouseBalance | null>(null)

 const handleAdd = () => {
  setHouseToEdit(null)
  setIsDialogOpen(true)
 }

 const handleEdit = (house: HouseBalance) => {
  setHouseToEdit(house)
  setIsDialogOpen(true)
 }

 const handleDelete = async (name: string) => {
  if (confirm(`Tem certeza que deseja remover a casa ${name}?`)) {
   await deleteHouse(name)
  }
 }

 const handleSave = async ({
  name,
  balance
 }: {
  name: string
  balance: number
 }) => {
  await updateHouseBalance(name, balance)
  setIsDialogOpen(false)
 }

 return (
  <div className="space-y-6">
   <div className="flex items-center justify-between">
    <h1 className="text-2xl font-bold tracking-tight">Gestão de Banca</h1>
    <Button onClick={handleAdd}>
     <Plus className="mr-2 h-4 w-4" />
     Adicionar Casa
    </Button>
   </div>

   <div className="grid gap-4 md:grid-cols-3">
    <KPICard label="Banca Total" value={formatCurrency(totalBankroll)} />
    <KPICard label="Casas Cadastradas" value={houses.length.toString()} />
   </div>

   <HouseList
    houses={houses}
    onAdd={handleAdd}
    onEdit={handleEdit}
    onDelete={handleDelete}
   />

   <AddHouseDialog
    isOpen={isDialogOpen}
    onClose={() => setIsDialogOpen(false)}
    onSave={handleSave}
    houseToEdit={houseToEdit}
   />
  </div>
 )
}
