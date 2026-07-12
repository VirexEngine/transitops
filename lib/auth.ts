import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserRole
) {
  const hashedPassword = await hashPassword(password)
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      driver: true,
    },
  })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      driver: true,
    },
  })
}

export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email)
  
  if (!user || !user.active) {
    return null
  }
  
  const isPasswordValid = await verifyPassword(password, user.password)
  if (!isPasswordValid) {
    return null
  }
  
  return user
}

export async function logAuditEvent(
  userId: string,
  action: string,
  entity: string,
  entityId: string,
  details?: any
) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      details: details ? JSON.stringify(details) : null,
    },
  })
}
