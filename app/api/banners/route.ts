import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { requireAdmin } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    // Check if admin is requesting (has authorization header)
    const authHeader = request.headers.get('authorization')
    const isAdmin = authHeader && authHeader.startsWith('Bearer ')
    
    let query = {}
    if (!isAdmin) {
      // Public request - only active banners
      query = { active: true }
    }
    // Admin request - all banners
    
    const banners = await db.collection('banners')
      .find(query)
      .sort({ order: 1 })
      .toArray()
    
    return NextResponse.json(banners)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    const { title, description, image, link, active = true } = await request.json()
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const maxOrder = await db.collection('banners').findOne({}, { sort: { order: -1 } })
    const order = (maxOrder?.order || 0) + 1
    
    const banner = {
      title: title || '',
      description: description || '',
      image: image || '',
      link: link || '',
      active,
      order,
      createdAt: new Date()
    }
    
    const result = await db.collection('banners').insertOne(banner)
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const status = message.includes('Admin access required') ? 403 : message.includes('Authentication required') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    const { id, ...updates } = await request.json()
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    // Clean up empty strings
    const cleanUpdates = {
      title: updates.title || '',
      description: updates.description || '',
      image: updates.image || '',
      link: updates.link || '',
      active: updates.active !== undefined ? updates.active : true
    }
    
    await db.collection('banners').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...cleanUpdates, updatedAt: new Date() } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const status = message.includes('Admin access required') ? 403 : message.includes('Authentication required') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = requireAdmin(request)
    const { id } = await request.json()
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    await db.collection('banners').deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const status = message.includes('Admin access required') ? 403 : message.includes('Authentication required') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}