import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    const subcategories = await db.collection('subcategories').find({}).toArray()
    
    return NextResponse.json(subcategories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, parentCategory } = await request.json()
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const subcategory = {
      name,
      parentCategory,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('subcategories').insertOne(subcategory)
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create subcategory' }, { status: 500 })
  }
}