import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useBankrollStore, selectTotalBankroll } from '@/store'
import { KPICard } from '@/components/dashboard/kpi-card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { HouseList } from './house-list'
import { AddHouseDialog } from './add-house-dialog'
import { ConfirmDialog } from './update-flow/confirm-dialog'
import { ChatInterface } from '../ai-chat'
import type { HouseBalance } from '@/types'
import type { ParsedBankroll } from '@/lib/ai/schemas'

export function Bankroll() {
 const houses = useBankrollStore((state) => state.houses)
 const updateHouseBalance = useBankrollStore((state) => state.updateHouseBalance)
 const updateMultipleHouses = useBankrollStore((state) => state.updateMultipleHouses)
 const deleteHouse = useBankrollStore((state) => state.deleteHouse)
 const totalBankroll = useBankrollStore(selectTotalBankroll)

 const [isDialogOpen, setIsDialogOpen] = useState(false)
 const [houseToEdit, setHouseToEdit] = useState<HouseBalance | null>(null)

 // AI Flow States
 const [parsedData, setParsedData] = useState<ParsedBankroll | null>(null)
 const [isConfirmOpen, setIsConfirmOpen] = useState(false)

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

 const handleConfirmAI = async () => {
  if (parsedData) {
   await updateMultipleHouses(parsedData.houses)
   setIsConfirmOpen(false)
   setParsedData(null)
  }
 }

 return (
  <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
   <div className="flex items-center justify-between shrink-0">
    <h1 className="text-2xl font-bold tracking-tight">Gestão de Banca</h1>
    <Button onClick={handleAdd}>
     <Plus className="mr-2 h-4 w-4" />
     Adicionar Manualmente
    </Button>
   </div>

   <div className="grid gap-4 md:grid-cols-3 shrink-0">
    <KPICard label="Banca Total" value={formatCurrency(totalBankroll)} />
    <KPICard label="Casas Cadastradas" value={houses.length.toString()} />
   </div>

   <div className="grid gap-6 lg:grid-cols-[1fr_400px] flex-1 min-h-0">
    <div className="overflow-y-auto pr-2">
     <HouseList
      houses={houses}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
     />
    </div>

    <div className="flex flex-col gap-2 h-full min-h-0">
     <h3 className="font-semibold shrink-0">Assistente IA</h3>
     <div className="flex-1 min-h-0">
      <ChatInterface onBankrollDetected={(data) => {
       setParsedData(data)
       setIsConfirmOpen(true)
      }} />
     </div>
    </div>
   </div>

   <AddHouseDialog
    isOpen={isDialogOpen}
    onClose={() => setIsDialogOpen(false)}
    onSave={handleSave}
    houseToEdit={houseToEdit}
   />

   <ConfirmDialog
    isOpen={isConfirmOpen}
    onClose={() => setIsConfirmOpen(false)}
    onConfirm={handleConfirmAI}
    data={parsedData}
   />
  </div>
 )
}
