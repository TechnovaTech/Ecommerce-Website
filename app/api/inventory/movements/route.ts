import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const movements = await db.collection('stock_movements')
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray()
    
    return NextResponse.json(movements)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}