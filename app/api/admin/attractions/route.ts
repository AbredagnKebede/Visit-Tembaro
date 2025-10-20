import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAuth } from '@/lib/api-helpers'
import { saveUpload } from '@/lib/uploads'
import { z } from 'zod'

const createSchema = z.object({
  name: z.string(),
  description: z.string(),
  short_description: z.string(),
  image_url: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  }),
  category: z.string(),
  difficulty: z.string(),
  duration: z.string(),
  accessibility: z.string(),
  highlights: z.array(z.string()),
  best_time: z.string(),
  featured: z.boolean().optional(),
  price: z.number().optional(),
})

export async function POST(request: NextRequest) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    const body = JSON.parse((formData.get('body') as string) || '{}')
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }
    const p = parsed.data
    let imageUrl = p.image_url || ''
    if (file && file.size > 0) {
      const { url } = await saveUpload(file, 'attractions')
      imageUrl = url
    }
    const a = await prisma.attraction.create({
      data: {
        name: p.name,
        description: p.description,
        shortDescription: p.short_description,
        imageUrl: imageUrl || null,
        location: p.location,
        category: p.category,
        difficulty: p.difficulty,
        duration: p.duration,
        accessibility: p.accessibility,
        highlights: p.highlights,
        bestTime: p.best_time,
        featured: p.featured ?? false,
        price: p.price ?? 50,
      },
    })
    return NextResponse.json({ id: a.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create attraction' }, { status: 500 })
  }
}
