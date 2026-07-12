import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardStats } from '@/components/dashboard/stats'
import { LiveOpsFeed } from '@/components/dashboard/live-ops-feed'

// Data from Supabase
const data = {
  stats: {
    activeVehicles: 10,
    activeDrivers: 2,
    activeTrips: 2,
    completedTrips: 1,
    maintenancePending: 2,
  },
  recentTrips: [
    {
      id: 'trip-1',
      tripNumber: 'TRP-001',
      status: 'completed',
      origin: 'New York, NY',
      destination: 'Boston, MA',
      loadType: 'Electronics',
      distance: 215.5,
      estimatedTime: 4.5,
      actualTime: 4.2,
      cost: 850,
      fuelUsed: 35.5,
      updatedAt: new Date(),
      vehicle: { id: 'v-1', licensePlate: 'NY-1234', make: 'Volvo', model: 'FH16', status: 'active' },
      driver: { id: 'd-1', firstName: 'John', lastName: 'Doe', user: { email: 'john@example.com' } },
    },
    {
      id: 'trip-2',
      tripNumber: 'TRP-002',
      status: 'in_progress',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
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
      status: 'in_progress',
      origin: 'Los Angeles, CA',
      destination: 'San Francisco, CA',
      loadType: 'General Cargo',
      distance: 380,
      estimatedTime: 6.0,
      actualTime: null,
      cost: 1240,
      fuelUsed: null,
      updatedAt: new Date(Date.now() - 7200000),
      vehicle: { id: 'v-3', licensePlate: 'CA-9101', make: 'Mercedes', model: 'Actros', status: 'active' },
      driver: { id: 'd-3', firstName: 'Mike', lastName: 'Johnson', user: { email: 'mike@example.com' } },
    },
  ],
}

export default function DashboardPage() {
  const userName = 'Fleet Operations'

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome, {userName}!</h1>
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
