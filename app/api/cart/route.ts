import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const { userId } = requireAuth(request)
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const cart = await db.collection('carts').findOne({ userId: new ObjectId(userId) })
    
    if (cart && cart.items) {
      // Populate missing image and stock data
      for (let item of cart.items) {
        if (!item.image || !item.stock) {
          const product = await db.collection('products').findOne({ _id: item.productId })
          if (product) {
            item.image = product.images?.[0] || null
            item.stock = product.stock
          }
        }
      }
    }
    
    return NextResponse.json(cart || { userId, items: [], total: 0 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = requireAuth(request)
    const { productId, quantity = 1 } = await request.json()
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const product = await db.collection('products').findOne({ _id: new ObjectId(productId) })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    await db.collection('carts').updateOne(
      { userId: new ObjectId(userId) },
      {
        $push: {
          items: {
            productId: new ObjectId(productId),
            name: product.name,
            price: product.price,
            image: product.images?.[0] || null,
            stock: product.stock,
            quantity,
            addedAt: new Date()
          }
        },
        $inc: { total: product.price * quantity },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = requireAuth(request)
    const { productId, quantity } = await request.json()
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    await db.collection('carts').updateOne(
      { userId: new ObjectId(userId), 'items.productId': new ObjectId(productId) },
      { $set: { 'items.$.quantity': quantity } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = requireAuth(request)
    const { productId } = await request.json()
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    await db.collection('carts').updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { items: { productId: new ObjectId(productId) } } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}