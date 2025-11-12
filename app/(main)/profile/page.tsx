"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, Package, MapPin, Eye } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  _id: string
  name: string
  email: string
  phone?: string
  createdAt: string
  totalOrders?: number
  totalSpent?: number
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

interface Order {
  _id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })

  useEffect(() => {
    fetchProfile()
    fetchOrders()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          street: data.address?.street || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          zipCode: data.address?.zipCode || '',
          country: data.address?.country || 'India'
        })
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.slice(0, 5))
      }
    } catch (error) {
      console.error('Failed to fetch orders')
    }
  }

  const updateProfile = async () => {
    if (!formData.name.trim()) {
      alert('Name is required')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: {
            street: formData.street.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            zipCode: formData.zipCode.trim(),
            country: formData.country.trim() || 'India'
          }
        })
      })

      if (response.ok) {
        await fetchProfile()
        setEditing(false)
        alert('Profile updated successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update profile')
      }
    } catch (error) {
      alert('Failed to update profile')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-orange-100 text-orange-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 rounded mb-4"></div>
            <div className="bg-gray-200 h-32 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen mt-22 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left p-3 rounded flex items-center gap-3 ${
                    activeTab === 'profile' ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <User size={20} />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left p-3 rounded flex items-center gap-3 ${
                    activeTab === 'orders' ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <Package size={20} />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('address')}
                  className={`w-full text-left p-3 rounded flex items-center gap-3 ${
                    activeTab === 'address' ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <MapPin size={20} />
                  Address
                </button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-600">{user?.totalOrders || 0}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded">
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-green-600">₹{user?.totalSpent?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded">
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="text-lg font-bold text-purple-600">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    <Button
                      variant="outline"
                      onClick={() => editing ? updateProfile() : setEditing(true)}
                    >
                      {editing ? 'Save' : 'Edit'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!editing}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Address</label>
                      <Input value={formData.email} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!editing}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Account ID</label>
                      <Input value={user?._id || ''} disabled className="bg-gray-50 font-mono text-sm" />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'orders' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No orders found</p>
                    <Link href="/products">
                      <Button className="mt-4 bg-teal-600 hover:bg-teal-700 text-white">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border rounded p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">Order #{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {order.items.slice(0, 2).map((item, index) => (
                            <span key={index}>
                              {item.name} x{item.quantity}
                              {index < Math.min(order.items.length, 2) - 1 && ', '}
                            </span>
                          ))}
                          {order.items.length > 2 && ` +${order.items.length - 2} more`}
                        </div>
                        <Link href={`/orders/${order._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye size={16} className="mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'address' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Address Information</h2>
                  <Button
                    variant="outline"
                    onClick={() => editing ? updateProfile() : setEditing(true)}
                  >
                    {editing ? 'Save' : 'Edit'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Street Address</label>
                    <Input
                      value={formData.street}
                      onChange={(e) => setFormData({...formData, street: e.target.value})}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ZIP Code</label>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      disabled={!editing}
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}