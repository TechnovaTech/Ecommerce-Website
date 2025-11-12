"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface CartItem {
  _id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  stock: number
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  })
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to fetch cart')
    } finally {
      setLoading(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 50
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  const placeOrder = async () => {
    if (!shippingAddress.street || !shippingAddress.city) {
      return
    }

    setProcessing(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          subtotal,
          tax,
          shipping,
          total,
          paymentMethod,
          shippingAddress,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid'
        })
      })

      if (response.ok) {
        await fetch('/api/cart/clear', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        alert('Order placed successfully!')
        window.location.href = '/orders'
      }
    } catch (error) {
      console.error('Order failed')
      alert('Failed to place order')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-32">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address *</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    placeholder="Enter your address"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      placeholder="State"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">PIN Code</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      placeholder="PIN Code"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when order arrives</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Online Payment</div>
                    <div className="text-sm text-gray-600">UPI, Card, Net Banking</div>
                  </div>
                </label>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
                onClick={placeOrder}
                disabled={processing || !shippingAddress.street || !shippingAddress.city}
              >
                {processing ? 'Processing...' : `Place Order - ₹${total.toFixed(0)}`}
              </Button>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}