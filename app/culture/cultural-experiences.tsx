"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Utensils, Palette, Music, Home } from "lucide-react"

export function CulturalExperiences() {
  return (
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
  )
} 