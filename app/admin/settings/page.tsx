"use client"

import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("Shukan Mall")
  const [storeEmail, setStoreEmail] = useState("admin@shukanmall.com")
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your store settings and preferences</p>
            </div>

            {/* Store Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Store Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Store Name</label>
                  <Input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Enter store name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Store Email</label>
                  <Input
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    placeholder="Enter store email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Store Description</label>
                  <textarea
                    className="w-full p-3 border border-border rounded-md resize-none"
                    rows={3}
                    placeholder="Enter store description"
                    defaultValue="Your one-stop shop for quality products at affordable prices."
                  />
                </div>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications for new orders</p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Alerts</h3>
                    <p className="text-sm text-muted-foreground">Get email alerts for important updates</p>
                  </div>
                  <Switch
                    checked={emailAlerts}
                    onCheckedChange={setEmailAlerts}
                  />
                </div>
              </div>
            </Card>

            {/* Payment Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select className="w-full p-3 border border-border rounded-md">
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                  <Input
                    type="number"
                    placeholder="18"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </Card>

            {/* Security Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Security</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <div className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Current password"
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
              <Button variant="outline">
                Reset to Default
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}