export type UserRole = 'ADMIN' | 'OPERATIONS_MANAGER' | 'DRIVER' | 'ACCOUNTANT' | 'ANALYST'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

// Mock users for development/demo - no database needed
const mockUsers: Record<string, User & { password: string }> = {
  'admin@transitops.com': {
    id: 'user-admin',
    email: 'admin@transitops.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN',
  },
  'operations@transitops.com': {
    id: 'user-ops',
    email: 'operations@transitops.com',
    password: 'ops123',
    name: 'Operations Manager',
    role: 'OPERATIONS_MANAGER',
  },
  'john.driver@transitops.com': {
    id: 'user-driver',
    email: 'john.driver@transitops.com',
    password: 'driver123',
    name: 'John Driver',
    role: 'DRIVER',
  },
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const mockUser = mockUsers[email]
  if (mockUser && mockUser.password === password) {
    const { password: _, ...user } = mockUser
    return user
  }
  return null
}
