"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Thermometer, Backpack, Plane, Car, Home, Utensils, Calendar, Camera, Users } from "lucide-react"
import { getAllItineraries } from "@/lib/services/itineraries"
import { Itinerary } from "@/types/schema"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

const packingList = [
  "Comfortable walking shoes",
  "Light rain jacket",
  "Sun hat and sunscreen",
  "Camera with extra batteries",
  "Insect repellent",
  "Personal medications",
  "Respectful clothing for cultural sites",
  "Small backpack for day trips",
]

export default function PlanVisitPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadItineraries() {
      try {
        const data = await getAllItineraries()
        setItineraries(data)
      } catch (err) {
        console.error('Error loading itineraries:', err)
        setError('Failed to load itineraries')
      } finally {
        setLoading(false)
      }
    }

    loadItineraries()
  }, [])

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
          <Image src="/placeholder.svg?height=400&width=1200" alt="Plan Your Visit" fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Plan Your Visit</h1>
          <p className="text-xl">Everything you need to know for an unforgettable experience</p>
        </div>
      </section>

      {/* Best Time to Visit */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Time to Visit</h2>
            <p className="text-xl text-gray-600">Plan your trip during the ideal season for your preferred activities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-2 text-green-600" />
                  Dry Season
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  October to May offers the best weather for outdoor activities and cultural events.
                </p>
                <Badge variant="outline">Ideal for Hiking</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  Cultural Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Major festivals and ceremonies take place throughout the year, with peak activity during harvest season.
                </p>
                <Badge variant="outline">Cultural Immersion</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-green-600" />
                  Photography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Early morning and late afternoon offer the best lighting for capturing Tembaro's landscapes.
                </p>
                <Badge variant="outline">Golden Hours</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Crowds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Visit during weekdays or shoulder seasons for a more intimate experience with local communities.
                </p>
                <Badge variant="outline">Peaceful Experience</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Here */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Getting Here</h2>
            <p className="text-xl text-gray-600">Multiple options to reach Tembaro from major cities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plane className="h-5 w-5 mr-2 text-green-600" />
                  By Air
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Fly to Addis Ababa International Airport, then take a domestic flight to the nearest regional airport.
                </p>
                <Badge variant="outline">Quickest Option</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2 text-green-600" />
                  By Road
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Well-maintained roads connect Tembaro to major cities. We can arrange pickup services from any location.
                </p>
                <Badge variant="outline">Scenic Route</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-green-600" />
                  Local Transport
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Local buses and minibuses connect Tembaro to Addis Ababa directly. We can also arrange pickup services
                  from every corner of the country.
                </p>
                <Badge variant="outline">Budget Friendly</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Itineraries */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sample Itineraries</h2>
            <p className="text-xl text-gray-600">Choose the perfect trip length for your schedule</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
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
          ) : itineraries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {itineraries.map((itinerary) => (
                <Card key={itinerary.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{itinerary.title}</CardTitle>
                    <CardDescription>{itinerary.duration}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
                        <div className="flex flex-wrap gap-2">
                          {itinerary.highlights.map((highlight, index) => (
                            <Badge key={index} variant="secondary">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{itinerary.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Backpack className="h-4 w-4 mr-2" />
                        {itinerary.difficulty}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">No itineraries found.</p>
            </div>
          )}
        </div>
      </section>

      {/* What to Pack */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What to Pack</h2>
            <p className="text-xl text-gray-600">Essential items for a comfortable and enjoyable visit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {packingList.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2" />
                    <p className="text-gray-600">{item}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
