import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

async function getMaintenanceRecords() {
  return prisma.maintenanceRecord.findMany({
    include: {
      vehicle: true,
    },
    orderBy: { maintenanceDate: 'desc' },
  })
}

function getTypeColor(type: string) {
  switch (type) {
    case 'preventive':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
    case 'corrective':
      return 'bg-orange-500/10 text-orange-700 dark:text-orange-400'
    case 'emergency':
      return 'bg-red-500/10 text-red-700 dark:text-red-400'
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    case 'in_progress':
      return <Clock className="w-5 h-5 text-blue-600" />
    case 'pending':
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    default:
      return null
  }
}

export default async function MaintenancePage() {
  const records = await getMaintenanceRecords()

  const pending = records.filter(r => r.status === 'pending').length
  const inProgress = records.filter(r => r.status === 'in_progress').length
  const completed = records.filter(r => r.status === 'completed').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Maintenance Management</h1>
          <p className="text-muted-foreground mt-2">Track vehicle maintenance and repairs</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Log Maintenance
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{inProgress}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-emerald-600">{completed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {records.map((record) => (
          <Card key={record.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{record.vehicle.registrationPlate}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{record.vehicle.model}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(record.maintenanceType)}>
                    {record.maintenanceType}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(record.status)}
                    <span className="text-sm font-medium">{record.status}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-foreground">{record.description}</p>
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium text-sm">
                      {new Date(record.maintenanceDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cost</p>
                    <p className="font-medium text-sm">${record.cost}</p>
                  </div>
                  {record.dueDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="font-medium text-sm">
                        {new Date(record.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
