import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const dbName = process.env.DATABASE_NAME || 'shukanmall'

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json()
    
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(dbName)
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      await client.close()
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
    await client.close()
    
    return NextResponse.json({ 
      message: 'User created successfully',
      userId: result.insertedId 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(dbName)
    
    const users = await db.collection('users').find({}, {
      projection: { password: 0 } // Exclude password from response
    }).toArray()
    
    await client.close()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}