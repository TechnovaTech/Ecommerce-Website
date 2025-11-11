import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"

export default function ChinaProductsPage() {
  const categoryProducts = Array.from({ length: 12 }, (_, i) => ({
    id: `china-products-${i}`,
    name: `China Product ${i + 1}`,
    price: Math.floor(Math.random() * 500) + 100,
    originalPrice: Math.floor(Math.random() * 800) + 300,
    image: `/placeholder.svg?height=200&width=200&query=china product ${i}`,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="relative h-96 mt-20">
        <img
          src="/hero-banner-for-online-shopping-mall.jpg"
          alt="China Products Banner"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">China Products</h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold mb-3">1. Wholesale China Products</h2>
              <p>International trade is the best option for all businesses to broaden their reach and get access to a diverse range of products at affordable rates. Therefore, lots of eCommerce business owners are now showing interest in the import export business. China is one of the most famous places in this world from where millions of eCommerce business owners are importing different varieties of wholesale products for their business. China is the first preference of all business owners for importing products. Almost all business owners now prefer wholesale China products for their businesses.</p>
              <p className="mt-4">Wholesale China products in India have been in demand for so long. With the increased demand for wholesale China products in India, a rapid rise in the number of China products importers has also been seen in India. If you want best-quality wholesale China products to expand your eCommerce business, you need to carefully find out the most trusted China product wholesaler who can satisfy your business needs by providing genuine wholesale products.</p>
              <p className="mt-4">If you are in search of an expert China products importer in India, your search ends at Shukan Mall. We are the best import export company in India, helping all entrepreneurs import from China to India successfully. No matter if you are an individual or running a large ecommerce company, you can connect Shukan Mall without any hesitation to successfully complete the product sourcing from China to India at competitive price. Contact us today if you need any help regarding importing items from China to India.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">2. Expand Your Online Business with the Finest-quality Wholesale China Products in India Offered by Leading Importer</h2>
              <p>China is the most favoured country to all importers and entrepreneurs around the globe for importing wholesale goods. As China produces all varieties of products at the cheapest price ranges and finest-quality, there is a global demand for wholesale China products in India. China's vast and exceptional manufacturing capacity, and the affordable price rates of all types of products make it the best source for wholesale products.</p>
              <p className="mt-4">China has been the best importing partner of India from the past decades. As Indian entrepreneurs have started to explore international trade opportunities, product sourcing from China to India remains the most profitable option for all business owners. Business owners frequently import from China to India a broad variety of wholesale China products like electronics goods, home and kitchen products, toys and games, organic chemicals, machinery and many more.</p>
              <p className="mt-4">Several China products importers are now available in India who assist all businesses to source wholesale products from China. By partnering with the most reliable China product importer in India, business owners can get a wide array of top-quality wholesale China products at competitive costs, gain strong business support and import guidance, customization options and many more benefits. But finding the most trustworthy importer of China products in India is an immensely challenging task as the numbers of importers are huge in the market.</p>
              <p className="mt-4">Shukan Mall is India's leading China products importer. We give access to any business owner to import different types of Chinese products from China to any state and city in India. With our streamlined import procedures, and top-quality Chinese products, entrepreneurs in India can run a highly successful and well-known business in the market, achieve a huge reputation in the business sector and achieve success in the import-export business sector. You can get wholesale China products from us for different purposes such as for your eCommerce business, for dropshipping business and for corporate gifting as well.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Reasons to Choose Shukan Mall for Product Sourcing from China to India</h2>
              <p className="mb-4">You might wonder why Shukan Mall is regarded as the best import export company in India and why you should choose us for importing products from China. Let us now tell you the key reasons to choose us as your importing partner in India.</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">1. Access to A Diverse Range of Products</h3>
                  <p className="text-sm">One of the key reasons to choose us as your importing partner is that you can easily get access to a diverse product range from Shukan Mall. From mobile and computer accessories, toys and games, to home and kitchen products, bags, a vast range of wholesale China products you can receive from Shukan Mall, that satisfy different business needs.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">2. Assured Quality Wholesale China Products</h3>
                  <p className="text-sm">When it comes to product sourcing from China to India, Shukan mall always stands out as one of the best China product wholesalers in India. This leading importer allows you to source assured quality wholesale products for your eCommerce or dropshipping business which is a major reason why most of the business owners trust us for importing products from China.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">3. Simplified Import Process</h3>
                  <p className="text-sm">Importing wholesale products from China to India involves several critical procedures that you need to fulfill for successfully importing from China. As an experienced China product importer, Shukan Mall has years of expertise in the import export field and has in-depth knowledge of the importing process.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">4. Cheapest Price Ranges</h3>
                  <p className="text-sm">One of the main reasons that made us one of the best China product wholesalers in India is the cheapest price ranges of our products. We offer all varieties of best-quality wholesale China products at the most affordable price rates that are suitable for your budget.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">5. Best Business Assistance</h3>
                  <p className="text-sm">Are you a newcomer in the import business sector? Don't worry, Shukan mall is there for you. We provide best business assistance and proper guidance to all those who are recently starting to import products from China.</p>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">3. Import Products from China to India with Shukan Mall- One of the Trusted China Product Wholesalers</h2>
              <p className="mb-4">Do you want to import different varieties of products from China for the expansion of your business but cannot find a reliable China product importer in India? Shukan Mall can be your ultimate solution then. It has become the most reputed importer in India and gained everyone's trust due to their streamline import procedure and best-quality product range. You will get endless benefits from us that will help you develop your business. Start product sourcing from China to India with Shukan mall and get access to various types of wholesale China products at competitive price ranges.</p>
              <p className="font-semibold">Contact us: +91 8200668763 | Email: Shukansales16@Gmail.Com</p>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}