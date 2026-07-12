'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Navigation, 
  Wrench, 
  Zap, 
  BarChart3,
  LogOut 
} from 'lucide-react'
// TODO: Re-enable signOut after auth is working
// import { signOut } from 'next-auth/react'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Vehicles',
    href: '/dashboard/vehicles',
    icon: Truck,
  },
  {
    label: 'Drivers',
    href: '/dashboard/drivers',
    icon: Users,
  },
  {
    label: 'Trips',
    href: '/dashboard/trips',
    icon: Navigation,
  },
  {
    label: 'Maintenance',
    href: '/dashboard/maintenance',
    icon: Wrench,
  },
  {
    label: 'Fuel & Expenses',
    href: '/dashboard/fuel-expenses',
    icon: Zap,
  },
  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card">
      <div className="h-14 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">TransitOps</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            // TODO: Re-enable after auth is working
            // signOut({ redirect: true, callbackUrl: '/login' })
            alert('Sign out will be enabled after auth setup is complete')
          }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
