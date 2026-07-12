import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

async function main() {
  console.log('Starting database seed...')

  // Clear existing data
  await prisma.auditLog.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.fuelRecord.deleteMany()
  await prisma.maintenanceRecord.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.user.deleteMany()

  // Create Admin User
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.create({
    data: {
      email: 'admin@transitops.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create Operations Manager
  const opPassword = await hashPassword('ops123')
  const opsManager = await prisma.user.create({
    data: {
      email: 'operations@transitops.com',
      password: opPassword,
      name: 'Operations Manager',
      role: 'OPERATIONS_MANAGER',
    },
  })

  // Create Fleet Manager
  const fleetPassword = await hashPassword('fleet123')
  const fleetManager = await prisma.user.create({
    data: {
      email: 'fleet@transitops.com',
      password: fleetPassword,
      name: 'Fleet Manager',
      role: 'FLEET_MANAGER',
    },
  })

  // Create Driver Users
  const driverPassword = await hashPassword('driver123')
  const driver1User = await prisma.user.create({
    data: {
      email: 'john.driver@transitops.com',
      password: driverPassword,
      name: 'John Driver',
      role: 'DRIVER',
    },
  })

  const driver2User = await prisma.user.create({
    data: {
      email: 'jane.driver@transitops.com',
      password: driverPassword,
      name: 'Jane Driver',
      role: 'DRIVER',
    },
  })

  // Create Analyst
  const analystPassword = await hashPassword('analyst123')
  const analyst = await prisma.user.create({
    data: {
      email: 'analyst@transitops.com',
      password: analystPassword,
      name: 'Data Analyst',
      role: 'ANALYST',
    },
  })

  // Create Drivers
  const driver1 = await prisma.driver.create({
    data: {
      licenseNumber: 'DL123456',
      licenseExpiry: new Date('2026-12-31'),
      safetyScore: 98,
      status: 'active',
      userId: driver1User.id,
    },
  })

  const driver2 = await prisma.driver.create({
    data: {
      licenseNumber: 'DL789012',
      licenseExpiry: new Date('2025-06-30'),
      safetyScore: 95,
      status: 'active',
      userId: driver2User.id,
    },
  })

  // Create Vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      registrationPlate: 'TRO-001',
      model: 'Volvo FH16',
      year: 2022,
      type: 'truck',
      status: 'active',
      fuelType: 'diesel',
      capacity: 25,
      maintenanceIntervalDays: 30000,
    },
  })

  const vehicle2 = await prisma.vehicle.create({
    data: {
      registrationPlate: 'TRO-002',
      model: 'MAN TGX',
      year: 2021,
      type: 'truck',
      status: 'active',
      fuelType: 'diesel',
      capacity: 20,
      maintenanceIntervalDays: 30000,
    },
  })

  const vehicle3 = await prisma.vehicle.create({
    data: {
      registrationPlate: 'TRO-003',
      model: 'Mercedes-Benz Sprinter',
      year: 2023,
      type: 'van',
      status: 'active',
      fuelType: 'diesel',
      capacity: 5,
      maintenanceIntervalDays: 20000,
    },
  })

  // Create Trips
  const trip1 = await prisma.trip.create({
    data: {
      tripCode: 'TRIP-001',
      startLocation: 'New York',
      endLocation: 'Boston',
      distance: 215,
      status: 'completed',
      plannedStartDate: new Date('2024-07-10 08:00'),
      actualStartDate: new Date('2024-07-10 08:15'),
      actualEndDate: new Date('2024-07-10 14:30'),
      cargoWeight: 18,
      cargoDescription: 'Electronics shipment',
      estimatedCost: 850,
      actualCost: 920,
      vehicleId: vehicle1.id,
      driverId: driver1.id,
    },
  })

  const trip2 = await prisma.trip.create({
    data: {
      tripCode: 'TRIP-002',
      startLocation: 'Boston',
      endLocation: 'Philadelphia',
      distance: 305,
      status: 'in_progress',
      plannedStartDate: new Date('2024-07-11 06:00'),
      actualStartDate: new Date('2024-07-11 06:30'),
      cargoWeight: 22,
      cargoDescription: 'Manufacturing parts',
      estimatedCost: 1200,
      vehicleId: vehicle2.id,
      driverId: driver2.id,
    },
  })

  const trip3 = await prisma.trip.create({
    data: {
      tripCode: 'TRIP-003',
      startLocation: 'Philadelphia',
      endLocation: 'Washington DC',
      distance: 140,
      status: 'pending',
      plannedStartDate: new Date('2024-07-12 09:00'),
      cargoWeight: 4,
      cargoDescription: 'Office supplies',
      estimatedCost: 450,
      vehicleId: vehicle3.id,
      driverId: driver1.id,
    },
  })

  // Create Fuel Records
  await prisma.fuelRecord.create({
    data: {
      quantity: 80,
      cost: 1200,
      fuelType: 'diesel',
      mileage: 125000,
      location: 'New York Fuel Station',
      date: new Date('2024-07-10 07:30'),
      vehicleId: vehicle1.id,
    },
  })

  await prisma.fuelRecord.create({
    data: {
      quantity: 70,
      cost: 1050,
      fuelType: 'diesel',
      mileage: 87500,
      location: 'Boston Fuel Station',
      date: new Date('2024-07-11 05:45'),
      vehicleId: vehicle2.id,
    },
  })

  // Create Maintenance Records
  await prisma.maintenanceRecord.create({
    data: {
      maintenanceType: 'preventive',
      description: 'Regular oil change and filter replacement',
      cost: 350,
      status: 'completed',
      maintenanceDate: new Date('2024-07-05'),
      vehicleId: vehicle1.id,
    },
  })

  await prisma.maintenanceRecord.create({
    data: {
      maintenanceType: 'corrective',
      description: 'Brake pad replacement',
      cost: 550,
      status: 'completed',
      maintenanceDate: new Date('2024-07-06'),
      vehicleId: vehicle2.id,
    },
  })

  await prisma.maintenanceRecord.create({
    data: {
      maintenanceType: 'preventive',
      description: 'Tire rotation and alignment',
      cost: 280,
      status: 'pending',
      dueDate: new Date('2024-07-20'),
      vehicleId: vehicle3.id,
    },
  })

  // Create Expenses
  await prisma.expense.create({
    data: {
      category: 'toll',
      description: 'Highway toll - NY to Boston',
      amount: 35,
      date: new Date('2024-07-10 10:00'),
      tripId: trip1.id,
    },
  })

  await prisma.expense.create({
    data: {
      category: 'accommodation',
      description: 'Driver accommodation - Boston',
      amount: 120,
      date: new Date('2024-07-10 18:00'),
      tripId: trip1.id,
    },
  })

  await prisma.expense.create({
    data: {
      category: 'meals',
      description: 'Meals during trip',
      amount: 45,
      date: new Date('2024-07-11 12:00'),
      tripId: trip2.id,
    },
  })

  // Create Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'CREATE',
      entity: 'VEHICLE',
      entityId: vehicle1.id,
      details: JSON.stringify({ model: 'Volvo FH16' }),
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
