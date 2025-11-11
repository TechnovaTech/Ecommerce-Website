import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function GET() {
  return POST()
}

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    // Create collections if they don't exist
    await db.createCollection('admins').catch(() => {})
    await db.createCollection('products').catch(() => {})
    await db.createCollection('categories').catch(() => {})
    await db.createCollection('orders').catch(() => {})
    
    const admins = db.collection('admins')
    
    const existingAdmin = await admins.findOne({ email: 'admin@shukanmall.com' })
    
    if (existingAdmin) {
      return NextResponse.json({ message: 'Database and admin already exist' })
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    await admins.insertOne({
      email: 'admin@shukanmall.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      createdAt: new Date()
    })
    
    return NextResponse.json({ 
      message: 'Database and admin created successfully',
      credentials: {
        email: 'admin@shukanmall.com',
        password: 'admin123'
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Setup failed: ' + error.message }, { status: 500 })
  }
}