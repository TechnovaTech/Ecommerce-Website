"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Calendar, Users, ShoppingCart, DollarSign, Package, BarChart3 } from "lucide-react"

interface AnalyticsData {
  monthlyRevenue: number[]
  monthlyOrders: number[]
  monthlyProfit: number[]
  dailyRevenue: number[]
  dailyProfit: number[]
  topProducts: Array<{name: string, revenue: number, orders: number}>
  expenses: number
  totalProfit: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    monthlyRevenue: [],
    monthlyOrders: [],
    monthlyProfit: [],
    dailyRevenue: [],
    dailyProfit: [],
    topProducts: [],
    expenses: 0,
    totalProfit: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const stats = await response.json()
        
        // Calculate profit (assuming 30% profit margin)
        const monthlyProfit = (stats.monthlyRevenue || []).map((rev: number) => Math.floor(rev * 0.3))
        const dailyProfit = (stats.dailyRevenue || []).map((rev: number) => Math.floor(rev * 0.3))
        const totalExpenses = Math.floor(stats.revenue * 0.7)
        const totalProfit = Math.floor(stats.revenue * 0.3)
        
        setData({
          monthlyRevenue: stats.monthlyRevenue || [],
          monthlyOrders: stats.monthlyOrders || [],
          monthlyProfit,
          dailyRevenue: stats.dailyRevenue || [],
          dailyProfit,
          topProducts: (stats.topProducts || []).map((p: any) => ({
            name: p.name,
            revenue: p.sales * 1000,
            orders: p.sales
          })),
          expenses: totalExpenses,
          totalProfit
        })
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  const thisMonthProfit = data.monthlyProfit[currentMonth] || 0
  const lastMonthProfit = data.monthlyProfit[currentMonth - 1] || 0
  const profitGrowth = lastMonthProfit ? ((thisMonthProfit - lastMonthProfit) / lastMonthProfit * 100).toFixed(1) : 0
  const totalRevenue = data.monthlyRevenue.reduce((sum, rev) => sum + rev, 0)
  const totalOrders = data.monthlyOrders.reduce((sum, orders) => sum + orders, 0)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>
            <p className="text-gray-600 text-lg">Comprehensive store performance and profit analysis</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-green-50 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-800 mt-1">₹{totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-500 mt-1">All time</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-300" />
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Profit</p>
                  <p className="text-2xl font-bold text-blue-800 mt-1">₹{data.totalProfit.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    {Number(profitGrowth) >= 0 ? 
                      <TrendingUp className="w-4 h-4 text-blue-500 mr-1" /> : 
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    }
                    <span className={`text-sm ${Number(profitGrowth) >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                      {profitGrowth}% vs last month
                    </span>
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-300" />
              </div>
            </Card>

            <Card className="p-6 bg-purple-50 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-purple-800 mt-1">{totalOrders}</p>
                  <p className="text-sm text-purple-500 mt-1">All time</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-purple-300" />
              </div>
            </Card>

            <Card className="p-6 bg-orange-50 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold text-orange-800 mt-1">₹{data.expenses.toLocaleString()}</p>
                  <p className="text-sm text-orange-500 mt-1">70% of revenue</p>
                </div>
                <Package className="w-8 h-8 text-orange-300" />
              </div>
            </Card>
          </div>

          {/* Monthly Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-white border border-green-100">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Monthly Revenue</h3>
              <div className="h-64">
                <div className="flex items-end justify-between h-full space-x-1">
                  {data.monthlyRevenue.map((revenue, index) => {
                    const height = (revenue / Math.max(...data.monthlyRevenue)) * 100
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className={`w-full rounded-t transition-all hover:opacity-80 ${
                            index === currentMonth ? 'bg-green-600' : 'bg-green-300'
                          }`}
                          style={{ height: `${height}%` }}
                          title={`${months[index]}: ₹${revenue.toLocaleString()}`}
                        ></div>
                        <span className="text-xs text-green-700 mt-2 font-medium">{months[index]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Monthly Profit</h3>
              <div className="h-64">
                <div className="flex items-end justify-between h-full space-x-1">
                  {data.monthlyProfit.map((profit, index) => {
                    const height = (profit / Math.max(...data.monthlyProfit)) * 100
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className={`w-full rounded-t transition-all hover:opacity-80 ${
                            index === currentMonth ? 'bg-blue-600' : 'bg-blue-300'
                          }`}
                          style={{ height: `${height}%` }}
                          title={`${months[index]}: ₹${profit.toLocaleString()}`}
                        ></div>
                        <span className="text-xs text-blue-700 mt-2 font-medium">{months[index]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Daily Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-white border border-purple-100">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Daily Revenue (30 Days)</h3>
              <div className="h-48">
                <div className="flex items-end justify-between h-full space-x-1">
                  {data.dailyRevenue.map((revenue, index) => {
                    const height = (revenue / Math.max(...data.dailyRevenue)) * 100
                    const date = new Date()
                    date.setDate(date.getDate() - 30 + index)
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full rounded-t bg-purple-400 transition-all hover:bg-purple-500"
                          style={{ height: `${height}%` }}
                          title={`${date.getDate()}/${date.getMonth() + 1}: ₹${revenue}`}
                        ></div>
                        <span className="text-xs text-purple-700 mt-1 font-medium">{date.getDate()}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-pink-100">
              <h3 className="text-xl font-semibold text-pink-800 mb-4">Daily Profit (30 Days)</h3>
              <div className="h-48">
                <div className="flex items-end justify-between h-full space-x-1">
                  {data.dailyProfit.map((profit, index) => {
                    const height = (profit / Math.max(...data.dailyProfit)) * 100
                    const date = new Date()
                    date.setDate(date.getDate() - 30 + index)
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full rounded-t bg-pink-400 transition-all hover:bg-pink-500"
                          style={{ height: `${height}%` }}
                          title={`${date.getDate()}/${date.getMonth() + 1}: ₹${profit}`}
                        ></div>
                        <span className="text-xs text-pink-700 mt-1 font-medium">{date.getDate()}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="p-6 bg-white border border-orange-100">
            <h3 className="text-xl font-semibold text-orange-800 mb-6">Top Performing Products</h3>
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-4 border border-orange-200 rounded-lg hover:border-orange-300 transition-colors">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-4 bg-orange-300"></div>
                    <div>
                      <p className="font-medium text-orange-800">{product.name}</p>
                      <p className="text-sm text-orange-600">{product.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-800">₹{product.revenue.toLocaleString()}</p>
                    <p className="text-sm text-orange-600">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}