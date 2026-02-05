import { LayoutDashboard, Wallet, Settings } from 'lucide-react'
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
  <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
   {/* Header */}
   <div className="flex h-14 items-center border-b border-border px-4">
    <h1 className="text-lg font-semibold text-foreground">Sure Bets</h1>
   </div>

   {/* Navigation */}
   <nav className="flex-1 space-y-1 p-3">
    {navItems.map((item) => (
     <NavLink key={item.href} item={item} />
    ))}
   </nav>

   {/* Footer */}
   <div className="border-t border-border p-4">
    <p className="text-xs text-muted-foreground">v1.0.0</p>
   </div>
  </aside>
 )
}

function NavLink({ item }: { item: NavItem }) {
 const Icon = item.icon

 return (
  <button
   className={cn(
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    item.active
     ? 'bg-muted text-foreground'
     : 'text-muted-foreground hover:bg-muted hover:text-foreground'
   )}
  >
   <Icon className="h-4 w-4" />
   {item.label}
  </button>
 )
}
