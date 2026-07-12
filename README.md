# TransitOps - Fleet Management System

A production-ready fleet and logistics management platform built with Next.js 16, TypeScript, Prisma, and Tailwind CSS.

## Overview

TransitOps is a comprehensive logistics operations management system designed to streamline fleet management, driver oversight, trip coordination, and operational analytics. The platform enforces strict role-based access control and implements 12 core business rules for fleet operations.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT strategy
- **Real-time Updates**: Live ops feed with status monitoring

## Features

### Core Modules

1. **Dashboard** - Real-time fleet status overview
   - Live operations feed with trip tracking
   - Key performance metrics (vehicles, drivers, trips, maintenance)
   - Fleet utilization and completion rates

2. **Vehicle Management** - Complete fleet inventory
   - Registration, model, year, and capacity tracking
   - Maintenance status monitoring
   - Active trip assignments per vehicle

3. **Driver Management** - Driver profiles and performance
   - License management with expiry tracking
   - Safety score monitoring (0-100 scale)
   - Trip history and performance metrics

4. **Trip Management** - Logistics operation tracking
   - Trip creation and scheduling
   - Route management (start/end locations)
   - Cargo weight and description tracking
   - Cost estimation vs. actual tracking
   - Real-time status updates

5. **Maintenance Management** - Vehicle maintenance tracking
   - Preventive, corrective, and emergency maintenance
   - Cost tracking and scheduling
   - Maintenance status monitoring

6. **Fuel & Expenses** - Operational cost management
   - Fuel consumption tracking by vehicle
   - Multi-category expense logging (toll, parking, meals, etc.)
   - Cost analysis and optimization

7. **Reports & Analytics** - Fleet performance insights
   - CSV export functionality
   - 4 core analytics formulas:
     - Average fuel consumption (L/km)
     - Fleet utilization percentage
     - Average trip cost
     - Driver safety scores
   - Vehicle and driver performance metrics
   - Financial summaries

### Role-Based Access Control

- **Admin**: Full system access
- **Operations Manager**: Fleet operations and trip management
- **Fleet Manager**: Vehicle and driver oversight
- **Driver**: Personal trip and fuel logging
- **Analyst**: Report generation and analytics

### Business Rules

1. **Trip Rules**: Only completed trips count toward metrics
2. **Safety Compliance**: Driver license expiry checking
3. **Vehicle Status**: Maintenance status affects trip assignment
4. **Cost Tracking**: Actual vs. estimated cost variance analysis
5. **Fuel Monitoring**: Per-vehicle fuel consumption tracking
6. **Expense Categories**: Standardized categorization
7. **Maintenance Scheduling**: Preventive maintenance intervals
8. **Driver Performance**: Safety score adjustments
9. **Trip Validation**: Distance and weight verification
10. **Audit Logging**: All operations logged
11. **Real-time Status**: Live trip updates
12. **Report Accuracy**: Data consistency validation

## Database Schema

### Entities

- **User** - Authentication and role management
- **Driver** - Driver profiles with license info
- **Vehicle** - Fleet inventory with maintenance intervals
- **Trip** - Trip management with cost tracking
- **MaintenanceRecord** - Vehicle maintenance history
- **FuelRecord** - Fuel consumption tracking
- **Expense** - Multi-category operational expenses
- **AuditLog** - Operation history and compliance

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Configure your database URL in .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/transitops"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Setup

```bash
# Generate Prisma client
pnpm exec prisma generate

# Seed database with demo data
pnpm seed
```

### Running the Application

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit http://localhost:3000 - you'll be redirected to the login page.

## Demo Credentials

### Admin Account
- Email: `admin@transitops.com`
- Password: `admin123`

### Operations Manager
- Email: `operations@transitops.com`
- Password: `ops123`

### Driver
- Email: `john.driver@transitops.com`
- Password: `driver123`

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth configuration
│   │   └── reports/              # Analytics API endpoints
│   ├── dashboard/                # Main dashboard and modules
│   │   ├── vehicles/
│   │   ├── drivers/
│   │   ├── trips/
│   │   ├── maintenance/
│   │   ├── fuel-expenses/
│   │   └── reports/
│   ├── login/                    # Authentication page
│   └── layout.tsx                # Root layout with auth provider
├── components/
│   ├── dashboard/
│   │   ├── sidebar.tsx           # Navigation sidebar
│   │   ├── topnav.tsx            # Top navigation with user info
│   │   ├── stats.tsx             # Dashboard metrics cards
│   │   └── live-ops-feed.tsx     # Real-time trip updates
│   ├── providers/
│   │   └── auth-provider.tsx     # NextAuth SessionProvider wrapper
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── auth.ts                   # Authentication utilities
│   ├── prisma.ts                 # Prisma client
│   └── utils.ts                  # Helper functions
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Database seeding script
│   └── prisma.config.ts          # Prisma configuration
└── README.md
```

## Key Components

### Authentication Flow
1. User enters credentials on login page
2. NextAuth validates against database
3. JWT token stored in session
4. Protected routes redirect to login if unauthorized
5. Dashboard layout enforces authentication

### Dashboard Data Flow
1. Server-side data fetching in page components
2. Prisma queries with relationships included
3. Real-time stats calculation
4. Client-side live feed updates
5. CSV export from aggregated data

### Role-Based Features
- Sidebar navigation updates based on user role
- Dashboard modules filtered by permissions
- Reports accessible only to authorized roles

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `POST /api/auth/callback/credentials` - Credential verification

### Reports
- `GET /api/reports` - Fetch analytics data
  - Returns: metrics, vehicleMetrics, driverMetrics

## Deployment

The application is optimized for deployment on Vercel:

```bash
# Deploy to Vercel
vercel deploy

# Set environment variables in Vercel dashboard
NEXTAUTH_SECRET
NEXTAUTH_URL
DATABASE_URL
```

## Performance Considerations

- Server-side data fetching reduces client bundle size
- Prisma query optimization with indexes
- CSS-in-JS with Tailwind for minimal CSS output
- Component code splitting with Next.js lazy loading
- Optimized images with Next.js Image component

## Security

- Passwords hashed with bcryptjs (10 rounds)
- JWT-based session management
- CSRF protection via NextAuth
- Input validation on server routes
- Audit logging of all operations
- Environment variable protection

## Future Enhancements

- GPS tracking integration
- Real-time location updates
- Mobile companion app
- Advanced predictive analytics
- Machine learning for route optimization
- Integration with payment gateways
- Multi-language support
- Dark mode theme toggle

## Support

For issues or questions, please open an issue in the repository or contact the development team.

## License

Proprietary - TransitOps Fleet Management System
