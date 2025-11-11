import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Login attempt:', { email, password: password ? '[PROVIDED]' : '[MISSING]' })
    
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    // Check users collection first
    const users = db.collection('users')
    const user = await users.findOne({ email })
    
    if (user) {
      const isValid = await bcrypt.compare(password, user.password)
      
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )
      
      return NextResponse.json({ 
        success: true, 
        token,
        user: { 
          id: user._id,
          email: user.email, 
          fullName: user.fullName 
        } 
      })
    }
    
    // Check admins collection as fallback
    const admins = db.collection('admins')
    const admin = await admins.findOne({ email })
    
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const isValid = await bcrypt.compare(password, admin.password)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    return NextResponse.json({ 
      success: true, 
      token,
      user: { 
        id: admin._id,
        email: admin.email, 
        name: admin.name,
        isAdmin: true
      } 
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed: ' + error.message }, { status: 500 })
  }
}