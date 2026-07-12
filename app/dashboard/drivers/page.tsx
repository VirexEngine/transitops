import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react'

async function getDrivers() {
  return prisma.driver.findMany({
    include: {
      user: true,
      trips: { where: { status: 'in_progress' } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function DriversPage() {
  const drivers = await getDrivers()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Driver Management</h1>
          <p className="text-muted-foreground mt-2">Monitor driver performance and compliance</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Driver
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <Card key={driver.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">{driver.user.name}</h3>
                  <p className="text-sm text-muted-foreground">{driver.user.email}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">License:</span>
                    <span className="font-mono text-xs">{driver.licenseNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="text-xs">
                      {new Date(driver.licenseExpiry).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Safety Score:</span>
                    <span className="font-bold">{driver.safetyScore}/100</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={
                    driver.status === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'bg-red-500/10 text-red-700 dark:text-red-400'
                  }>
                    {driver.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {driver.trips.length} active trip{driver.trips.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
