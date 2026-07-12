import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardStats } from '@/components/dashboard/stats'
import { LiveOpsFeed } from '@/components/dashboard/live-ops-feed'

async function getDashboardData() {
  const [vehicleCount, driverCount, activeTrips, completedTrips, maintenancePending] = await Promise.all([
    prisma.vehicle.count({ where: { status: 'active' } }),
    prisma.driver.count({ where: { status: 'active' } }),
    prisma.trip.count({ where: { status: 'in_progress' } }),
    prisma.trip.count({ where: { status: 'completed' } }),
    prisma.maintenanceRecord.count({ where: { status: { in: ['pending', 'in_progress'] } } }),
  ])

  const trips = await prisma.trip.findMany({
    take: 10,
    orderBy: { updatedAt: 'desc' },
    include: {
      vehicle: true,
      driver: { include: { user: true } },
    },
  })

  return {
    stats: {
      activeVehicles: vehicleCount,
      activeDrivers: driverCount,
      activeTrips,
      completedTrips,
      maintenancePending,
    },
    recentTrips: trips,
  }
}

export default async function DashboardPage() {
  const session = await getServerSession()
  const data = await getDashboardData()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome, {session?.user?.name}!</h1>
        <p className="text-muted-foreground mt-2">Real-time fleet operations overview</p>
      </div>

      <DashboardStats stats={data.stats} />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <LiveOpsFeed trips={data.recentTrips} />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Fleet Utilization</p>
              <p className="text-2xl font-bold">
                {data.stats.activeTrips > 0 
                  ? Math.round((data.stats.activeTrips / Math.max(data.stats.activeVehicles, 1)) * 100) 
                  : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Trips (Completed)</p>
              <p className="text-2xl font-bold">{data.stats.completedTrips}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Maintenance Pending</p>
              <p className="text-2xl font-bold text-destructive">{data.stats.maintenancePending}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
