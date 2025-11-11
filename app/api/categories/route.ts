import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    const categories = await db.collection('categories').find({}).toArray()
    
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log('Creating category with data:', data)
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const category = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('Saving category:', category)
    const result = await db.collection('categories').insertOne(category)
    console.log('Category saved with ID:', result.insertedId)
    
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    console.log('Updating category with ID:', id, 'Data:', data)
    
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const updateData = { ...data, updatedAt: new Date() }
    console.log('Update data:', updateData)
    
    let objectId
    try {
      objectId = new ObjectId(id)
    } catch (err) {
      console.error('Invalid ObjectId:', id)
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }
    
    const result = await db.collection('categories').updateOne(
      { _id: objectId },
      { $set: updateData }
    )
    
    console.log('Update result:', result)
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category: ' + error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    await db.collection('categories').deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}