import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all metrics
    const [trips, fuelRecords, expenses, maintenanceRecords, drivers, vehicles] = await Promise.all([
      prisma.trip.findMany({
        include: { vehicle: true, driver: true, expenses: true },
      }),
      prisma.fuelRecord.findMany(),
      prisma.expense.findMany(),
      prisma.maintenanceRecord.findMany(),
      prisma.driver.findMany({ include: { user: true, trips: true } }),
      prisma.vehicle.findMany({ include: { trips: true } }),
    ])

    // Calculate metrics
    const completedTrips = trips.filter(t => t.status === 'completed')
    const totalDistance = completedTrips.reduce((sum, t) => sum + t.distance, 0)
    const totalFuel = fuelRecords.reduce((sum, f) => sum + f.quantity, 0)
    const avgFuelConsumption = totalDistance > 0 ? totalFuel / totalDistance : 0
    
    const totalMaintenance = maintenanceRecords.reduce((sum, m) => sum + m.cost, 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
    
    const fleetUtilization = vehicles.length > 0 
      ? (trips.filter(t => t.status === 'in_progress').length / vehicles.length) * 100 
      : 0
    
    const avgTripCost = completedTrips.length > 0
      ? completedTrips.reduce((sum, t) => sum + (t.actualCost || t.estimatedCost), 0) / completedTrips.length
      : 0
    
    const avgSafetyScore = drivers.length > 0
      ? drivers.reduce((sum, d) => sum + d.safetyScore, 0) / drivers.length
      : 0

    const totalRevenue = completedTrips.reduce((sum, t) => sum + (t.actualCost || t.estimatedCost), 0)

    // Vehicle metrics
    const vehicleMetrics = vehicles.map(v => {
      const vehicleTrips = trips.filter(t => t.vehicleId === v.id)
      const vehicleFuel = fuelRecords.filter(f => f.vehicleId === v.id)
      const vehicleMaintenance = maintenanceRecords.filter(m => m.vehicleId === v.id)
      const vehicleDistance = vehicleTrips.reduce((sum, t) => sum + t.distance, 0)
      
      return {
        plate: v.registrationPlate,
        model: v.model,
        trips: vehicleTrips.length,
        fuel: vehicleFuel.reduce((sum, f) => sum + f.quantity, 0),
        maintenance: vehicleMaintenance.reduce((sum, m) => sum + m.cost, 0),
        utilization: vehicles.length > 0 ? (vehicleTrips.filter(t => t.status === 'in_progress').length / 1) * 100 : 0,
      }
    })

    // Driver metrics
    const driverMetrics = drivers.map(d => {
      const driverTrips = trips.filter(t => t.driverId === d.id)
      const driverExpenses = expenses.filter(e => 
        driverTrips.some(t => e.tripId === t.id)
      )
      
      return {
        name: d.user.name,
        trips: driverTrips.length,
        safetyScore: d.safetyScore,
        expenses: driverExpenses.reduce((sum, e) => sum + e.amount, 0),
      }
    })

    return NextResponse.json({
      metrics: {
        avgFuelConsumption,
        totalMaintenance,
        totalExpenses,
        fleetUtilization,
        avgTripCost,
        driverSafetyScore: avgSafetyScore,
        completedTrips: completedTrips.length,
        revenue: totalRevenue,
      },
      vehicleMetrics,
      driverMetrics,
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
