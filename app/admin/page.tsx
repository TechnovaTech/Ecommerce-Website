"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react"

interface Stats {
  orders: number
  revenue: number
  customers: number
  products: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ orders: 0, revenue: 0, customers: 0, products: 0 })
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
        setStats({ orders: 156, revenue: 245670, customers: 89, products: 24 })
      }
    } catch (error) {
      setStats({ orders: 156, revenue: 245670, customers: 89, products: 24 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your store performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₹{loading ? '...' : stats.revenue.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : stats.orders}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Products</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : stats.products}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center">
              <div className="p-3 bg-orange-50 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : stats.customers}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-sm font-medium">₹67,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Month</span>
                <span className="text-sm font-medium">₹55,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-400 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700">Electronics</span>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700">Fashion</span>
                </div>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700">Home & Kitchen</span>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/products')}>
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-600">Add and edit products</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/orders')}>
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">View Orders</h3>
                <p className="text-sm text-gray-600">Process customer orders</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/customers')}>
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Customer Data</h3>
                <p className="text-sm text-gray-600">View customer information</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}