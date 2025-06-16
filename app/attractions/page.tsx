"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Camera, MountainIcon as Hiking } from "lucide-react"
import { getAllAttractions } from "@/lib/services/attractions"
import { Attraction } from "@/types/schema"
import { Skeleton } from "@/components/ui/skeleton"

const categories = ["All", "Natural", "Cultural"]

export default function AttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    async function loadAttractions() {
      try {
        const data = await getAllAttractions()
        setAttractions(data)
      } catch (err) {
        console.error('Error loading attractions:', err)
        setError('Failed to load attractions')
      } finally {
        setLoading(false)
      }
    }

    loadAttractions()
  }, [])

  const filteredAttractions = selectedCategory === "All" 
    ? attractions 
    : attractions.filter(attraction => attraction.category === selectedCategory)

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-10 text-red-500">{error}</div>
        <Footer />
      </div>
    )
  }

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

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100 px-6 py-2 text-sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Attractions Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredAttractions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredAttractions.map((attraction) => (
                <Card key={attraction.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col md:flex-row relative w-full md:items-stretch min-h-[600px]">
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                      {attraction.category}
                    </Badge>
                  </div>
                  <div className="relative h-full md:w-1/2 flex-grow flex-shrink-0">
                    <Image
                      src={attraction.image_url || "/placeholder.svg"}
                      alt={attraction.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6 md:w-1/2 flex flex-col justify-between h-full flex-grow flex-shrink-0">
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{attraction.name}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Hiking className="h-4 w-4 mr-2" />
                          {attraction.difficulty}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {attraction.duration}
                        </div>
                      </div>
                      <p className="mb-2 text-sm text-gray-600"><span className="font-semibold">Best Time:</span> {attraction.best_time}</p>
                      <p className="mb-4 text-sm text-gray-600"><span className="font-semibold">Accessibility:</span> {attraction.accessibility}</p>
                      <p className="text-gray-600 mb-4 line-clamp-2">{attraction.description}</p>
                      <div className="flex gap-2 overflow-x-auto pb-2 whitespace-nowrap min-w-0">
                        {(attraction.highlights || []).map((highlight: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 flex-shrink-0">
                      <Button variant="default" size="sm">
                        Get Directions
                      </Button>
                      <Button variant="outline" size="sm">
                        View Gallery
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">No attractions found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Plan Your Adventure</h2>
          <p className="text-xl text-green-100 mb-8">
            Ready to explore these amazing attractions? Contact us to plan your perfect itinerary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Plan Your Visit
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              Contact Guide
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
