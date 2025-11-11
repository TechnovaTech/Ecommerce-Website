import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: string
  image: string
  rating?: number
  reviews?: number
}

const mockProducts: Record<string, Product[]> = {
  "home-kitchen": [
    {
      id: "1",
      name: "Silicon Bag Food Storage Bag Kitchenware",
      price: 299,
      originalPrice: 599,
      image: "/food-storage-bag.jpg",
      rating: 4.5,
      reviews: 128,
    },
    {
      id: "2",
      name: "12 Cup Muffin Tray Cup Cake Pan",
      price: 199,
      originalPrice: 499,
      image: "/muffin-tray-baking-pan.jpg",
      rating: 4.3,
      reviews: 95,
    },
    {
      id: "3",
      name: "Gnat Trap Catcher Fruit Home & Kitchen",
      price: 149,
      image: "/gnat-trap-insect-catcher.jpg",
      rating: 4,
      reviews: 42,
    },
    {
      id: "4",
      name: "Push Chopper Hand Press Chopper",
      price: 249,
      originalPrice: 599,
      image: "/hand-chopper-food-processor.jpg",
      rating: 4.6,
      reviews: 156,
    },
  ],
  "top-deals": [
    {
      id: "5",
      name: "Car Bumper Guard 2 Pcs Outdoor",
      price: 449,
      discount: "Min 30% OFF",
      image: "/car-bumper-guard.jpg",
      rating: 4.2,
      reviews: 78,
    },
    {
      id: "6",
      name: "Tumbling Monkey Toys",
      price: 99,
      discount: "Min 50% OFF",
      image: "/tumbling-monkey-toy.jpg",
      rating: 4.4,
      reviews: 203,
    },
    {
      id: "7",
      name: "Magic Stick Toys",
      price: 179,
      discount: "Min 20% OFF",
      image: "/magic-stick-toy.jpg",
      rating: 4.1,
      reviews: 67,
    },
    {
      id: "8",
      name: "Apple Baby Knee Pad Baby Products",
      price: 89,
      discount: "Min 60% OFF",
      image: "/baby-knee-pad-crawling-protection.jpg",
      rating: 4.7,
      reviews: 312,
    },
  ],
  "hot-selling": [
    {
      id: "9",
      name: "Silicone Anti Slip Chair Leg Cover",
      price: 129,
      image: "/chair-leg-protector-furniture-pad.jpg",
      rating: 4.3,
      reviews: 89,
    },
    {
      id: "10",
      name: "Kitchen Organizer Set",
      price: 349,
      image: "/kitchen-organizer-storage.jpg",
      rating: 4.5,
      reviews: 145,
    },
    {
      id: "11",
      name: "Portable Phone Stand",
      price: 199,
      image: "/portable-phone-stand-holder.jpg",
      rating: 4.6,
      reviews: 234,
    },
    {
      id: "12",
      name: "Bathroom Storage Box",
      price: 249,
      image: "/bathroom-storage-organizer-box.jpg",
      rating: 4.2,
      reviews: 112,
    },
  ],
}

interface ProductSectionProps {
  title: string
  category: string
  link: string
}

export default function ProductSection({ title, category, link }: ProductSectionProps) {
  const products = mockProducts[category] || []

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
          </div>
          <Link href={link} className="text-primary hover:text-accent font-semibold text-sm md:text-base transition">
            See All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-xl hover:border-accent transition duration-300 h-full flex flex-col bg-card">
                <div className="relative aspect-square bg-secondary overflow-hidden group">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  {product.discount && (
                    <div className="absolute top-2 right-2 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.discount}
                    </div>
                  )}
                </div>

                <div className="p-3 md:p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">{product.name}</h3>

                  {product.rating && (
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < Math.floor(product.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base md:text-lg font-bold text-primary">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs md:text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-accent text-primary-foreground text-xs md:text-sm mt-auto flex items-center gap-2 justify-center"
                    suppressHydrationWarning
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
