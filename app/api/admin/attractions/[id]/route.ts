import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAuth } from '@/lib/api-helpers'
import { saveUpload } from '@/lib/uploads'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  image_url: z.string().optional().nullable(),
  location: z.object({ latitude: z.number(), longitude: z.number(), address: z.string() }).optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  duration: z.string().optional(),
  accessibility: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  best_time: z.string().optional(),
  featured: z.boolean().optional(),
  price: z.number().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth
  try {
    const { id } = await params
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    const body = JSON.parse((formData.get('body') as string) || '{}')
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }
    const p = parsed.data
    let imageUrl: string | null = p.image_url ?? null
    if (file && file.size > 0) {
      const { url } = await saveUpload(file, 'attractions')
      imageUrl = url
    }
    await prisma.attraction.update({
      where: { id },
      data: {
        ...(p.name != null && { name: p.name }),
        ...(p.description != null && { description: p.description }),
        ...(p.short_description != null && { shortDescription: p.short_description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(p.location && { location: p.location }),
        ...(p.category != null && { category: p.category }),
        ...(p.difficulty != null && { difficulty: p.difficulty }),
        ...(p.duration != null && { duration: p.duration }),
        ...(p.accessibility != null && { accessibility: p.accessibility }),
        ...(p.highlights != null && { highlights: p.highlights }),
        ...(p.best_time != null && { bestTime: p.best_time }),
        ...(p.featured != null && { featured: p.featured }),
        ...(p.price != null && { price: p.price }),
      },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update attraction' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth
  try {
    const { id } = await params
    await prisma.attraction.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to delete attraction' }, { status: 500 })
  }
}
