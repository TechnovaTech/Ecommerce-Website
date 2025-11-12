"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Minus, ShoppingBag, Download } from "lucide-react"
import Link from "next/link"

interface CartItem {
  _id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  stock: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showBill, setShowBill] = useState(false)
  const [bill, setBill] = useState<any>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  })
  const [processing, setProcessing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    setIsLoggedIn(!!token)
    if (token) {
      fetchCart()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      } else if (response.status === 401) {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Failed to fetch cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      })

      if (response.ok) {
        fetchCart()
      } else if (response.status === 401) {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Failed to update quantity')
    }
  }

  const removeItem = async (productId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        fetchCart()
      } else if (response.status === 401) {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Failed to remove item')
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500 ? 0 : 50
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  const proceedToCheckout = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      window.location.href = '/login'
      return
    }
    setShowCheckout(true)
  }

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
        const order = await response.json()
        await fetch('/api/cart/clear', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        const billResponse = await fetch(`/api/orders/${order.orderId}/bill`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (billResponse.ok) {
          const billData = await billResponse.json()
          setBill(billData)
          setOrderSuccess(true)
          setShowBill(true)
          setShowCheckout(false)
          fetchCart()
        }
      }
    } catch (error) {
      console.error('Order failed')
    } finally {
      setProcessing(false)
    }
  }

  if (!isLoggedIn && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to login to view your cart</p>
          <Link href="/login">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">Login</Button>
          </Link>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 rounded mb-4"></div>
            <div className="bg-gray-200 h-32 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen mt-22 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="p-8 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">Add some products to get started</p>
            <Link href="/products">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">Continue Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <Card key={`${item.productId}-${index}`} className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{item.name}</h3>
                      <p className="font-bold mb-1" style={{color: 'lab(52.12% 47.1194 27.3658)'}}>₹{item.price}</p>
                      <p className="text-sm text-gray-500 mb-3">Stock: {item.stock}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="border px-2 py-1 rounded hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="border px-2 py-1 rounded hover:bg-gray-100"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold mb-2">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => removeItem(item.productId)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%)</span>
                    <span>₹{tax.toFixed(0)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-lg" style={{color: 'lab(52.12% 47.1194 27.3658)'}}>₹{total.toFixed(0)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full text-white mb-2" 
                  style={{backgroundColor: 'lab(52.12% 47.1194 27.3658)'}}
                  onClick={proceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Link href="/products">
                  <Button variant="outline" className="w-full bg-transparent">
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl m-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-teal-700">Complete Your Order</h2>
                <p className="text-sm text-gray-600">Fill in your details to place the order</p>
              </div>
              <Button variant="outline" onClick={() => setShowCheckout(false)}>✕</Button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">📍 Delivery Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-700">House/Flat/Office Address *</label>
                    <input
                      type="text"
                      className={`w-full p-3 border rounded-lg ${!shippingAddress.street ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="Enter your complete address"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                      required
                    />
                    {!shippingAddress.street && <p className="text-red-500 text-xs mt-1">Address is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">City *</label>
                    <input
                      type="text"
                      className={`w-full p-3 border rounded-lg ${!shippingAddress.city ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="Enter city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                    />
                    {!shippingAddress.city && <p className="text-red-500 text-xs mt-1">City is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">State</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Enter state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">PIN Code</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Enter PIN code"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Country</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-800">💳 Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">💵 Cash on Delivery (COD)</div>
                      <div className="text-sm text-gray-600">Pay when your order arrives</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">🏦 Online Payment</div>
                      <div className="text-sm text-gray-600">UPI, Credit/Debit Card, Net Banking</div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">📋 Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Items ({cartItems.length}):</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>₹{tax.toFixed(0)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-teal-600">₹{total.toFixed(0)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full text-white py-4 text-lg font-semibold" 
                style={{backgroundColor: 'lab(52.12% 47.1194 27.3658)'}}
                onClick={placeOrder}
                disabled={processing || !shippingAddress.street || !shippingAddress.city}
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Order...
                  </span>
                ) : (
                  `🛒 Place Order - ₹${total.toFixed(0)}`
                )}
              </Button>
              
              {(!shippingAddress.street || !shippingAddress.city) && (
                <p className="text-red-500 text-sm text-center">Please fill in required address fields to continue</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Bill Modal */}
      {showBill && bill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl m-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Bill</h2>
              <div className="flex gap-2">
                <Button onClick={() => window.print()}>
                  <Download className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={() => setShowBill(false)}>
                  Close
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-8 border rounded">
              {orderSuccess && (
                <div className="text-center mb-6">
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <strong>🎉 Order Placed Successfully!</strong>
                    <p className="text-sm mt-1">Thank you for your purchase. Your order has been confirmed and will be processed soon.</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-teal-600">{bill.company.name}</h1>
                  <p>{bill.company.address}</p>
                  <p>{bill.company.city}</p>
                  <p>{bill.company.phone}</p>
                  <p>{bill.company.email}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p><strong>Order #:</strong> {bill.orderNumber}</p>
                  <p><strong>Invoice #:</strong> {bill.invoiceNumber}</p>
                  <p><strong>Date:</strong> {new Date(bill.date).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> <span className="text-green-600 font-semibold">{bill.status}</span></p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
                <p><strong>{bill.customer.name}</strong></p>
                <p>{bill.customer.email}</p>
                {bill.customer.address && (
                  <>
                    <p>{bill.customer.address.street}</p>
                    <p>{bill.customer.address.city}, {bill.customer.address.state}</p>
                    <p>{bill.customer.address.zipCode}</p>
                  </>
                )}
              </div>
              
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left p-2">Item</th>
                    <th className="text-right p-2">Qty</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="text-right p-2">{item.quantity}</td>
                      <td className="text-right p-2">₹{item.price.toFixed(2)}</td>
                      <td className="text-right p-2">₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-1">
                    <span>Subtotal:</span>
                    <span>₹{bill.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Tax (10%):</span>
                    <span>₹{bill.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Shipping:</span>
                    <span>{bill.shipping === 0 ? 'FREE' : `₹${bill.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{bill.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
