import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    const admins = db.collection('admins')
    
    const existingAdmin = await admins.findOne({ email: 'admin@shukanmall.com' })
    
    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin already exists' })
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    await admins.insertOne({
      email: 'admin@shukanmall.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      createdAt: new Date()
    })
    
    return NextResponse.json({ message: 'Admin created successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}