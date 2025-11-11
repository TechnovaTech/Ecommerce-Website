"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-teal-600">Home</Link> &gt; 
          <Link href="/category/Mobile-Computer-Accessories" className="hover:text-teal-600 ml-1">Mobile and Computer Accessories</Link> &gt; 
          <span className="ml-1">Black iPhone 15 Pro Max Mobile Cover</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Image Section */}
          <div className="bg-white p-8 rounded-lg">
            <div className="relative mb-4">
              <img
                src="/phone-stand.jpg"
                alt="Black iPhone 15 Pro Max Mobile Cover"
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded text-sm">
                For I Phone 15 Pro Max<br/>black
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                "/portable-phone-stand-holder.jpg",
                "/phone-stand.jpg",
                "/hand-chopper.jpg",
                "/kitchen-organizer.png",
                "/muffin-tray.jpg"
              ].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  className="w-full h-16 object-cover rounded border-2 border-gray-200 cursor-pointer hover:border-teal-600"
                />
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white p-8 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">Black iPhone 15 Pro Max Mobile Cover Mobile Accessories</h1>
            
            {/* Price Section */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold" style={{color: 'lab(52.12% 47.1194 27.3658)'}}>₹100</span>
                <span className="text-sm">/Pcs</span>
                <span className="text-lg text-gray-500 line-through">₹300</span>
                <span className="text-lg font-bold text-red-600">(67% Off)</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">GST Applicable: 18%</p>
            </div>

            {/* Product Info */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <p className="text-sm"><strong>SKU :</strong> Black iPhone 15 Pro Max</p>
              <p className="text-sm"><strong>Weight (gms) :</strong> 96</p>
            </div>

            {/* Variations */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Variation :</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: "Black iPhone 14 pro max mobile cover", color: "bg-black" },
                  { name: "Purple iPhone 14 Pro Max Mobile Cover", color: "bg-purple-600" },
                  { name: "Sky Blue iPhone 14 Pro Max Mobile Cover", color: "bg-blue-400" },
                  { name: "Golden iPhone 14 Pro Mobile Cover", color: "bg-yellow-400" },
                  { name: "Dark Green iPhone 14 pro", color: "bg-green-700" },
                  { name: "Golden iPhone 14 Pro Max Mobile Cover", color: "bg-yellow-400" },
                  { name: "Dark Green iPhone 14 pro max mobile cover", color: "bg-green-700" },
                  { name: "Black iPhone 14 pro mobile cover", color: "bg-black" },
                  { name: "Sky Blue iPhone 14 Pro Max Cover", color: "bg-blue-400" },
                  { name: "PurpleI iPhone 15 Pro Max", color: "bg-purple-600" },
                  { name: "Sky Blue iPhone 15 Pro Max", color: "bg-blue-400" },
                  { name: "Golden iPhone 15 Pro Max", color: "bg-yellow-400" }
                ].map((variant, i) => {
                  const images = [
                    "/phone-stand.jpg", "/portable-phone-stand-holder.jpg", "/hand-chopper.jpg", "/kitchen-organizer.png",
                    "/muffin-tray.jpg", "/bathroom-storage.jpg", "/car-bumper-guard.jpg", "/chair-leg-cover.jpg",
                    "/food-storage-bag.jpg", "/gnat-trap.jpg", "/jewelry-box-organizer.jpg", "/magic-stick-toy.jpg"
                  ]
                  return (
                    <div key={i} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 rounded border-2 border-gray-200 overflow-hidden">
                        <img
                          src={images[i]}
                          alt={variant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-center leading-tight">{variant.name}</p>
                    </div>
                  )
                })}
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4 mt-6">
                <Button className="text-white py-3" style={{backgroundColor: 'lab(52.12% 47.1194 27.3658)'}}>
                  🛒 Add To Cart
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white py-3">
                  ⚡ Buy Now
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-red-500 hover:bg-red-600 text-white py-3">
                  🎥 Watch Video
                </Button>
                <Button className="bg-black hover:bg-gray-800 text-white py-3">
                  📥 Download Image
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg mb-8">
          <div className="border-b">
            <div className="flex gap-8 px-8">
              {["Description", "Listing Content", "Reviews (2)"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(/[^a-z]/g, ""))}
                  className={`py-2 px-6 border-2 rounded-full font-medium mr-3 text-sm ${
                    activeTab === tab.toLowerCase().replace(/[^a-z]/g, "")
                      ? "text-white"
                      : "hover:opacity-80"
                  }`}
                  style={{
                    borderColor: 'lab(52.12% 47.1194 27.3658)',
                    backgroundColor: activeTab === tab.toLowerCase().replace(/[^a-z]/g, "") ? 'lab(52.12% 47.1194 27.3658)' : 'transparent',
                    color: activeTab === tab.toLowerCase().replace(/[^a-z]/g, "") ? 'white' : 'lab(52.12% 47.1194 27.3658)'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === "description" && (
              <div className="space-y-4">
                <p>Specially designed for iPhone 15 Pro Max Black. Fully compatible with wireless charging, charge your Phone without taking off your case. Restore the real original feel.</p>
                <p>It doesn't make the phone look bulky at all and provides 360 protection. The slim fit design makes you can easily slide in and out of pockets. Exquisite design makes your phone more fashionable and safe.</p>
                <p>Full Body protection, ultra-light but durable, with raised edges for extra protection on the screen and camera.</p>
                <p>Precisely engineered to fit your phone perfectly. Unique design allows easy access to all buttons, controls and ports without having to remove the case.</p>
                <p>Anti Slip property prevents your phone from slipping out of your hand. Raised edges protect your screen from scratches when placed or put on the table or anywhere.</p>
              </div>
            )}

            {activeTab === "listingcontent" && (
              <div>
                <p>Listing content information will be displayed here.</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <p>Customer reviews will be displayed here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Purple iPhone 13 Pro Max Mobile Cover", price: 100, originalPrice: 300, discount: 67, image: "/portable-phone-stand-holder.jpg" },
              { name: "PurpleI iPhone 15 Pro Mobile Cover", price: 100, originalPrice: 150, discount: 33, image: "/hand-chopper.jpg" },
              { name: "PurpleI iPhone 15 Pro Max Mobile Cover", price: 100, originalPrice: 300, discount: 67, image: "/kitchen-organizer.png" },
              { name: "Purple iPhone 15 Mobile Cover", price: 100, originalPrice: 300, discount: 67, image: "/muffin-tray.jpg" }
            ].map((product, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition cursor-pointer">
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">Mobile and Computer Accessories</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-teal-600">₹{product.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                  </div>
                  <p className="text-xs text-green-600 mb-3">({product.discount}%)</p>
                  <Button className="w-full text-white text-sm" style={{backgroundColor: 'lab(52.12% 47.1194 27.3658)'}}>Add To Cart</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}