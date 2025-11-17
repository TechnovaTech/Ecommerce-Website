import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const order = await db.collection('orders').findOne({ _id: new ObjectId(params.id) })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    // Get user details
    const user = await db.collection('users').findOne({ _id: order.userId })
    
    const invoice = {
      invoiceNumber: `INV-${order.orderNumber}`,
      orderNumber: order.orderNumber,
      date: order.createdAt,
      dueDate: new Date(order.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
      
      // Company details
      company: {
        name: 'Shukan Mall',
        address: '123 Business Street',
        city: 'Business City',
        phone: '+1 (555) 123-4567',
        email: 'info@shukanmall.com',
        website: 'www.shukanmall.com'
      },
      
      // Customer details
      customer: {
        name: user?.name || 'Customer',
        email: user?.email || '',
        address: order.shippingAddress
      },
      
      // Order details
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.paymentMethod,
      status: order.status
    }
    
    return NextResponse.json(invoice)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}