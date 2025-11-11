"use client"

import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { Card } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">View store performance metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Revenue Trend</h3>
                <p className="text-2xl font-bold text-green-600">₹7,450</p>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Order Volume</h3>
                <p className="text-2xl font-bold text-blue-600">23</p>
                <p className="text-sm text-muted-foreground">+5% from last month</p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Customer Growth</h3>
                <p className="text-2xl font-bold text-purple-600">15</p>
                <p className="text-sm text-muted-foreground">+8% from last month</p>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Sales Overview</h3>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Chart placeholder - Analytics dashboard coming soon
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}