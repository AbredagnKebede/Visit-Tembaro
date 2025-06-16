"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Music, Utensils, Palette, Home } from "lucide-react"
import { getAllCulturalItems } from "@/lib/services/cultural"
import { CulturalItem } from "@/types/schema"
import { Skeleton } from "@/components/ui/skeleton"

const festivals = [
  {
    name: "Tembaro New Year Festival",
    date: "September",
    description:
      "Community-wide celebration marking the Ethiopian New Year with traditional foods, music, and cultural performances.",
    activities: ["Traditional dances", "Community feast", "Cultural exhibitions", "Blessing ceremonies"],
  },
  {
    name: "Harvest Celebration",
    date: "November-December",
    description: "Thanksgiving festival celebrating successful harvests with communal meals and gratitude ceremonies.",
    activities: ["Harvest displays", "Traditional cooking", "Storytelling", "Community sharing"],
  },
  {
    name: "Coffee Ceremony Festival",
    date: "March",
    description:
      "Special celebration of coffee culture with elaborate ceremonies, competitions, and cultural exchange.",
    activities: ["Coffee ceremonies", "Roasting competitions", "Cultural performances", "Community bonding"],
  },
]

export default function CulturePage() {
  const [culturalItems, setCulturalItems] = useState<CulturalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCulturalItems() {
      try {
        const data = await getAllCulturalItems()
        setCulturalItems(data)
      } catch (err) {
        console.error('Error loading cultural items:', err)
        setError('Failed to load cultural items')
      } finally {
        setLoading(false)
      }
    }

    loadCulturalItems()
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cultural Elements</h2>
            <p className="text-xl text-gray-600">Explore the diverse aspects of Tembaro's cultural heritage</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
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
          ) : culturalItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {culturalItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <Badge variant="secondary">{item.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">No cultural items found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Festivals & Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Festivals & Celebrations</h2>
            <p className="text-xl text-gray-600">Join us for these special cultural events throughout the year</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {festivals.map((festival, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{festival.name}</CardTitle>
                    <Badge variant="outline">{festival.date}</Badge>
                  </div>
                  <CardDescription>{festival.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-3">Festival Activities:</h4>
                    <ul className="space-y-2">
                      {festival.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="mt-4 w-full" variant="outline">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Experiences */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cultural Experiences</h2>
            <p className="text-xl text-blue-100">Immerse yourself in authentic Tembaro traditions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Utensils className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="font-semibold mb-2">Cooking Classes</h3>
                <p className="text-blue-100 text-sm">Learn to prepare traditional dishes with local families</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Palette className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="font-semibold mb-2">Craft Workshops</h3>
                <p className="text-blue-100 text-sm">Create traditional crafts with master artisans</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Music className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="font-semibold mb-2">Music & Dance</h3>
                <p className="text-blue-100 text-sm">Participate in traditional performances and learn local dances</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Home className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="font-semibold mb-2">Homestays</h3>
                <p className="text-blue-100 text-sm">Live with local families and experience daily life</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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
