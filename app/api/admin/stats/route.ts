import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DATABASE_NAME || 'shukanmall')
    
    // Get real data from database
    const [orders, users, products, ordersData] = await Promise.all([
      db.collection('orders').countDocuments(),
      db.collection('users').countDocuments(),
      db.collection('products').countDocuments(),
      db.collection('orders').find({}).toArray()
    ])
    
    // Calculate total revenue
    const revenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0)
    
    // Calculate monthly data
    const monthlyData = Array(12).fill(0).map(() => ({ revenue: 0, orders: 0, customers: new Set() }))
    
    // Calculate today's sales
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    let todayRevenue = 0
    let todayOrders = 0
    
    // Calculate daily data for last 30 days
    const dailyData = Array(30).fill(0).map(() => ({ revenue: 0, orders: 0 }))
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    ordersData.forEach(order => {
      const orderDate = new Date(order.createdAt)
      const month = orderDate.getMonth()
      monthlyData[month].revenue += order.total || 0
      monthlyData[month].orders += 1
      monthlyData[month].customers.add(order.userId)
      
      // Calculate today's sales
      if (orderDate >= today && orderDate < tomorrow) {
        todayRevenue += order.total || 0
        todayOrders += 1
      }
      
      // Calculate daily data for last 30 days
      if (orderDate >= thirtyDaysAgo) {
        const dayIndex = Math.floor((orderDate - thirtyDaysAgo) / (1000 * 60 * 60 * 24))
        if (dayIndex >= 0 && dayIndex < 30) {
          dailyData[dayIndex].revenue += order.total || 0
          dailyData[dayIndex].orders += 1
        }
      }
    })
    
    const monthlyRevenue = monthlyData.map(data => data.revenue)
    const monthlyOrders = monthlyData.map(data => data.orders)
    const monthlyCustomers = monthlyData.map(data => data.customers.size)
    const dailyRevenue = dailyData.map(data => data.revenue)
    const dailyOrders = dailyData.map(data => data.orders)
    
    // Get top products
    const topProducts = await db.collection('orders').aggregate([
      { $unwind: '$items' },
      { $group: { 
        _id: '$items.name', 
        sales: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }},
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $project: { name: '$_id', sales: 1, revenue: 1, _id: 0 } }
    ]).toArray()
    
    // Get recent orders
    const recentOrders = await db.collection('orders').aggregate([
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $sort: { createdAt: -1 } },
      { $limit: 4 },
      { $project: { 
        id: { $concat: ['#', { $toString: '$orderNumber' }] },
        customer: '$user.name',
        amount: '$total',
        status: '$status'
      }}
    ]).toArray()
    
    const stats = {
      orders,
      revenue: Math.round(revenue),
      customers: users,
      products,
      todayRevenue: Math.round(todayRevenue),
      todayOrders,
      monthlyRevenue,
      monthlyOrders,
      monthlyCustomers,
      dailyRevenue,
      dailyOrders,
      topProducts,
      recentOrders
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}