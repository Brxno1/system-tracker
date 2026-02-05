import { useState } from 'react'
import { Settings2 } from 'lucide-react'
import { useBankrollStore } from '@/store'
import { Button } from '@/components/ui/button'
import {
 Sheet,
 SheetContent,
 SheetHeader,
 SheetTitle,
 SheetTrigger
} from '@/components/ui/sheet'
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
  <div className="flex h-[calc(100vh-60px)] flex-col gap-4">
   {/* Header with Title and Settings Trigger */}
   <div className="flex items-center justify-between px-2 pt-2">
    <h1 className="text-xl font-semibold tracking-tight">Assistente de Banca</h1>

    <Sheet>
     <SheetTrigger asChild>
      <Button variant="ghost" size="icon" title="Gerenciar Casas Manualmente">
       <Settings2 className="h-5 w-5" />
      </Button>
     </SheetTrigger>
     <SheetContent side="right" className="w-[400px] sm:w-[540px]">
      <SheetHeader>
       <SheetTitle>Gerenciar Casas & Saldos</SheetTitle>
      </SheetHeader>
      <div className="mt-6 flex flex-col gap-4">
       <Button onClick={handleAdd} className="w-full">
        Adicionar Nova Casa
       </Button>
       <div className="h-[calc(100vh-200px)] overflow-y-auto pr-2">
        <HouseList
         houses={houses}
         onAdd={handleAdd}
         onEdit={handleEdit}
         onDelete={handleDelete}
        />
       </div>
      </div>
     </SheetContent>
    </Sheet>
   </div>

   {/* Main Chat Interface - Full Screen */}
   <div className="flex-1 overflow-hidden rounded-xl border bg-background shadow-sm">
    <ChatInterface onBankrollDetected={(data) => {
     setParsedData(data)
     setIsConfirmOpen(true)
    }} />
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
