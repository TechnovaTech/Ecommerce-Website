"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WishlistContextType {
  wishlistCount: number
  updateWishlistCount: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistCount, setWishlistCount] = useState(0)

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
        setWishlistCount(data.length || 0)
      } else {
        setWishlistCount(0)
      }
    } catch (error) {
      console.error('Failed to fetch wishlist count:', error)
      setWishlistCount(0)
    }
  }

  const updateWishlistCount = () => {
    fetchWishlistCount()
  }

  useEffect(() => {
    fetchWishlistCount()
  }, [])

  return (
    <WishlistContext.Provider value={{ wishlistCount, updateWishlistCount }}>
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