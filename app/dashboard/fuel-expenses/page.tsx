import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Fuel, DollarSign, Calendar } from 'lucide-react'

async function getFuelAndExpenses() {
  const [fuelRecords, expenses] = await Promise.all([
    prisma.fuelRecord.findMany({
      include: { vehicle: true },
      orderBy: { date: 'desc' },
      take: 50,
    }),
    prisma.expense.findMany({
      include: { trip: true, vehicle: true },
      orderBy: { date: 'desc' },
      take: 50,
    }),
  ])

  return { fuelRecords, expenses }
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    toll: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    parking: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    accommodation: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    meals: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    repair: 'bg-red-500/10 text-red-700 dark:text-red-400',
    other: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  }
  return colors[category] || colors.other
}

export default async function FuelExpensesPage() {
  const { fuelRecords, expenses } = await getFuelAndExpenses()

  const totalFuelCost = fuelRecords.reduce((sum, r) => sum + r.cost, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalFuelLiters = fuelRecords.reduce((sum, r) => sum + r.quantity, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fuel & Expenses</h1>
          <p className="text-muted-foreground mt-2">Track operational costs and fuel consumption</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Log Fuel
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Log Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Fuel Cost</p>
              <p className="text-3xl font-bold">${totalFuelCost.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Fuel Liters</p>
              <p className="text-3xl font-bold">{totalFuelLiters.toFixed(0)}L</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <Fuel className="w-5 h-5" />
              Fuel Records
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {fuelRecords.map((record) => (
              <Card key={record.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{record.vehicle.registrationPlate}</p>
                      <p className="text-sm text-muted-foreground">{record.location}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(record.date).toLocaleDateString()} at {' '}
                        {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${record.cost}</p>
                      <p className="text-sm text-muted-foreground">{record.quantity}L</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Trip Expenses
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <Card key={expense.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getCategoryColor(expense.category)}>
                          {expense.category}
                        </Badge>
                      </div>
                      <p className="font-medium text-foreground text-sm">{expense.description}</p>
                      {expense.trip && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Trip: {expense.trip.tripCode}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground text-lg">${expense.amount}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
