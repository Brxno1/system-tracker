import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout'
import { useBetsStore, useBankrollStore, selectTotalBankroll } from '@/store'
import { BetsTable } from '@/components/dashboard/bets-table'
import { KPICard } from '@/components/dashboard/kpi-card'
import { Bankroll } from '@/components/bankroll'
import { mockBets } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

function App() {
  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bankroll" element={<Bankroll />} />
        </Routes>
      </AppShell>
    </HashRouter>
  )
}

function Dashboard() {
  const bets = useBetsStore((state) => state.bets)
  const isLoading = useBetsStore((state) => state.isLoading)
  const totalBankroll = useBankrollStore(selectTotalBankroll)

  const displayBets = bets.length > 0 ? bets : mockBets

  const openBets = displayBets.filter((b) => b.status === 'OPEN')
  const wonBets = displayBets.filter((b) => b.status === 'WON')
  const totalProfit = wonBets.reduce((sum, b) => sum + (b.realizedProfit ?? 0), 0)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <KPICard label="Banca Total" value={formatCurrency(totalBankroll)} />
        <KPICard
          label="Lucro Total"
          value={formatCurrency(totalProfit)}
          variant={totalProfit >= 0 ? 'profit' : 'loss'}
        />
        <KPICard label="Apostas Abertas" value={openBets.length.toString()} />
      </div>

      <BetsTable data={displayBets} />
    </div>
  )
}

export default App
