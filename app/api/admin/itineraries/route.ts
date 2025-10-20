import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAuth } from '@/lib/api-helpers'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string(),
  description: z.string(),
  duration: z.string(),
  difficulty: z.string(),
  highlights: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth
  try {
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }
    const p = parsed.data
    const a = await prisma.itinerary.create({
      data: {
        title: p.title,
        description: p.description,
        duration: p.duration,
        difficulty: p.difficulty,
        highlights: p.highlights,
      },
    })
    return NextResponse.json({ id: a.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create itinerary' }, { status: 500 })
  }
}
