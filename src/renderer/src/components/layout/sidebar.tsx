import { LayoutDashboard, Wallet, Settings, TrendingUp } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type NavItem = {
  label: string
  icon: typeof LayoutDashboard
  href: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Bankroll', icon: Wallet, href: '/bankroll' },
  { label: 'Settings', icon: Settings, href: '/settings' }
]

export function Sidebar() {
  const location = useLocation()

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
          <Button
            key={item.href}
            asChild
            variant={location.pathname === item.href ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start gap-3',
              location.pathname === item.href && 'bg-sidebar-accent text-sidebar-accent-foreground',
              location.pathname !== item.href && 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
            )}
          >
            <Link to={item.href}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>

      <div className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start gap-3 px-2">
          <div className="h-6 w-6 rounded-full bg-muted" />
          <div className="flex flex-col items-start text-xs">
            <span className="font-medium">User</span>
            <span className="text-muted-foreground">Pro Plan</span>
          </div>
        </Button>
      </div>
    </aside>
  )
}
