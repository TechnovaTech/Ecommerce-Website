import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export function getUserFromToken(request: NextRequest): { userId: string; isAdmin?: boolean } | null {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    return {
      userId: decoded.userId,
      isAdmin: decoded.isAdmin || false
    }
  } catch (error) {
    return null
  }
}

export function requireAuth(request: NextRequest) {
  const user = getUserFromToken(request)
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export function requireAdmin(request: NextRequest) {
  const user = requireAuth(request)
  if (!user.isAdmin) {
    throw new Error('Admin access required')
  }
  return user
}