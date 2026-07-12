import { Card, CardContent } from '@/components/ui/card'
import { Truck, Users, Navigation, CheckCircle2, AlertCircle } from 'lucide-react'

interface DashboardStatsProps {
  stats: {
    activeVehicles: number
    activeDrivers: number
    activeTrips: number
    completedTrips: number
    maintenancePending: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Active Vehicles',
      value: stats.activeVehicles,
      icon: Truck,
      color: 'bg-blue-500/10',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Active Drivers',
      value: stats.activeDrivers,
      icon: Users,
      color: 'bg-green-500/10',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Active Trips',
      value: stats.activeTrips,
      icon: Navigation,
      color: 'bg-purple-500/10',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Completed Today',
      value: stats.completedTrips,
      icon: CheckCircle2,
      color: 'bg-emerald-500/10',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Maintenance Pending',
      value: stats.maintenancePending,
      icon: AlertCircle,
      color: 'bg-red-500/10',
      textColor: 'text-red-600 dark:text-red-400',
    },
  ]

  return (
    <div className="grid grid-cols-5 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
