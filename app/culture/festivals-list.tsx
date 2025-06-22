"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

export function FestivalsList() {
  return (
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
  )
} 