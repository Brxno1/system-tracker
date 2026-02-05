import { useEffect, type ReactNode } from 'react'
import { useBetsStore, useBankrollStore, useSettingsStore } from '@/store'
import { Sidebar } from './sidebar'

interface AppShellProps {
 children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
 const initBets = useBetsStore((state) => state.init)
 const initBankroll = useBankrollStore((state) => state.init)
 const initSettings = useSettingsStore((state) => state.init)

 // Initialize all stores on mount
 useEffect(() => {
  initBets()
  initBankroll()
  initSettings()
 }, [initBets, initBankroll, initSettings])

 return (
  <div className="flex h-screen w-screen overflow-hidden bg-background">
   <Sidebar />
   <main className="flex-1 overflow-auto p-6">
    {children}
   </main>
  </div>
 )
}
