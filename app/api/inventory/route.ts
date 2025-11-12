import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lowStock = searchParams.get('lowStock') === 'true'
    const productId = searchParams.get('productId')
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    let query = {}
    if (lowStock) {
      query = { stock: { $lte: 10 } } // Low stock threshold
    }
    if (productId) {
      query = { _id: new ObjectId(productId) }
    }
    
    const products = await db.collection('products')
      .find(query)
      .project({ name: 1, stock: 1, price: 1, category: 1, sku: 1 })
      .sort({ stock: 1 })
      .toArray()
    
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { productId, stock, action, quantity, reason } = await request.json()
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const product = await db.collection('products').findOne({ _id: new ObjectId(productId) })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    let newStock = stock
    if (action === 'add') {
      newStock = product.stock + quantity
    } else if (action === 'subtract') {
      newStock = Math.max(0, product.stock - quantity)
    }
    
    // Update product stock
    await db.collection('products').updateOne(
      { _id: new ObjectId(productId) },
      { $set: { stock: newStock, updatedAt: new Date() } }
    )
    
    // Log stock movement
    await db.collection('stock_movements').insertOne({
      productId: new ObjectId(productId),
      productName: product.name,
      previousStock: product.stock,
      newStock,
      quantity: action === 'add' ? quantity : -quantity,
      action,
      reason: reason || 'Manual adjustment',
      timestamp: new Date()
    })
    
    return NextResponse.json({ success: true, newStock })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json() // Bulk stock update
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const bulkOps = products.map(({ productId, stock }) => ({
      updateOne: {
        filter: { _id: new ObjectId(productId) },
        update: { $set: { stock, updatedAt: new Date() } }
      }
    }))
    
    await db.collection('products').bulkWrite(bulkOps)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}