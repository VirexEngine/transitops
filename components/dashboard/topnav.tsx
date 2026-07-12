'use client'

import { useSession } from 'next-auth/react'
import { User, Bell } from 'lucide-react'

export function TopNav() {
  const { data: session } = useSession()

  return (
    <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Operations Management System
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="w-4 h-4 text-foreground" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {session?.user?.role?.toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
