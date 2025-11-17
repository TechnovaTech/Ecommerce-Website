"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CartContextType {
  cartCount: number
  updateCartCount: () => void
  refreshCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0)

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setCartCount(0)
        return
      }

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const count = data.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
        setCartCount(count)
      } else {
        setCartCount(0)
      }
    } catch (error) {
      setCartCount(0)
    }
  }

  const updateCartCount = () => {
    fetchCartCount()
  }

  const refreshCart = () => {
    fetchCartCount()
  }

  useEffect(() => {
    fetchCartCount()
  }, [])

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}