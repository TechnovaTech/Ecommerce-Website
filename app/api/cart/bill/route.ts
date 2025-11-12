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
    
    const cart = await db.collection('carts').findOne({ userId: new ObjectId(userId) })
    
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    
    for (let item of cart.items) {
      if (!item.image || !item.stock) {
        const product = await db.collection('products').findOne({ _id: item.productId })
        if (product) {
          item.image = product.images?.[0] || null
          item.stock = product.stock
        }
      }
    }
    
    const subtotal = cart.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const shipping = subtotal > 500 ? 0 : 50
    const tax = subtotal * 0.1
    const total = subtotal + shipping + tax
    
    const billNumber = `BILL-${Date.now()}-${userId.slice(-4)}`
    
    const bill = {
      billNumber,
      date: new Date().toISOString(),
      company: {
        name: 'ShukaMall',
        address: '123 Business Street',
        city: 'Mumbai, Maharashtra 400001',
        phone: '+91 98765 43210',
        email: 'info@shukamall.com'
      },
      customer: {
        name: user.name,
        email: user.email,
        address: user.address
      },
      items: cart.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      tax,
      shipping,
      total
    }
    
    return NextResponse.json(bill)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}