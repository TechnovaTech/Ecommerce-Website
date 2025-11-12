"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Card } from "@/components/ui/card"

interface Customer {
  _id: string
  fullName: string
  email: string
  orders: number
  totalSpent: number
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setCustomers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch customers:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Customers</h1>
              <p className="text-muted-foreground">Manage customer accounts</p>
            </div>

            <Card className="p-6">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-8">Loading customers...</div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Name</th>
                        <th className="text-left py-3">Email</th>
                        <th className="text-left py-3">Orders</th>
                        <th className="text-left py-3">Total Spent</th>
                        <th className="text-left py-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-500">
                            No customers found
                          </td>
                        </tr>
                      ) : (
                        customers.map((customer) => (
                          <tr key={customer._id} className="border-b">
                            <td className="py-3 font-medium">{customer.fullName}</td>
                            <td className="py-3">{customer.email}</td>
                            <td className="py-3">{customer.orders}</td>
                            <td className="py-3">₹{customer.totalSpent}</td>
                            <td className="py-3">{new Date(customer.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}