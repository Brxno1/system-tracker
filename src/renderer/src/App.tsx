import { AppShell } from '@/components/layout'
import { useBetsStore, useBankrollStore, selectTotalBankroll } from '@/store'
import { BetsTable } from '@/components/dashboard/bets-table'
import { mockBets } from '@/lib/mock-data'

function App() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  )
}

// Temporary Dashboard component - will be moved to its own file
function Dashboard() {
  const bets = useBetsStore((state) => state.bets)
  const isLoading = useBetsStore((state) => state.isLoading)
  const totalBankroll = useBankrollStore(selectTotalBankroll)

  // Use mock data for now
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
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard
          label="Banca Total"
          value={formatCurrency(totalBankroll)}
        />
        <KPICard
          label="Lucro Total"
          value={formatCurrency(totalProfit)}
          variant={totalProfit >= 0 ? 'profit' : 'loss'}
        />
        <KPICard
          label="Apostas Abertas"
          value={openBets.length.toString()}
        />
      </div>

      {/* Bets Table */}
      <BetsTable data={displayBets} />
    </div>
  )
}

// Temporary KPI Card - will be moved to its own file
function KPICard({
  label,
  value,
  variant = 'default'
}: {
  label: string
  value: string
  variant?: 'default' | 'profit' | 'loss'
}) {
  const valueColor = {
    default: 'text-foreground',
    profit: 'text-emerald-500',
    loss: 'text-rose-500'
  }[variant]

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-2xl font-semibold ${valueColor}`}>{value}</p>
    </div>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export default App
