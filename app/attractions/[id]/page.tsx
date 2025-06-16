import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getAttractionById, getFeaturedAttractions } from "@/lib/services/attractions"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Camera, ArrowLeft, Share2, MountainIcon as Hiking } from "lucide-react"
import AttractionMapClient from "@/components/attraction-map-client"
import GetDirectionsButton from "@/components/get-directions-button"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const attraction = await getAttractionById(params.id)
  
  if (!attraction) {
    return {
      title: 'Attraction Not Found - Visit Tembaro',
    }
  }
  
  return {
    title: `${attraction.name} - Visit Tembaro`,
    description: attraction.short_description,
  }
}

export default async function AttractionPage({ params }: Props) {
  const attraction = await getAttractionById(params.id)
  
  if (!attraction) {
    notFound()
  }
  
  // Get related attractions (excluding current one)
  const relatedAttractions = await getFeaturedAttractions(4)
  const filteredRelatedAttractions = relatedAttractions.filter(item => item.id !== params.id).slice(0, 3)

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Attraction Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/attractions" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Attractions
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image 
                src={attraction.image_url || "/placeholder.svg"} 
                alt={attraction.name} 
                fill 
                className="object-cover" 
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-600">{attraction.category}</Badge>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{attraction.name}</h1>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-gray-600 text-base">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  {attraction.duration}
                </div>
                <div className="flex items-center">
                  <Hiking className="h-5 w-5 mr-2 text-gray-500" />
                  {attraction.difficulty}
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none mb-4">
                <p>{attraction.description}</p>
              </div>

              {attraction.highlights && attraction.highlights.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Highlights:</h3>
                  <div className="flex flex-col space-y-2">
                    {attraction.highlights.map((highlight: string, index: number) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <p className="mb-2 text-base text-gray-600"><span className="font-semibold">Best Time:</span> {attraction.best_time}</p>
              <p className="mb-4 text-base text-gray-600"><span className="font-semibold">Accessibility:</span> {attraction.accessibility}</p>
              
              <div className="flex space-x-4 mb-8">
                {attraction.location.latitude != null && attraction.location.longitude != null && (
                  <GetDirectionsButton
                    latitude={attraction.location.latitude}
                    longitude={attraction.location.longitude}
                  />
                )}
                <Button variant="outline" className="flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  View Gallery
                </Button>
                <Button variant="ghost" className="flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            <div className="lg:col-span-2">
              {/* This column is empty now that the full description is moved up. Can be removed if no other content is needed here. */}
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
              <div className="h-64 rounded-lg overflow-hidden mb-4">
                <AttractionMapClient 
                  latitude={attraction.location.latitude} 
                  longitude={attraction.location.longitude} 
                  name={attraction.name}
                />
              </div>
              <div className="text-gray-600 mb-4">
                <p className="font-medium">Address:</p>
                <p>{attraction.location.address}</p>
              </div>
              {attraction.location.latitude != null && attraction.location.longitude != null && (
                <GetDirectionsButton
                  latitude={attraction.location.latitude}
                  longitude={attraction.location.longitude}
                  isFullWidth={true}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Related Attractions */}
      {filteredRelatedAttractions.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredRelatedAttractions.map((relatedAttraction) => (
                <Card key={relatedAttraction.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image 
                      src={relatedAttraction.image_url || "/placeholder.svg"} 
                      alt={relatedAttraction.name} 
                      fill 
                      className="object-cover" 
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                        {relatedAttraction.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{relatedAttraction.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{relatedAttraction.short_description}</p>
                    <Link
                      href={`/attractions/${relatedAttraction.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  )
}