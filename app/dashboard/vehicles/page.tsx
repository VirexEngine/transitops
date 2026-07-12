import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

async function getVehicles() {
  return prisma.vehicle.findMany({
    include: {
      trips: { where: { status: 'in_progress' } },
      maintenanceRecords: { where: { status: { in: ['pending', 'in_progress'] } } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function VehiclesPage() {
  const vehicles = await getVehicles()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fleet Management</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor all vehicles in your fleet</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{vehicle.registrationPlate}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.model} ({vehicle.year})</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Type:</span> {vehicle.type}</p>
                    <p><span className="text-muted-foreground">Capacity:</span> {vehicle.capacity} tons</p>
                    <p><span className="text-muted-foreground">Status:</span> 
                      <span className={`ml-2 font-medium ${
                        vehicle.status === 'active' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {vehicle.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Active Trips</p>
                  <p className="text-2xl font-bold">{vehicle.trips.length}</p>
                  <p className="text-sm text-muted-foreground mt-4">Maintenance</p>
                  <p className={`text-2xl font-bold ${vehicle.maintenanceRecords.length > 0 ? 'text-destructive' : ''}`}>
                    {vehicle.maintenanceRecords.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
