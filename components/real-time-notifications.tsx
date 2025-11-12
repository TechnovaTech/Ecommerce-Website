"use client"

import { useState, useEffect } from 'react'
import { Bell, X, Package, ShoppingCart, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRealTime } from './real-time-provider'

export default function RealTimeNotifications() {
  const { notifications, onlineUsers, isConnected } = useRealTime()
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
        suppressHydrationWarning
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Live Updates</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)} suppressHydrationWarning>
              <X size={16} />
            </Button>
          </div>

          <div className="mb-4 p-2 bg-green-50 rounded flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">
              {isConnected ? 'Connected' : 'Disconnected'} • {onlineUsers} users online
            </span>
          </div>

          <div className="space-y-2">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No new notifications</p>
            ) : (
              notifications.map((notification, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    {notification.type === 'order' && <Package size={16} className="text-blue-500 mt-1" />}
                    {notification.type === 'stock' && <ShoppingCart size={16} className="text-orange-500 mt-1" />}
                    {notification.type === 'user' && <Users size={16} className="text-green-500 mt-1" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  )
}