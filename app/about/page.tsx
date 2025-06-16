import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Calendar, Mountain } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          <Image src="/placeholder.svg?height=400&width=1200" alt="Tembaro Landscape" fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">About Tembaro</h1>
          <p className="text-xl">Discover the heart of Southern Ethiopia</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4">
                  Tembaro Special Wereda is a hidden gem nestled in the Centeral Ethiopia Region of Ethiopia. Known for its stunning landscapes, rich cultural heritage, and warm
                  hospitality, Tembaro offers visitors an authentic Ethiopian experience away from the crowds.
                </p>
                <p className="mb-4">
                  The region is home to the Tembaro people, who have preserved their unique traditions, language, and
                  customs for generations. From ancient terraced agriculture to traditional architecture, every aspect
                  of life in Tembaro tells a story of resilience and cultural pride.
                </p>
                <p>
                  Our mission is to promote sustainable tourism that benefits local communities while preserving the
                  natural environment and cultural heritage that makes Tembaro special.
                </p>
              </div>
            </div>
            <div className="relative h-96 lg:h-auto">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Traditional Tembaro Village"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">1,200 km²</h3>
                <p className="text-gray-600">Total Area</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">150,000+</h3>
                <p className="text-gray-600">Population</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Mountain className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">2,800m</h3>
                <p className="text-gray-600">Highest Elevation</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ancient</h3>
                <p className="text-gray-600">Cultural Heritage</p>
              </CardContent>
            </Card>
          </div>

          {/* Geography & Climate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Geography & Climate</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4">
                  Tembaro is characterized by its diverse topography, ranging from highland plateaus to deep valleys.
                  The region's elevation varies from 1,500 to 2,800 meters above sea level, creating distinct
                  microclimates and ecosystems.
                </p>
                <p className="mb-4">
                  The climate is generally temperate, with two main seasons: the dry season (October to May) and the
                  rainy season (June to September). This climate supports diverse agriculture and lush vegetation
                  throughout much of the year.
                </p>
                <p>
                  The landscape is dotted with sacred forests, traditional terraced farms, and pristine natural areas
                  that provide habitat for various endemic species.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Culture & Traditions</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4">
                  The Tembaro people have a rich oral tradition, with stories, songs, and proverbs passed down through
                  generations. Traditional governance systems still play an important role in community decision-making.
                </p>
                <p className="mb-4">
                  Agriculture is central to Tembaro culture, with traditional farming practices that have sustained
                  communities for centuries. Coffee, enset (false banana), and various grains are the main crops.
                </p>
                <p>
                  Religious and cultural festivals mark important times of the year, bringing communities together to
                  celebrate their shared heritage and strengthen social bonds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
