import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardStats } from '@/components/dashboard/stats'
import { LiveOpsFeed } from '@/components/dashboard/live-ops-feed'

// Mock data for development
const mockDashboardData = {
  stats: {
    activeVehicles: 42,
    activeDrivers: 28,
    activeTrips: 15,
    completedTrips: 234,
    maintenancePending: 3,
  },
  recentTrips: [
    {
      id: 'trip-1',
      tripNumber: 'TRP-001',
      status: 'in_progress',
      origin: 'New York',
      destination: 'Boston',
      loadType: 'General Cargo',
      distance: 215,
      estimatedTime: 4.5,
      actualTime: null,
      cost: 850,
      fuelUsed: null,
      updatedAt: new Date(),
      vehicle: { id: 'v-1', licensePlate: 'NY-1234', make: 'Volvo', model: 'FH16', status: 'active' },
      driver: { id: 'd-1', firstName: 'John', lastName: 'Doe', user: { email: 'john@example.com' } },
    },
    {
      id: 'trip-2',
      tripNumber: 'TRP-002',
      status: 'in_progress',
      origin: 'Chicago',
      destination: 'Detroit',
      loadType: 'Fragile Items',
      distance: 280,
      estimatedTime: 5.0,
      actualTime: null,
      cost: 920,
      fuelUsed: null,
      updatedAt: new Date(Date.now() - 3600000),
      vehicle: { id: 'v-2', licensePlate: 'IL-5678', make: 'Scania', model: 'R450', status: 'active' },
      driver: { id: 'd-2', firstName: 'Jane', lastName: 'Smith', user: { email: 'jane@example.com' } },
    },
    {
      id: 'trip-3',
      tripNumber: 'TRP-003',
      status: 'completed',
      origin: 'Los Angeles',
      destination: 'San Francisco',
      loadType: 'Electronics',
      distance: 380,
      estimatedTime: 6.0,
      actualTime: 6.2,
      cost: 1240,
      fuelUsed: 95,
      updatedAt: new Date(Date.now() - 7200000),
      vehicle: { id: 'v-3', licensePlate: 'CA-9101', make: 'Mercedes', model: 'Actros', status: 'active' },
      driver: { id: 'd-3', firstName: 'Mike', lastName: 'Johnson', user: { email: 'mike@example.com' } },
    },
  ],
}

async function getDashboardData() {
  try {
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
  } catch (error) {
    console.log('[v0] Database connection failed, using mock data:', error)
    return mockDashboardData
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
