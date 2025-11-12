"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WishlistContextType {
  wishlistCount: number
  wishlistItems: string[]
  updateWishlistCount: () => void
  isInWishlist: (productId: string) => boolean
  addToWishlistLocal: (productId: string) => void
  removeFromWishlistLocal: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistCount, setWishlistCount] = useState(0)
  const [wishlistItems, setWishlistItems] = useState<string[]>([])

  const fetchWishlistCount = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setWishlistCount(0)
        return
      }

      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const productIds = data.map((item: any) => {
          if (item.productId && typeof item.productId === 'object') {
            return item.productId._id
          }
          return item.productId || item.product || item._id
        }).filter(Boolean)
        setWishlistItems(productIds)
        setWishlistCount(data.length || 0)
      } else {
        setWishlistCount(0)
        setWishlistItems([])
      }
    } catch (error) {
      console.error('Failed to fetch wishlist count:', error)
      setWishlistCount(0)
      setWishlistItems([])
    }
  }

  const updateWishlistCount = () => {
    fetchWishlistCount()
  }

  useEffect(() => {
    fetchWishlistCount()
  }, [])

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId)
  }

  const addToWishlistLocal = (productId: string) => {
    if (!wishlistItems.includes(productId)) {
      setWishlistItems(prev => [...prev, productId])
      setWishlistCount(prev => prev + 1)
    }
  }

  const removeFromWishlistLocal = (productId: string) => {
    if (wishlistItems.includes(productId)) {
      setWishlistItems(prev => prev.filter(id => id !== productId))
      setWishlistCount(prev => prev - 1)
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlistCount, wishlistItems, updateWishlistCount, isInWishlist, addToWishlistLocal, removeFromWishlistLocal }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}