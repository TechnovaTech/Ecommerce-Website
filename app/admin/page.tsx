"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, Calendar, Eye, Sparkles, ArrowUp } from "lucide-react"

interface Stats {
  orders: number
  revenue: number
  customers: number
  products: number
  todayRevenue: number
  todayOrders: number
  monthlyRevenue: number[]
  monthlyOrders: number[]
  dailyRevenue: number[]
  dailyOrders: number[]
  topProducts: Array<{name: string, sales: number}>
  recentOrders: Array<{id: string, customer: string, amount: number, status: string}>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    orders: 0, revenue: 0, customers: 0, products: 0, todayRevenue: 0, todayOrders: 0,
    monthlyRevenue: [], monthlyOrders: [], dailyRevenue: [], dailyOrders: [],
    topProducts: [], recentOrders: []
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error('Failed to fetch stats')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  const thisMonthRevenue = stats.monthlyRevenue?.[currentMonth] || 0
  const lastMonthRevenue = stats.monthlyRevenue?.[currentMonth - 1] || 0
  const revenueGrowth = lastMonthRevenue ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Dashboard</h1>
          </div>
          <p className="text-gray-600 text-lg">Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 bg-blue-50 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Today's Sales</p>
                <p className="text-2xl font-bold text-blue-800 mt-1">₹{loading ? '...' : stats.todayRevenue.toLocaleString()}</p>
                <p className="text-sm text-blue-500 mt-1">{loading ? '...' : stats.todayOrders} orders</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-300" />
            </div>
          </Card>
          
          <Card className="p-6 bg-green-50 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-800 mt-1">₹{loading ? '...' : stats.revenue.toLocaleString()}</p>
                <p className="text-sm text-green-500 mt-1">+{revenueGrowth}%</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-300" />
            </div>
          </Card>

          <Card className="p-6 bg-purple-50 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-purple-800 mt-1">{loading ? '...' : stats.orders}</p>
                <p className="text-sm text-purple-500 mt-1">Active</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-purple-300" />
            </div>
          </Card>

          <Card className="p-6 bg-pink-50 border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-600 text-sm font-medium">Products</p>
                <p className="text-2xl font-bold text-pink-800 mt-1">{loading ? '...' : stats.products}</p>
                <p className="text-sm text-pink-500 mt-1">In Stock</p>
              </div>
              <Package className="w-8 h-8 text-pink-300" />
            </div>
          </Card>

          <Card className="p-6 bg-orange-50 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Customers</p>
                <p className="text-2xl font-bold text-orange-800 mt-1">{loading ? '...' : stats.customers}</p>
                <p className="text-sm text-orange-500 mt-1">Registered</p>
              </div>
              <Users className="w-8 h-8 text-orange-300" />
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white border border-rose-100">
            <h3 className="text-xl font-semibold text-rose-800 mb-6">Recent Orders</h3>
            <div className="space-y-4">
              {(stats.recentOrders || []).slice(0, 6).map((order, index) => (
                <div key={index} className="flex justify-between items-center p-4 border border-rose-200 rounded-lg hover:border-rose-300 transition-colors">
                  <div>
                    <p className="font-medium text-rose-800">#{order.id}</p>
                    <p className="text-sm text-rose-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-rose-800">₹{order.amount}</p>
                    <span className="text-xs px-3 py-1 rounded bg-rose-200 text-rose-700">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white border border-rose-100">
            <h3 className="text-xl font-semibold text-rose-800 mb-6">Top Products</h3>
            <div className="space-y-4">
              {(stats.topProducts || []).map((product, index) => (
                <div key={index} className="flex justify-between items-center p-4 border border-rose-200 rounded-lg hover:border-rose-300 transition-colors">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-4 bg-rose-300"></div>
                    <span className="font-medium text-rose-800">{product.name}</span>
                  </div>
                  <span className="font-semibold text-rose-700">{product.sales} sold</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/products')}>
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Products</h3>
                <p className="text-sm text-gray-600">Manage inventory</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/orders')}>
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Orders</h3>
                <p className="text-sm text-gray-600">Process orders</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/customers')}>
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Customers</h3>
                <p className="text-sm text-gray-600">Customer data</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/analytics')}>
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-orange-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">Detailed reports</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}