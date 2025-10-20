import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAuth } from '@/lib/api-helpers'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  duration: z.string().optional(),
  difficulty: z.string().optional(),
  highlights: z.array(z.string()).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }
    const p = parsed.data
    await prisma.itinerary.update({
      where: { id },
      data: {
        ...(p.title != null && { title: p.title }),
        ...(p.description != null && { description: p.description }),
        ...(p.duration != null && { duration: p.duration }),
        ...(p.difficulty != null && { difficulty: p.difficulty }),
        ...(p.highlights != null && { highlights: p.highlights }),
      },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update itinerary' }, { status: 500 })
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
    await prisma.itinerary.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to delete itinerary' }, { status: 500 })
  }
}
