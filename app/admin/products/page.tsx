"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Edit2, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Product {
  _id?: string
  name: string
  price: number | string
  stock: number | string
  minStock: number | string
  category: string
  subcategory: string
  discount: number | string
  description: string
  images: string[]
  status: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [filteredSubcategories, setFilteredSubcategories] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Product>({
    name: '',
    price: '',
    stock: '',
    minStock: '',
    category: '',
    subcategory: '',
    discount: '',
    description: '',
    images: [],
    status: 'in-stock'
  })
  const [originalPrice, setOriginalPrice] = useState<number>(0)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchSubcategories()
  }, [])

  useEffect(() => {
    if (formData.category && subcategories.length > 0) {
      const filtered = subcategories.filter(sub => sub.parentCategory === formData.category)
      setFilteredSubcategories(filtered)
    }
  }, [subcategories, formData.category])

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

  const fetchSubcategories = async () => {
    try {
      const response = await fetch('/api/subcategories')
      const data = await response.json()
      setSubcategories(data)
    } catch (error) {
      console.error('Failed to fetch subcategories')
    }
  }

  const handleCategoryChange = (categoryName: string) => {
    console.log('Selected category:', categoryName)
    console.log('All subcategories:', subcategories)
    setFormData({ ...formData, category: categoryName, subcategory: '' })
    const filtered = subcategories.filter(sub => {
      console.log('Checking subcategory:', sub.name, 'Parent:', sub.parentCategory, 'Match:', sub.parentCategory === categoryName)
      return sub.parentCategory === categoryName
    })
    console.log('Filtered subcategories for', categoryName, ':', filtered)
    setFilteredSubcategories(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingProduct ? 'PUT' : 'POST'
      const body = editingProduct ? { id: editingProduct._id, ...formData } : formData
      
      const response = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!')
        fetchProducts()
        setShowForm(false)
        setEditingProduct(null)
        setOriginalPrice(0)
        setFormData({
          name: '', price: '', stock: '', minStock: '', category: '', subcategory: '',
          discount: '', description: '', images: [], status: 'in-stock'
        })
      } else {
        alert('Error: ' + (result.error || 'Failed to save product'))
      }
    } catch (error) {
      alert('Network error: Failed to save product')
      console.error('Failed to save product', error)
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
    const discount = Number(product.discount) || 0
    const calculatedOriginal = discount > 0 ? Math.round(Number(product.price) / (1 - discount / 100)) : Number(product.price)
    setOriginalPrice(calculatedOriginal)
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      category: product.category,
      subcategory: product.subcategory || '',
      discount: product.discount,
      description: product.description,
      images: product.images || [],
      status: product.status
    })
    const filtered = subcategories.filter(sub => sub.parentCategory === product.category)
    setFilteredSubcategories(filtered)
    setShowForm(true)
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
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button onClick={() => {
            setEditingProduct(null)
            setOriginalPrice(0)
            setFormData({
              name: '', price: 0, stock: 0, minStock: 0, category: '', subcategory: '',
              discount: 0, description: '', images: [], status: 'in-stock'
            })
            setShowForm(true)
          }} className="flex items-center gap-2">
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
                  <Button type="button" variant="ghost" onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                    setOriginalPrice(0)
                    setFormData({
                      name: '', price: 0, stock: 0, minStock: 0, category: '', subcategory: '',
                      discount: 0, description: '', images: [], status: 'in-stock'
                    })
                  }}>✕</Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
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
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subcategory</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        disabled={!formData.category}
                      >
                        <option value="">Select Subcategory</option>
                        {filteredSubcategories.map((subcategory) => (
                          <option key={subcategory._id} value={subcategory.name}>
                            {subcategory.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Original Price (₹)</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={originalPrice}
                        onChange={(e) => {
                          const orig = Number(e.target.value)
                          setOriginalPrice(orig)
                          const discount = Number(formData.discount) || 0
                          const finalPrice = orig * (1 - discount / 100)
                          setFormData({ ...formData, price: Math.round(finalPrice) })
                        }}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Your base price</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Discount %</label>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="99"
                        value={formData.discount}
                        onChange={(e) => {
                          const discount = Number(e.target.value)
                          setFormData({ ...formData, discount })
                          if (originalPrice > 0) {
                            const finalPrice = originalPrice * (1 - discount / 100)
                            setFormData(prev => ({ ...prev, price: Math.round(finalPrice), discount }))
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Discount percentage</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Final Price (₹)</label>
                      <Input
                        type="number"
                        value={formData.price}
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-green-600 mt-1">Auto-calculated</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Min Stock</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.minStock}
                        onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                        required
                      />
                    </div>
                    {originalPrice > 0 && Number(formData.discount) > 0 && (
                      <div className="col-span-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">Price Calculation:</p>
                          <p className="text-sm text-blue-700">
                            ₹{originalPrice} - {formData.discount}% = ₹{formData.price} 
                            <span className="text-green-600 ml-2">(Save ₹{originalPrice - Number(formData.price)})</span>
                          </p>
                        </div>
                      </div>
                    )}
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
                    <label className="block text-sm font-medium mb-2">Images (Max 5)</label>
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

                  <div className="flex gap-2">
                    <Button type="submit">{editingProduct ? 'Update' : 'Create'} Product</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </form>
              </div>
            </Card>
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
                  <th className="text-left py-3">Subcategory</th>
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
                    <td className="py-3">{product.subcategory || '-'}</td>
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
    </div>
  )
}