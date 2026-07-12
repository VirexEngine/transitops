'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, TrendingUp } from 'lucide-react'

interface ReportData {
  metrics: {
    avgFuelConsumption: number
    totalMaintenance: number
    totalExpenses: number
    fleetUtilization: number
    avgTripCost: number
    driverSafetyScore: number
    completedTrips: number
    revenue: number
  }
  vehicleMetrics: Array<{
    plate: string
    model: string
    trips: number
    fuel: number
    maintenance: number
    utilization: number
  }>
  driverMetrics: Array<{
    name: string
    trips: number
    safetyScore: number
    expenses: number
  }>
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch('/api/reports')
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch report data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReportData()
  }, [])

  const handleExportCSV = async () => {
    if (!data) return

    const rows = [
      ['Fleet Performance Report', new Date().toLocaleDateString()],
      [],
      ['METRICS'],
      ['Average Fuel Consumption (L/km)', data.metrics.avgFuelConsumption.toFixed(2)],
      ['Total Maintenance Cost', data.metrics.totalMaintenance],
      ['Total Expenses', data.metrics.totalExpenses],
      ['Fleet Utilization (%)', data.metrics.fleetUtilization.toFixed(2)],
      ['Average Trip Cost', data.metrics.avgTripCost.toFixed(2)],
      ['Average Driver Safety Score', data.metrics.driverSafetyScore.toFixed(2)],
      ['Completed Trips', data.metrics.completedTrips],
      ['Revenue Generated', data.metrics.revenue.toFixed(2)],
      [],
      ['VEHICLE METRICS'],
      ['Registration Plate', 'Model', 'Trips', 'Fuel (L)', 'Maintenance ($)', 'Utilization (%)'],
      ...data.vehicleMetrics.map(v => [
        v.plate,
        v.model,
        v.trips,
        v.fuel.toFixed(2),
        v.maintenance.toFixed(2),
        v.utilization.toFixed(2),
      ]),
      [],
      ['DRIVER METRICS'],
      ['Name', 'Trips', 'Safety Score', 'Expenses ($)'],
      ...data.driverMetrics.map(d => [
        d.name,
        d.trips,
        d.safetyScore.toFixed(2),
        d.expenses.toFixed(2),
      ]),
    ]

    const csv = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fleet-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading report data...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load report data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fleet Analytics & Reports</h1>
          <p className="text-muted-foreground mt-2">Comprehensive performance metrics and analytics</p>
        </div>
        <Button onClick={handleExportCSV} className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Avg Fuel Consumption
              </p>
              <p className="text-2xl font-bold">{data.metrics.avgFuelConsumption.toFixed(2)} L/km</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Fleet Utilization</p>
              <p className="text-2xl font-bold">{data.metrics.fleetUtilization.toFixed(0)}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg Trip Cost</p>
              <p className="text-2xl font-bold">${data.metrics.avgTripCost.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Driver Safety Score</p>
              <p className="text-2xl font-bold">{data.metrics.driverSafetyScore.toFixed(1)}/100</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.vehicleMetrics.map((vehicle, idx) => (
                <div key={idx} className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{vehicle.plate}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.model}</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                      {vehicle.utilization.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Trips</p>
                      <p className="font-medium">{vehicle.trips}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fuel</p>
                      <p className="font-medium">{vehicle.fuel.toFixed(0)}L</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Maintenance</p>
                      <p className="font-medium">${vehicle.maintenance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Driver Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.driverMetrics.map((driver, idx) => (
                <div key={idx} className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-foreground">{driver.name}</p>
                    <Badge className={`${
                      driver.safetyScore >= 95 
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {driver.safetyScore.toFixed(0)}/100
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Trips</p>
                      <p className="font-medium">{driver.trips}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Safety Score</p>
                      <p className="font-medium">{driver.safetyScore.toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expenses</p>
                      <p className="font-medium">${driver.expenses}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Maintenance</p>
              <p className="text-2xl font-bold">${data.metrics.totalMaintenance}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold">${data.metrics.totalExpenses}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-600">${data.metrics.revenue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Trips</p>
              <p className="text-2xl font-bold">{data.metrics.completedTrips}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
