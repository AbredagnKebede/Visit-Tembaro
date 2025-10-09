import { prisma } from '@/lib/db/prisma'
import type { Attraction } from '@/types/schema'

function toAttraction(a: {
  id: string
  name: string
  description: string
  shortDescription: string
  imageUrl: string | null
  location: unknown
  category: string
  difficulty: string
  duration: string
  accessibility: string
  highlights: string[]
  bestTime: string
  featured: boolean
  price: unknown
  createdAt: Date
  updatedAt: Date
}): Attraction {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    short_description: a.shortDescription,
    image_url: a.imageUrl ?? '',
    location: a.location as Attraction['location'],
    category: a.category,
    difficulty: a.difficulty,
    duration: a.duration,
    accessibility: a.accessibility,
    highlights: a.highlights,
    best_time: a.bestTime,
    featured: a.featured,
    price: Number(a.price),
    created_at: a.createdAt.toISOString(),
    updated_at: a.updatedAt.toISOString(),
  }
}

export async function getAllAttractions(): Promise<Attraction[]> {
  const list = await prisma.attraction.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return list.map(toAttraction)
}

export async function getFeaturedAttractions(limitCount = 3): Promise<Attraction[]> {
  const list = await prisma.attraction.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: limitCount,
  })
  return list.map(toAttraction)
}

export async function getAttractionById(id: string): Promise<Attraction | null> {
  const a = await prisma.attraction.findUnique({ where: { id } })
  return a ? toAttraction(a) : null
}
