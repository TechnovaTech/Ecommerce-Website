import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DealsPage() {
  const deals = Array.from({ length: 12 }, (_, i) => ({
    id: `deal-${i}`,
    name: `Hot Deal Product ${i + 1}`,
    price: Math.floor(Math.random() * 300) + 100,
    originalPrice: Math.floor(Math.random() * 800) + 400,
    discount: Math.floor(Math.random() * 50) + 20,
    image: `/placeholder.svg?height=200&width=200&query=deal product ${i}`,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Top Deals Today</h1>
        <p className="text-gray-600 mb-8">Get amazing discounts on your favorite products</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <Link key={deal.id} href={`/product/${deal.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer h-full">
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={deal.image || "/placeholder.svg"}
                    alt={deal.name}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white font-bold px-2 py-1 rounded">
                    {deal.discount}% OFF
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">{deal.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-teal-600">₹{deal.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{deal.originalPrice}</span>
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
