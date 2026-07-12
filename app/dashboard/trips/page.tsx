import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, MapPin, Users, DollarSign, Calendar } from 'lucide-react'

async function getTrips() {
  return prisma.trip.findMany({
    include: {
      vehicle: true,
      driver: { include: { user: true } },
      expenses: true,
    },
    orderBy: { plannedStartDate: 'desc' },
  })
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
    case 'in_progress':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
  }
}

export default async function TripsPage() {
  const trips = await getTrips()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trip Management</h1>
          <p className="text-muted-foreground mt-2">Track and manage all logistics trips</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Trip
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {trips.map((trip) => (
          <Card key={trip.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{trip.tripCode}</CardTitle>
                </div>
                <Badge className={getStatusColor(trip.status)}>
                  {trip.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Route</p>
                    <p className="font-medium text-foreground">
                      {trip.startLocation} → {trip.endLocation}
                    </p>
                    <p className="text-xs text-muted-foreground">{trip.distance} km</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Driver</p>
                    <p className="font-medium text-foreground">{trip.driver.user.name}</p>
                    <p className="text-xs text-muted-foreground">{trip.vehicle.registrationPlate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Planned</p>
                    <p className="font-medium text-foreground text-xs">
                      {new Date(trip.plannedStartDate).toLocaleDateString()}
                    </p>
                    {trip.actualStartDate && (
                      <p className="text-xs text-muted-foreground">
                        Started: {new Date(trip.actualStartDate).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p className="font-medium text-foreground">
                      ${trip.actualCost ?? trip.estimatedCost}
                    </p>
                    {trip.expenses.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {trip.expenses.length} expense{trip.expenses.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Cargo</p>
                  <p className="font-medium text-foreground text-sm">{trip.cargoWeight}t</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {trip.cargoDescription}
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
