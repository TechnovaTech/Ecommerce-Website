"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Package, Plus, Minus, Search, Download, Upload } from "lucide-react"

interface Product {
  _id: string
  name: string
  stock: number
  price: number
  category: string
  sku?: string
}

interface StockMovement {
  _id: string
  productId: string
  productName: string
  previousStock: number
  newStock: number
  quantity: number
  action: string
  reason: string
  timestamp: string
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showStockModal, setShowStockModal] = useState(false)
  const [stockAction, setStockAction] = useState('add')
  const [stockQuantity, setStockQuantity] = useState('')
  const [stockReason, setStockReason] = useState('')
  const [showMovements, setShowMovements] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchStockMovements()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, filterType])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/inventory', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products')
    }
  }

  const fetchStockMovements = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/inventory/movements', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setStockMovements(data)
      }
    } catch (error) {
      console.error('Failed to fetch stock movements')
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (filterType === 'low') {
      filtered = filtered.filter(product => product.stock <= 10)
    } else if (filterType === 'out') {
      filtered = filtered.filter(product => product.stock === 0)
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const updateStock = async () => {
    if (!selectedProduct || !stockQuantity) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: selectedProduct._id,
          action: stockAction,
          quantity: parseInt(stockQuantity),
          reason: stockReason
        })
      })

      if (response.ok) {
        fetchProducts()
        fetchStockMovements()
        setShowStockModal(false)
        setStockQuantity('')
        setStockReason('')
        alert('Stock updated successfully')
      }
    } catch (error) {
      alert('Failed to update stock')
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (stock <= 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' }
  }

  const exportInventory = () => {
    const csvContent = [
      ['Product Name', 'SKU', 'Stock', 'Price', 'Category', 'Status'],
      ...filteredProducts.map(product => [
        product.name,
        product.sku || '',
        product.stock,
        product.price,
        product.category,
        getStockStatus(product.stock).label
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'inventory-report.csv'
    a.click()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">Manage product stock levels and track movements</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportInventory} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowMovements(!showMovements)} variant="outline">
            <Package className="w-4 h-4 mr-2" />
            {showMovements ? 'Hide' : 'Show'} Movements
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold">{products.filter(p => p.stock <= 10 && p.stock > 0).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold">{products.filter(p => p.stock === 0).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Total Stock Value</p>
              <p className="text-2xl font-bold">${products.reduce((sum, p) => sum + (p.stock * p.price), 0).toFixed(0)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Product Inventory</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Stock</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product.stock)
                  return (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.sku}</p>
                          <p className="text-sm text-gray-600">${product.price}</p>
                        </div>
                      </td>
                      <td className="p-2">
                        <span className="text-lg font-semibold">{product.stock}</span>
                      </td>
                      <td className="p-2">
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedProduct(product)
                              setStockAction('add')
                              setShowStockModal(true)
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedProduct(product)
                              setStockAction('subtract')
                              setShowStockModal(true)
                            }}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {showMovements && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Stock Movements</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stockMovements.slice(0, 20).map((movement) => (
                <div key={movement._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{movement.productName}</p>
                    <p className="text-sm text-gray-600">{movement.reason}</p>
                    <p className="text-xs text-gray-500">{new Date(movement.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </p>
                    <p className="text-sm text-gray-600">{movement.previousStock} → {movement.newStock}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Stock Update Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4 p-6">
            <h3 className="text-lg font-semibold mb-4">
              {stockAction === 'add' ? 'Add Stock' : 'Remove Stock'} - {selectedProduct.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Stock</label>
                <p className="text-2xl font-bold">{selectedProduct.stock}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reason</label>
                <Textarea
                  placeholder="Enter reason for stock adjustment"
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={updateStock} className="flex-1">
                  {stockAction === 'add' ? 'Add Stock' : 'Remove Stock'}
                </Button>
                <Button variant="outline" onClick={() => setShowStockModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}