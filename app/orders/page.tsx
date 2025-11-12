"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Eye, Package, Truck, CheckCircle, XCircle, RefreshCw, FileText, Download } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface Order {
  _id: string
  orderNumber: string
  trackingNumber: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
    image?: string
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: string
  paymentStatus: string
  trackingHistory: Array<{
    status: string
    timestamp: string
    description: string
  }>
  createdAt: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [returnReason, setReturnReason] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingResult, setTrackingResult] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders')
    }
  }

  const trackOrder = async () => {
    if (!trackingNumber) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/orders?trackingNumber=${trackingNumber}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.length > 0) {
        setTrackingResult(data[0])
      } else {
        alert('Order not found with this tracking number')
      }
    } catch (error) {
      alert('Failed to track order')
    }
  }

  const cancelOrder = async () => {
    if (!selectedOrder || !cancelReason) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          action: 'cancel',
          reason: cancelReason
        })
      })

      if (response.ok) {
        fetchOrders()
        setShowCancelModal(false)
        setCancelReason('')
        alert('Order cancelled successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to cancel order')
      }
    } catch (error) {
      alert('Failed to cancel order')
    }
  }

  const requestReturn = async () => {
    if (!selectedOrder || !returnReason) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          action: 'return',
          reason: returnReason
        })
      })

      if (response.ok) {
        fetchOrders()
        setShowReturnModal(false)
        setReturnReason('')
        alert('Return request submitted successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to request return')
      }
    } catch (error) {
      alert('Failed to request return')
    }
  }

  const downloadInvoice = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`)
      const invoice = await response.json()
      
      // Create a simple invoice HTML and trigger download
      const invoiceHtml = `
        <html>
          <head><title>Invoice - ${invoice.invoiceNumber}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>${invoice.company.name}</h1>
            <h2>Invoice: ${invoice.invoiceNumber}</h2>
            <p>Order: ${invoice.orderNumber}</p>
            <p>Date: ${new Date(invoice.date).toLocaleDateString()}</p>
            <hr>
            <h3>Bill To:</h3>
            <p>${invoice.customer.name}<br>
            ${invoice.customer.address.street}<br>
            ${invoice.customer.address.city}, ${invoice.customer.address.state} ${invoice.customer.address.zipCode}</p>
            <hr>
            <table border="1" style="width: 100%; border-collapse: collapse;">
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
              ${invoice.items.map((item: any) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </table>
            <hr>
            <p><strong>Subtotal: $${invoice.subtotal.toFixed(2)}</strong></p>
            <p><strong>Tax: $${invoice.tax.toFixed(2)}</strong></p>
            <p><strong>Shipping: $${invoice.shipping.toFixed(2)}</strong></p>
            <p><strong>Total: $${invoice.total.toFixed(2)}</strong></p>
          </body>
        </html>
      `
      
      const blob = new Blob([invoiceHtml], { type: 'text/html' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoice.orderNumber}.html`
      a.click()
    } catch (error) {
      alert('Failed to download invoice')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-orange-100 text-orange-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'return_requested': 'bg-amber-100 text-amber-800',
      'return_approved': 'bg-teal-100 text-teal-800',
      'return_rejected': 'bg-rose-100 text-rose-800',
      'refunded': 'bg-indigo-100 text-indigo-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Package className="w-4 h-4" />
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'processing': return <Package className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      case 'return_requested': return <RefreshCw className="w-4 h-4" />
      case 'return_approved': return <CheckCircle className="w-4 h-4" />
      case 'return_rejected': return <XCircle className="w-4 h-4" />
      case 'refunded': return <CheckCircle className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const canCancelOrder = (status: string) => {
    return ['pending', 'confirmed'].includes(status)
  }

  const canReturnOrder = (status: string) => {
    return status === 'delivered'
  }

  return (
    <div className="min-h-screen mt-12 bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">My Orders</h1>
        
        {/* Order Tracking */}
        <Card className="p-6 mb-6 bg-white shadow-sm border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Track Your Order</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1"
            />
            <Button onClick={trackOrder} className="bg-teal-600 hover:bg-teal-700 text-white" suppressHydrationWarning>Track Order</Button>
          </div>
          
          {trackingResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-semibold">Order Found: {trackingResult.orderNumber}</h3>
              <Badge className={`${getStatusColor(trackingResult.status)} mt-2`}>
                {getStatusIcon(trackingResult.status)}
                {trackingResult.status.replace('_', ' ').charAt(0).toUpperCase() + trackingResult.status.replace('_', ' ').slice(1)}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={() => {
                  setSelectedOrder(trackingResult)
                  setShowDetails(true)
                }}
              >
                View Details
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order._id} className="p-6 bg-white shadow-sm border hover:shadow-lg hover:border-teal-300 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Tracking: {order.trackingNumber}</p>
              </div>
              <div className="text-right">
                <Badge className={`${getStatusColor(order.status)} mb-2`}>
                  {getStatusIcon(order.status)}
                  {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                </Badge>
                <p className="text-lg font-semibold text-teal-600">₹{order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {order.items.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="flex items-center justify-center text-gray-500">
                  +{order.items.length - 4} more items
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="border-teal-200 text-teal-700 hover:bg-teal-100 hover:border-teal-400 hover:text-teal-800"
                onClick={() => {
                  setSelectedOrder(order)
                  setShowDetails(true)
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-gray-100 hover:border-gray-400"
                onClick={() => downloadInvoice(order._id)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Invoice
              </Button>

              {canCancelOrder(order.status) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                  onClick={() => {
                    setSelectedOrder(order)
                    setShowCancelModal(true)
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              )}

              {canReturnOrder(order.status) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                  onClick={() => {
                    setSelectedOrder(order)
                    setShowReturnModal(true)
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Return Order
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: '#000000a8'}}>
          <Card className="w-full max-w-4xl m-4 mt-8 p-6 max-h-[85vh] overflow-y-auto scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Order Information</h3>
                <p><strong>Order #:</strong> {selectedOrder.orderNumber}</p>
                <p><strong>Tracking #:</strong> {selectedOrder.trackingNumber}</p>
                <p><strong>Status:</strong> 
                  <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.replace('_', ' ').charAt(0).toUpperCase() + selectedOrder.status.replace('_', ' ').slice(1)}
                  </Badge>
                </p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                <p>{selectedOrder.shippingAddress.zipCode}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Tracking History */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Order Tracking</h3>
              <div className="space-y-3">
                {selectedOrder.trackingHistory.map((track, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">{track.status}</p>
                      <p className="text-sm text-gray-600">{track.description}</p>
                      <p className="text-xs text-gray-500">{new Date(track.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-1">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Tax:</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Shipping:</span>
                    <span>${selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t font-bold text-lg">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: '#000000a8'}}>
          <Card className="w-full max-w-md m-4 mt-8 p-6">
            <h3 className="text-lg font-semibold mb-4">Cancel Order</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for cancelling this order:
            </p>
            <Textarea
              placeholder="Enter cancellation reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={cancelOrder} variant="destructive">
                Cancel Order
              </Button>
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                Keep Order
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Return Order Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: '#000000a8'}}>
          <Card className="w-full max-w-md m-4 mt-8 p-6">
            <h3 className="text-lg font-semibold mb-4">Request Return</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for returning this order:
            </p>
            <Textarea
              placeholder="Enter return reason..."
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={requestReturn}>
                Request Return
              </Button>
              <Button variant="outline" onClick={() => setShowReturnModal(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
      </div>
      <Footer />
    </div>
  )
}