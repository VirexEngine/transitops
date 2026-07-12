'use server'

import { createClient } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardStats } from '@/components/dashboard/stats'
import { LiveOpsFeed } from '@/components/dashboard/live-ops-feed'

// Mock data fallback
const mockDashboardData = {
  stats: {
    activeVehicles: 10,
    activeDrivers: 2,
    activeTrips: 2,
    completedTrips: 1,
    maintenancePending: 2,
  },
  recentTrips: [],
}

async function getDashboardData() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    // Fetch statistics
    const [vehiclesResult, driversResult, activeTripsResult, completedTripsResult, maintenanceResult, tripsResult] = 
      await Promise.all([
        supabase.from('vehicles').select('id').eq('status', 'active').count('exact'),
        supabase.from('drivers').select('id').count('exact'),
        supabase.from('trips').select('id').eq('status', 'in_progress').count('exact'),
        supabase.from('trips').select('id').eq('status', 'completed').count('exact'),
        supabase.from('maintenance_records').select('id').in('status', ['pending', 'in_progress']).count('exact'),
        supabase
          .from('trips')
          .select('id, trip_number, status, origin, destination, load_type, distance, estimated_time, actual_time, cost, fuel_used, updated_at, vehicle_id, driver_id')
          .order('updated_at', { ascending: false })
          .limit(10),
      ])

    const stats = {
      activeVehicles: vehiclesResult.count || 0,
      activeDrivers: driversResult.count || 0,
      activeTrips: activeTripsResult.count || 0,
      completedTrips: completedTripsResult.count || 0,
      maintenancePending: maintenanceResult.count || 0,
    }

    // Fetch vehicle and driver details for trips
    const trips = tripsResult.data || []
    const enrichedTrips = trips.map(trip => ({
      id: trip.id,
      tripNumber: trip.trip_number,
      status: trip.status,
      origin: trip.origin,
      destination: trip.destination,
      loadType: trip.load_type,
      distance: trip.distance,
      estimatedTime: trip.estimated_time,
      actualTime: trip.actual_time,
      cost: trip.cost,
      fuelUsed: trip.fuel_used,
      updatedAt: new Date(trip.updated_at),
      vehicle: { id: trip.vehicle_id, licensePlate: 'N/A', make: 'N/A', model: 'N/A', status: 'active' },
      driver: { id: trip.driver_id, firstName: 'Driver', lastName: 'N/A', user: { email: 'N/A' } },
    }))

    return {
      stats,
      recentTrips: enrichedTrips,
    }
  } catch (error) {
    console.log('[v0] Supabase connection failed, using mock data:', error)
    return mockDashboardData
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
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
