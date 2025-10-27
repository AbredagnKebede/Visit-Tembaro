export const dynamic = 'force-dynamic'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getAllCulturalItems } from "@/lib/services/cultural"
import { CulturalList } from "./cultural-list"
import { FestivalsList } from "./festivals-list"
import { CulturalExperiences } from "./cultural-experiences"

export default async function CulturePage() {
  const culturalItems = await getAllCulturalItems()

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          <Image src="/placeholder.svg?height=400&width=1200" alt="Tembaro Culture" fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Cultural Heritage</h1>
          <p className="text-xl">Discover the rich traditions and customs of Tembaro</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Living Heritage</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            The Tembaro people have preserved their unique cultural identity for generations, maintaining traditions
            that reflect deep connections to the land, community, and ancestral wisdom. Visitors have the opportunity to
            experience authentic cultural practices that remain vibrant parts of daily life.
          </p>
        </div>
      </section>

      {/* Cultural Elements */}
      <CulturalList initialItems={culturalItems} />

      {/* Festivals & Events */}
      <FestivalsList />

      {/* Cultural Experiences */}
      <CulturalExperiences />

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Experience Our Culture</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join us for an authentic cultural journey that will create lasting memories and meaningful connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Book Cultural Tour
            </Button>
            <Button size="lg" variant="outline">
              View Festival Calendar
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
