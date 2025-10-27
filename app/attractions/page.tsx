export const dynamic = 'force-dynamic'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getAllAttractions } from "@/lib/services/attractions"
import { AttractionsList } from "./attractions-list"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AttractionsPage() {
  const attractions = await getAllAttractions()

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          <Image src="/placeholder.svg?height=400&width=1200" alt="Tembaro Attractions" fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Natural Attractions</h1>
          <p className="text-xl">Discover the wonders that make Tembaro special</p>
        </div>
      </section>

      {/* Attractions List */}
      <AttractionsList initialAttractions={attractions} />

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Plan Your Adventure</h2>
          <p className="text-xl text-green-100 mb-8">
            Ready to explore these amazing attractions? Contact us to plan your perfect itinerary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/plan-visit">
              <Button size="lg" variant="secondary">
                Plan Your Visit
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Contact Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
