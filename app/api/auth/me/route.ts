import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const { userId } = requireAuth(request)
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    )
    
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 404 })
    }
    
    return NextResponse.json({ 
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      authenticated: true 
    })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}