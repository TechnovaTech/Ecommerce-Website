"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2 } from "lucide-react"

interface Category {
  _id?: string
  name: string
  status: string
  products?: number
  subcategories?: string[]
}

interface SubCategory {
  _id?: string
  name: string
  parentCategory: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<Category>({
    name: '',
    status: 'active',
    subcategories: []
  })
  const [showSubForm, setShowSubForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [subCategoryName, setSubCategoryName] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(Array.isArray(data) ? data : [])
      } else {
        setCategories([])
      }
      
      const subResponse = await fetch('/api/subcategories')
      if (subResponse.ok) {
        const subData = await subResponse.json()
        setSubcategories(Array.isArray(subData) ? subData : [])
      } else {
        setSubcategories([])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setCategories([])
      setSubcategories([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingCategory ? 'PUT' : 'POST'
      const body = editingCategory ? { ...formData, id: editingCategory._id } : formData
      
      await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      fetchCategories()
      setShowForm(false)
      setEditingCategory(null)
      setFormData({ name: '', status: 'active', subcategories: [] })
    } catch (error) {
      console.error('Failed to save category')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      fetchCategories()
    } catch (error) {
      console.error('Failed to delete category')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData(category)
    setShowForm(true)
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
                <h1 className="text-3xl font-bold text-foreground">Categories</h1>
                <p className="text-muted-foreground">Manage product categories</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                  <Plus size={20} />
                  Add Category
                </Button>
                <Button onClick={() => setShowSubForm(true)} variant="outline" className="flex items-center gap-2">
                  <Plus size={20} />
                  Add Subcategory
                </Button>
              </div>
            </div>

            {showForm && (
              <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: '#0000007d'}}>
                <Card className="w-full max-w-md p-6">
                  <h3 className="text-xl font-bold mb-4">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">{editingCategory ? 'Update' : 'Create'} Category</Button>
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </Card>
              </div>
            )}

            {showSubForm && (
              <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: '#0000007d'}}>
                <Card className="w-full max-w-md p-6">
                  <h3 className="text-xl font-bold mb-4">Add Subcategory</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    try {
                      await fetch('/api/subcategories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: subCategoryName, parentCategory: selectedCategory })
                      })
                      fetchCategories()
                      setShowSubForm(false)
                      setSubCategoryName('')
                      setSelectedCategory('')
                    } catch (error) {
                      console.error('Failed to save subcategory')
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Parent Category</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subcategory Name</label>
                      <Input
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Create Subcategory</Button>
                      <Button type="button" variant="outline" onClick={() => setShowSubForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </Card>
              </div>
            )}

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Name</th>
                      <th className="text-left py-3">Subcategories</th>
                      <th className="text-left py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category._id} className="border-b">
                        <td className="py-3 font-medium">{category.name}</td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {subcategories
                              .filter(sub => sub.parentCategory === category._id)
                              .map(sub => (
                                <span key={sub._id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                  {sub.name}
                                </span>
                              ))
                            }
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(category)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(category._id!)} className="p-2 text-red-600 hover:bg-red-50 rounded">
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