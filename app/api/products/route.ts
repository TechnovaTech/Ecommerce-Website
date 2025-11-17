import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    const products = await db.collection('products').find({}).toArray()
    
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const product = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('products').insertOne(product)
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    await db.collection('products').deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}