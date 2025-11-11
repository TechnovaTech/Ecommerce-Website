"use client"

import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { Card } from "@/components/ui/card"

export default function CustomersPage() {
  const customers = [
    { id: 1, name: "John Doe", email: "john@example.com", orders: 3, total: 1299 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", orders: 1, total: 299 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", orders: 2, total: 748 },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Customers</h1>
              <p className="text-muted-foreground">Manage customer accounts</p>
            </div>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Name</th>
                      <th className="text-left py-3">Email</th>
                      <th className="text-left py-3">Orders</th>
                      <th className="text-left py-3">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-b">
                        <td className="py-3 font-medium">{customer.name}</td>
                        <td className="py-3">{customer.email}</td>
                        <td className="py-3">{customer.orders}</td>
                        <td className="py-3">₹{customer.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}