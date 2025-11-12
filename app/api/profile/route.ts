import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user statistics
    const orders = await db.collection('orders').find({ userId: new ObjectId(userId) }).toArray()
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    
    return NextResponse.json({
      ...user,
      totalOrders,
      totalSpent
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = requireAuth(request)
    const { name, phone, address } = await request.json()
    
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const updateData: any = {
      name: name.trim(),
      updatedAt: new Date()
    }
    
    if (phone) updateData.phone = phone.trim()
    if (address) updateData.address = address
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}