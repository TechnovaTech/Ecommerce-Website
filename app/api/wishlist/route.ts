import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const { userId } = requireAuth(request)
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const wishlist = await db.collection('wishlists').aggregate([
      { $match: { userId: new ObjectId(userId) } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items',
          foreignField: '_id',
          as: 'productId'
        }
      },
      { $unwind: '$productId' },
      {
        $project: {
          _id: 1,
          productId: 1
        }
      }
    ]).toArray()
    
    return NextResponse.json(wishlist)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = requireAuth(request)
    const { productId } = await request.json()
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    await db.collection('wishlists').updateOne(
      { userId: new ObjectId(userId) },
      {
        $addToSet: { items: new ObjectId(productId) },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
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
    
    await db.collection('wishlists').updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { items: new ObjectId(productId) } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}