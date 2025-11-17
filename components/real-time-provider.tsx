"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface RealTimeContextType {
  socket: Socket | null
  isConnected: boolean
  onlineUsers: number
  notifications: any[]
}

const RealTimeContext = createContext<RealTimeContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: 0,
  notifications: []
})

export const useRealTime = () => useContext(RealTimeContext)

export default function RealTimeProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
      path: '/api/socket'
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
      setSocket(socketInstance)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    socketInstance.on('online-users', (count) => {
      setOnlineUsers(count)
    })

    socketInstance.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 9)])
    })

    socketInstance.on('stock-update', (data) => {
      // Broadcast stock updates to all components
      window.dispatchEvent(new CustomEvent('stock-update', { detail: data }))
    })

    socketInstance.on('order-update', (data) => {
      // Broadcast order updates
      window.dispatchEvent(new CustomEvent('order-update', { detail: data }))
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <RealTimeContext.Provider value={{ socket, isConnected, onlineUsers, notifications }}>
      {children}
    </RealTimeContext.Provider>
  )
}