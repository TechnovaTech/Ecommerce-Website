import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = requireAuth(request)
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const order = await db.collection('orders').findOne({ 
      _id: new ObjectId(params.id),
      userId: new ObjectId(userId)
    })
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    )
    
    const invoiceNumber = `INV-${order.orderNumber || order._id.toString().slice(-8)}`
    
    const bill = {
      orderNumber: order.orderNumber || order._id.toString().slice(-8),
      invoiceNumber,
      date: order.createdAt || new Date().toISOString(),
      status: 'Confirmed',
      company: {
        name: 'ShukaMall',
        address: '123 Business Street',
        city: 'Mumbai, Maharashtra 400001',
        phone: '+91 98765 43210',
        email: 'info@shukamall.com'
      },
      customer: {
        name: user?.name || 'Customer',
        email: user?.email || '',
        address: order.shippingAddress
      },
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus
    }
    
    return NextResponse.json(bill)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}