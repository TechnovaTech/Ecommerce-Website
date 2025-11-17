import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = requireAuth(request)
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    await db.collection('carts').deleteOne({ userId: new ObjectId(userId) })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}