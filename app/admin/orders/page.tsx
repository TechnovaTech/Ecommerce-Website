"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Eye, Package, Truck, CheckCircle, XCircle, Search, FileText, Download, RefreshCw, AlertTriangle } from "lucide-react"

interface Order {
  _id: string
  orderNumber?: string
  trackingNumber?: string
  userId: string
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
  trackingHistory?: Array<{
    status: string
    timestamp: string
    description: string
  }>
  createdAt: string
  shippingAddress?: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  returnReason?: string
  cancelReason?: string
}

interface InvoiceItem {
  name: string
  quantity: number
  price: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)
  const [invoice, setInvoice] = useState<any>(null)
  const [actionReason, setActionReason] = useState('')
  const [showActionModal, setShowActionModal] = useState(false)
  const [currentAction, setCurrentAction] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, statusFilter, searchTerm])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders?admin=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders')
    }
  }

  const filterOrders = () => {
    let filtered = orders
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, status: newStatus })
      })
      
      if (response.ok) {
        fetchOrders()
        alert('Order status updated successfully')
      }
    } catch (error) {
      alert('Failed to update order status')
    }
  }

  const handleOrderAction = async (orderId: string, action: string) => {
    if (['return_approved', 'return_rejected'].includes(action) && !actionReason) {
      setCurrentAction(action)
      setShowActionModal(true)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          orderId, 
          status: action,
          reason: actionReason
        })
      })
      
      if (response.ok) {
        fetchOrders()
        setShowActionModal(false)
        setActionReason('')
        alert('Order action completed successfully')
      }
    } catch (error) {
      alert('Failed to process order action')
    }
  }

  const generateInvoice = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`)
      const invoiceData = await response.json()
      setInvoice(invoiceData)
      setShowInvoice(true)
    } catch (error) {
      alert('Failed to generate invoice')
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="return_requested">Return Requested</SelectItem>
              <SelectItem value="return_approved">Return Approved</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Order #</th>
                <th className="text-left p-4">Tracking #</th>
                <th className="text-left p-4">Items</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-mono text-sm">
                    {order.orderNumber || order._id.slice(-8)}
                  </td>
                  <td className="p-4 font-mono text-xs text-gray-600">
                    {order.trackingNumber || 'N/A'}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      {order.items.slice(0, 2).map((item, index) => (
                        <span key={index} className="text-sm">
                          {item.name} x{item.quantity}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{order.items.length - 2} more items
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-semibold">${order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(order.status)}
                      {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                    </Badge>
                    {order.status === 'return_requested' && (
                      <div className="mt-1 flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleOrderAction(order._id, 'return_approved')}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleOrderAction(order._id, 'return_rejected')}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowDetails(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateInvoice(order._id)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order._id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-6xl m-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                <h3 className="font-semibold mb-2">Payment Details</h3>
                <p><strong>Subtotal:</strong> ${selectedOrder.subtotal?.toFixed(2)}</p>
                <p><strong>Tax:</strong> ${selectedOrder.tax?.toFixed(2)}</p>
                <p><strong>Shipping:</strong> ${selectedOrder.shipping?.toFixed(2)}</p>
                <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
              </div>
              
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p><strong>Name:</strong> {selectedOrder.shippingAddress.name || 'Not provided'}</p>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                  <p>{selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              )}
            </div>

            {/* Tracking History */}
            {selectedOrder.trackingHistory && (
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Tracking History</h3>
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
            )}
            
            <div className="mt-6">
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

            {(selectedOrder.returnReason || selectedOrder.cancelReason) && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-800">
                    {selectedOrder.returnReason ? 'Return Reason' : 'Cancellation Reason'}
                  </h4>
                </div>
                <p className="text-yellow-700">{selectedOrder.returnReason || selectedOrder.cancelReason}</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              {currentAction === 'return_approved' ? 'Approve Return' : 'Reject Return'}
            </h3>
            <Textarea
              placeholder="Enter reason for this action..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={() => handleOrderAction(selectedOrder?._id || '', currentAction)}>
                Confirm
              </Button>
              <Button variant="outline" onClick={() => setShowActionModal(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && invoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl m-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Invoice</h2>
              <div className="flex gap-2">
                <Button onClick={() => window.print()}>
                  <Download className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={() => setShowInvoice(false)}>
                  Close
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-8 border rounded">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-blue-600">{invoice?.company?.name}</h1>
                  <p>{invoice?.company?.address}</p>
                  <p>{invoice?.company?.city}</p>
                  <p>{invoice?.company?.phone}</p>
                  <p>{invoice?.company?.email}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p><strong>Invoice #:</strong> {invoice?.invoiceNumber}</p>
                  <p><strong>Order #:</strong> {invoice?.orderNumber}</p>
                  <p><strong>Date:</strong> {new Date(invoice?.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
                <p><strong>{invoice.customer.name}</strong></p>
                <p>{invoice.customer.email}</p>
                <p>{invoice.customer.address.street}</p>
                <p>{invoice.customer.address.city}, {invoice.customer.address.state}</p>
                <p>{invoice.customer.address.zipCode}</p>
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
                  {invoice.items.map((item: InvoiceItem, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="text-right p-2">{item.quantity}</td>
                      <td className="text-right p-2">${item.price.toFixed(2)}</td>
                      <td className="text-right p-2">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-1">
                    <span>Subtotal:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Tax:</span>
                    <span>${invoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Shipping:</span>
                    <span>${invoice.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 font-bold text-lg">
                    <span>Total:</span>
                    <span>${invoice.total.toFixed(2)}</span>
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