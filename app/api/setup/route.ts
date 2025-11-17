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
    
    // Add default categories if none exist
    const categoriesCollection = db.collection('categories')
    const categoryCount = await categoriesCollection.countDocuments()
    
    if (categoryCount === 0) {
      const defaultCategories = [
        { name: 'Home & Kitchen', status: 'active', image: '/kitchen-organizer.png', createdAt: new Date() },
        { name: 'Electronics', status: 'active', image: '/phone-stand.jpg', createdAt: new Date() },
        { name: 'Fashion', status: 'active', image: '/placeholder.jpg', createdAt: new Date() },
        { name: 'Sports & Fitness', status: 'active', image: '/placeholder.jpg', createdAt: new Date() },
        { name: 'Beauty & Personal Care', status: 'active', image: '/jewelry-box-organizer.jpg', createdAt: new Date() },
        { name: 'Books & Stationery', status: 'active', image: '/placeholder.jpg', createdAt: new Date() }
      ]
      await categoriesCollection.insertMany(defaultCategories)
    }
    
    // Add sample products if none exist
    const productsCollection = db.collection('products')
    const productCount = await productsCollection.countDocuments()
    
    if (productCount === 0) {
      const sampleProducts = [
        {
          name: 'Mobile Phone Stand',
          price: 199,
          stock: 50,
          minStock: 5,
          category: 'Electronics',
          discount: 10,
          description: 'Adjustable mobile phone stand for desk use',
          images: ['/phone-stand.jpg', '/portable-phone-stand-holder.jpg'],
          status: 'in-stock',
          createdAt: new Date()
        },
        {
          name: 'Kitchen Organizer Set',
          price: 349,
          stock: 30,
          minStock: 3,
          category: 'Home & Kitchen',
          discount: 15,
          description: 'Complete kitchen organization solution',
          images: ['/kitchen-organizer.png', '/kitchen-organizer-storage.jpg'],
          status: 'in-stock',
          createdAt: new Date()
        }
      ]
      await productsCollection.insertMany(sampleProducts)
    }
    
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