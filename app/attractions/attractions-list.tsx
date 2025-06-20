"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MountainIcon as Hiking } from "lucide-react"
import { Attraction } from "@/types/schema"
import Link from "next/link"

const categories = ["All", "Natural", "Cultural"]

interface AttractionsListProps {
  initialAttractions: Attraction[]
}

export function AttractionsList({ initialAttractions }: AttractionsListProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredAttractions = selectedCategory === "All" 
    ? initialAttractions 
    : initialAttractions.filter(attraction => attraction.category === selectedCategory)

  return (
    <>
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
          {filteredAttractions.length > 0 ? (
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
                      <div className="flex flex-col gap-2">
                        {(attraction.highlights || []).map((highlight: string, index: number) => (
                          <Badge key={index} variant="secondary" className="w-fit">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 flex-shrink-0 overflow-x-auto">
                      <Button variant="default" size="sm">
                        Get Directions
                      </Button>
                      <Button variant="outline" size="sm">
                        View Gallery
                      </Button>
                      <Link href={`/attractions/${attraction.id}`}>
                        <Button variant="default" size="sm">
                          Book Now
                        </Button>
                      </Link>
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
    </>
  )
} 