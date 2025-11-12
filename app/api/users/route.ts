import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { requireAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json()
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    const user = {
      fullName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      orders: 0,
      totalSpent: 0
    }
    
    const result = await db.collection('users').insertOne(user)
    
    return NextResponse.json({ 
      message: 'User created successfully',
      userId: result.insertedId 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    const users = await db.collection('users').find({}, {
      projection: { password: 0 }
    }).toArray()
    
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}