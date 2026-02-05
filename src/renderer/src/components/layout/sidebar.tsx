import { LayoutDashboard, Wallet, Settings, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  icon: typeof LayoutDashboard
  href: string
  active?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/', active: true },
  { label: 'Bankroll', icon: Wallet, href: '/bankroll' },
  { label: 'Settings', icon: Settings, href: '/settings' }
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b px-6">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <TrendingUp className="h-4 w-4" />
        </div>
        <span className="font-semibold tracking-tight">System Tracker</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-sidebar-accent/50">
          <div className="h-8 w-8 rounded-full bg-muted/50" />
          <div className="flex flex-col text-sm">
            <span className="font-medium">User</span>
            <span className="text-xs text-muted-foreground">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavLink({ item }: { item: NavItem }) {
  const Icon = item.icon

  return (
    <button
      className={cn(
        'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        item.active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </button>
  )
}
