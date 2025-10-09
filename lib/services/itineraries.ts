import { prisma } from '@/lib/db/prisma'
import type { Itinerary } from '@/types/schema'

function toItinerary(a: {
  id: string
  title: string
  description: string
  duration: string
  difficulty: string
  highlights: string[]
  createdAt: Date
  updatedAt: Date
}): Itinerary {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    duration: a.duration,
    difficulty: a.difficulty,
    highlights: a.highlights,
    created_at: a.createdAt.toISOString(),
    updated_at: a.updatedAt.toISOString(),
  }
}

export async function getAllItineraries(): Promise<Itinerary[]> {
  const list = await prisma.itinerary.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return list.map(toItinerary)
}

export async function getItineraryById(id: string): Promise<Itinerary | null> {
  const a = await prisma.itinerary.findUnique({ where: { id } })
  return a ? toItinerary(a) : null
}
