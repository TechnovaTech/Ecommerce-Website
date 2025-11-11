"use client"

import { useState, useEffect } from "react"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Edit2, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Product {
  _id?: string
  name: string
  price: number
  stock: number
  minStock: number
  category: string
  discount: number
  description: string
  images: string[]
  status: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [formData, setFormData] = useState<Product>({
    name: '',
    price: 0,
    stock: 0,
    minStock: 0,
    category: '',
    discount: 0,
    description: '',
    images: [],
    status: 'in-stock'
  })

  const availableImages = [
    '/phone-stand.jpg', '/portable-phone-stand-holder.jpg', '/hand-chopper.jpg',
    '/kitchen-organizer.png', '/muffin-tray.jpg', '/bathroom-storage.jpg',
    '/car-bumper-guard.jpg', '/chair-leg-cover.jpg', '/food-storage-bag.jpg',
    '/gnat-trap.jpg', '/jewelry-box-organizer.jpg', '/magic-stick-toy.jpg',
    '/baby-knee-pad.jpg', '/bathroom-storage-organizer-box.jpg'
  ]

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products')
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingProduct ? 'PUT' : 'POST'
      const body = editingProduct ? { ...formData, id: editingProduct._id } : formData
      
      await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      fetchProducts()
      setShowForm(false)
      setEditingProduct(null)
      setFormData({
        name: '', price: 0, stock: 0, minStock: 0, category: '',
        discount: 0, description: '', images: [], status: 'in-stock'
      })
    } catch (error) {
      console.error('Failed to save product')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      fetchProducts()
    } catch (error) {
      console.error('Failed to delete product')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      category: product.category,
      discount: product.discount,
      description: product.description,
      images: product.images || [],
      status: product.status
    })
    setShowForm(true)
  }

  const selectImage = (image: string) => {
    if (formData.images.length < 5 && !formData.images.includes(image)) {
      setFormData({ ...formData, images: [...formData.images, image] })
    }
  }

  const removeImage = (image: string) => {
    setFormData({ ...formData, images: formData.images.filter(img => img !== image) })
  }

  const getStatus = (product: Product) => {
    if (product.stock === 0) return 'out-of-stock'
    if (product.stock <= product.minStock) return 'low-stock'
    return 'in-stock'
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Products</h1>
                <p className="text-muted-foreground">Manage your product inventory</p>
              </div>
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <Plus size={20} />
                Add Product
              </Button>
            </div>

            {showForm && (
              <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: '#0000007d'}}>
                <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto m-4 shadow-2xl">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                      <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>✕</Button>
                    </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price</label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock</label>
                      <Input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Min Stock</label>
                      <Input
                        type="number"
                        value={formData.minStock}
                        onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Discount %</label>
                      <Input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Images</label>
                    <div className="flex gap-2 mb-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img src={img} alt="" className="w-16 h-16 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeImage(img)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          files.forEach(file => {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const imageUrl = event.target?.result as string
                              if (formData.images.length < 5 && !formData.images.includes(imageUrl)) {
                                setFormData({ ...formData, images: [...formData.images, imageUrl] })
                              }
                            }
                            reader.readAsDataURL(file)
                          })
                        }}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button type="button" onClick={() => document.getElementById('file-upload')?.click()} variant="outline">
                        Upload Images
                      </Button>
                    </div>
                  </div>

                    <div className="flex gap-2">
                      <Button type="submit">{editingProduct ? 'Update' : 'Create'} Product</Button>
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                    </div>
                  </form>
                  </div>
                </Card>
              </div>
            )}

            {showImageGallery && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-4xl max-h-96 overflow-auto">
                  <h3 className="text-lg font-bold mb-4">Select Images</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {availableImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`cursor-pointer border-2 rounded ${formData.images.includes(img) ? 'border-blue-500' : 'border-gray-200'}`}
                        onClick={() => selectImage(img)}
                      >
                        <img src={img} alt="" className="w-full h-20 object-cover rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => setShowImageGallery(false)}>Done</Button>
                  </div>
                </div>
              </div>
            )}

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Image</th>
                      <th className="text-left py-3">Name</th>
                      <th className="text-left py-3">Category</th>
                      <th className="text-left py-3">Price</th>
                      <th className="text-left py-3">Stock</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b">
                        <td className="py-3">
                          <img src={product.images[0] || '/placeholder.svg'} alt="" className="w-12 h-12 object-cover rounded" />
                        </td>
                        <td className="py-3 font-medium">{product.name}</td>
                        <td className="py-3">{product.category}</td>
                        <td className="py-3">₹{product.price}</td>
                        <td className="py-3">{product.stock}</td>
                        <td className="py-3">
                          <Badge variant={getStatus(product) === 'in-stock' ? 'default' : 'destructive'}>
                            {getStatus(product).replace('-', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(product._id!)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}