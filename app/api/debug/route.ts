import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    const admins = db.collection('admins')
    
    const admin = await admins.findOne({ email: 'admin@shukanmall.com' })
    
    if (!admin) {
      return NextResponse.json({ 
        error: 'Admin not found',
        message: 'Run /api/setup first'
      })
    }
    
    const isValid = await bcrypt.compare('admin123', admin.password)
    
    return NextResponse.json({ 
      adminExists: true,
      email: admin.email,
      passwordValid: isValid,
      admin: { ...admin, password: '[HIDDEN]' }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Debug failed: ' + error.message 
    }, { status: 500 })
  }
}