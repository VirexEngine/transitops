import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Users, Clock, AlertCircle } from 'lucide-react'

interface Trip {
  id: string
  tripCode: string
  startLocation: string
  endLocation: string
  status: string
  distance: number
  cargoDescription: string
  vehicle: {
    registrationPlate: string
  }
  driver: {
    user: {
      name: string
    }
  }
  actualStartDate: Date | null
}

interface LiveOpsFeedProps {
  trips: Trip[]
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
    case 'in_progress':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
    case 'cancelled':
      return 'bg-red-500/10 text-red-700 dark:text-red-400'
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
  }
}

function getStatusLabel(status: string) {
  return status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
}

export function LiveOpsFeed({ trips }: LiveOpsFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Operations Feed</CardTitle>
        <CardDescription>Real-time trip updates and vehicle activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trips.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent trips</p>
            </div>
          ) : (
            trips.map((trip) => (
              <div
                key={trip.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{trip.tripCode}</h4>
                      <Badge className={getStatusColor(trip.status)}>
                        {getStatusLabel(trip.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {trip.cargoDescription}
                    </p>
                  </div>
                  {trip.status === 'in_progress' && (
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium">LIVE</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{trip.startLocation} → {trip.endLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{trip.driver.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{trip.distance} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-4 h-4" />
                    <span>{trip.vehicle.registrationPlate}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
