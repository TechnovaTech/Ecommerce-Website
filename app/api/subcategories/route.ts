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
    const { name, parentCategory, image } = await request.json()
    console.log('Creating subcategory:', { name, parentCategory, image })
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const subcategory = {
      name,
      parentCategory,
      image: image || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('Inserting subcategory:', subcategory)
    const result = await db.collection('subcategories').insertOne(subcategory)
    console.log('Subcategory created with ID:', result.insertedId)
    
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error('Subcategory creation error:', error)
    return NextResponse.json({ error: 'Failed to create subcategory: ' + error.message }, { status: 500 })
  }
}