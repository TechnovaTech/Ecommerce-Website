import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

function generateOrderNumber() {
  return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
}

function generateTrackingNumber() {
  return 'TRK' + Date.now() + Math.random().toString(36).substr(2, 8).toUpperCase()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'
    const status = searchParams.get('status')
    const orderId = searchParams.get('orderId')
    
    if (isAdmin) {
      // Admin can see all orders
      const client = await clientPromise
      const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
      
      let query = {}
      if (status && status !== 'all') query.status = status
      if (orderId) query._id = new ObjectId(orderId)
      
      const orders = await db.collection('orders')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray()
      
      return NextResponse.json(orders)
    } else {
      // Regular user sees only their orders
      const { userId } = requireAuth(request)
      
      const client = await clientPromise
      const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
      
      let query = { userId: new ObjectId(userId) }
      if (status && status !== 'all') query.status = status
      
      const orders = await db.collection('orders')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray()
      
      return NextResponse.json(orders)
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = requireAuth(request)
    const { items, shippingAddress, paymentMethod } = await request.json()
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    // Check stock availability
    for (const item of items) {
      const product = await db.collection('products').findOne({ _id: new ObjectId(item.productId) })
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.name}` }, { status: 400 })
      }
    }
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 500 ? 0 : 50 // Free shipping over $500
    const total = subtotal + tax + shipping
    
    const orderNumber = generateOrderNumber()
    const trackingNumber = generateTrackingNumber()
    
    const order = {
      orderNumber,
      trackingNumber,
      userId: new ObjectId(userId),
      items,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
      trackingHistory: [{
        status: 'Order Placed',
        timestamp: new Date(),
        description: 'Your order has been placed successfully'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('orders').insertOne(order)
    
    // Update product stock
    for (const item of items) {
      await db.collection('products').updateOne(
        { _id: new ObjectId(item.productId) },
        { $inc: { stock: -item.quantity } }
      )
    }
    
    // Clear user's cart after order
    await db.collection('carts').deleteOne({ userId: new ObjectId(userId) })
    
    return NextResponse.json({ orderId: result.insertedId, orderNumber, success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { orderId, status, action, reason } = await request.json()
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    let updateData = { updatedAt: new Date() }
    let newTrackingEntry = null
    
    if (action === 'cancel') {
      if (['delivered', 'shipped'].includes(order.status)) {
        return NextResponse.json({ error: 'Cannot cancel shipped/delivered orders' }, { status: 400 })
      }
      
      updateData.status = 'cancelled'
      updateData.cancelReason = reason
      updateData.cancelledAt = new Date()
      
      // Restore stock
      for (const item of order.items) {
        await db.collection('products').updateOne(
          { _id: new ObjectId(item.productId) },
          { $inc: { stock: item.quantity } }
        )
      }
      
      newTrackingEntry = {
        status: 'Cancelled',
        timestamp: new Date(),
        description: `Order cancelled. Reason: ${reason}`
      }
    } else if (action === 'return') {
      if (order.status !== 'delivered') {
        return NextResponse.json({ error: 'Can only return delivered orders' }, { status: 400 })
      }
      
      updateData.status = 'return_requested'
      updateData.returnReason = reason
      updateData.returnRequestedAt = new Date()
      
      newTrackingEntry = {
        status: 'Return Requested',
        timestamp: new Date(),
        description: `Return requested. Reason: ${reason}`
      }
    } else if (status) {
      // Admin updating order status
      updateData.status = status
      
      const statusMessages = {
        'confirmed': 'Order confirmed and being prepared',
        'processing': 'Order is being processed',
        'shipped': 'Order has been shipped',
        'delivered': 'Order delivered successfully',
        'return_approved': 'Return request approved',
        'return_rejected': 'Return request rejected',
        'refunded': 'Refund processed successfully'
      }
      
      if (status === 'delivered') {
        updateData.deliveredAt = new Date()
      }
      
      newTrackingEntry = {
        status: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
        timestamp: new Date(),
        description: statusMessages[status] || `Order status updated to ${status}`
      }
    }
    
    if (newTrackingEntry) {
      updateData.$push = { trackingHistory: newTrackingEntry }
    }
    
    await db.collection('orders').updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updateData, ...(newTrackingEntry ? { $push: { trackingHistory: newTrackingEntry } } : {}) }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}