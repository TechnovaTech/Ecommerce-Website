import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Flame } from "lucide-react"

export default function HotSellingPage() {
  const hotProducts = Array.from({ length: 12 }, (_, i) => ({
    id: `hot-${i}`,
    name: `Trending Product ${i + 1}`,
    price: Math.floor(Math.random() * 400) + 100,
    originalPrice: Math.floor(Math.random() * 900) + 300,
    image: `/placeholder.svg?height=200&width=200&query=trending hot selling product ${i}`,
    sold: Math.floor(Math.random() * 500) + 100,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-2">
          <Flame size={32} className="text-red-500" />
          <h1 className="text-3xl font-bold">Hot Selling Products</h1>
        </div>
        <p className="text-gray-600 mb-8">Best sellers loved by our customers</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hotProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {product.sold} sold
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-teal-600">₹{product.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                  </div>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm">Add to Cart</Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
