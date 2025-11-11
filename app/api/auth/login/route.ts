import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Login attempt:', { email, password: password ? '[PROVIDED]' : '[MISSING]' })
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    const admins = db.collection('admins')
    
    const admin = await admins.findOne({ email })
    console.log('Admin found:', admin ? 'YES' : 'NO')
    
    if (!admin) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }
    
    const isValid = await bcrypt.compare(password, admin.password)
    console.log('Password valid:', isValid)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }
    
    return NextResponse.json({ success: true, admin: { email: admin.email, name: admin.name } })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed: ' + error.message }, { status: 500 })
  }
}