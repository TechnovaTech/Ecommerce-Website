"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Edit2, Trash2, X } from "lucide-react"

interface Banner {
  _id?: string
  title: string
  description: string
  image: string
  link: string
  active: boolean
  order: number
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState<Banner>({
    title: '',
    description: '',
    image: '',
    link: '',
    active: true,
    order: 0
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/banners', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setBanners(data)
    } catch (error) {
      console.error('Failed to fetch banners')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const method = editingBanner ? 'PUT' : 'POST'
      const body = editingBanner ? { id: editingBanner._id, ...formData } : formData
      
      const response = await fetch('/api/banners', {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      
      if (response.ok) {
        alert(editingBanner ? 'Banner updated!' : 'Banner created!')
        fetchBanners()
        resetForm()
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to save banner'}`)
      }
    } catch (error) {
      alert('Network error: Failed to save banner')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/banners', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      })
      
      if (response.ok) {
        fetchBanners()
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to delete banner'}`)
      }
    } catch (error) {
      alert('Network error: Failed to delete banner')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingBanner(null)
    setFormData({ title: '', description: '', image: '', link: '', active: true, order: 0 })
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData(banner)
    setShowForm(true)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Hero Banners</h1>
          <p className="text-gray-600">Manage homepage carousel banners</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus size={20} />
          Add Banner
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <Card className="w-full max-w-2xl m-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{editingBanner ? 'Edit' : 'Add'} Banner</h3>
              <Button variant="ghost" onClick={resetForm}><X size={20} /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Banner title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Banner description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image (Optional)</label>
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg or paste image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                  <div className="text-center text-gray-500 text-sm">OR</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          setFormData({ ...formData, image: event.target?.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover rounded border" />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-1 text-xs"
                      onClick={() => setFormData({ ...formData, image: '' })}
                    >
                      Remove Image
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <label className="text-sm">Active</label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingBanner ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <div className="grid gap-4">
          {banners.map((banner) => (
            <div key={banner._id} className="flex items-center gap-4 p-4 border rounded">
              <img src={banner.image || '/placeholder.svg'} alt={banner.title || 'Banner'} className="w-24 h-16 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{banner.title}</h3>
                <p className="text-sm text-gray-600">{banner.description}</p>
                <span className={`text-xs px-2 py-1 rounded ${banner.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {banner.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(banner)}>
                  <Edit2 size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(banner._id!)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}