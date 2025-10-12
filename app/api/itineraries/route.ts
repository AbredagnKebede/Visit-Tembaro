import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const list = await prisma.itinerary.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const data = list.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      duration: a.duration,
      difficulty: a.difficulty,
      highlights: a.highlights,
      created_at: a.createdAt.toISOString(),
      updated_at: a.updatedAt.toISOString(),
    }))
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch itineraries' }, { status: 500 })
  }
}
