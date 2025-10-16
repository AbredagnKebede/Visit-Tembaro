import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAuth } from '@/lib/api-helpers'
import { z } from 'zod'

const createSchema = z.object({
  attraction_id: z.string().uuid(),
  booking_date: z.string(),
  booking_time: z.string(),
  number_of_people: z.number().int().min(1),
  special_requests: z.string().optional(),
})

export async function GET() {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth
  try {
    const list = await prisma.booking.findMany({
      where: { userId: auth.user.id },
      orderBy: { createdAt: 'desc' },
      include: { attraction: true },
    })
    const data = list.map((b) => ({
      id: b.id,
      user_id: b.userId,
      attraction_id: b.attractionId,
      booking_date: b.bookingDate.toISOString().slice(0, 10),
      booking_time: b.bookingTime,
      number_of_people: b.numberOfPeople,
      total_price: Number(b.totalPrice),
      status: b.status,
      special_requests: b.specialRequests,
      created_at: b.createdAt.toISOString(),
      updated_at: b.updatedAt.toISOString(),
      attraction: b.attraction
        ? {
            id: b.attraction.id,
            name: b.attraction.name,
            image_url: b.attraction.imageUrl,
            price: Number(b.attraction.price),
          }
        : null,
    }))
    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

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
    const attraction = await prisma.attraction.findUnique({
      where: { id: p.attraction_id },
    })
    if (!attraction) {
      return NextResponse.json({ error: 'Attraction not found' }, { status: 404 })
    }
    const totalPrice = Number(attraction.price) * p.number_of_people
    const booking = await prisma.booking.create({
      data: {
        userId: auth.user.id,
        attractionId: p.attraction_id,
        bookingDate: new Date(p.booking_date),
        bookingTime: p.booking_time,
        numberOfPeople: p.number_of_people,
        totalPrice,
        status: 'pending',
        specialRequests: p.special_requests ?? null,
      },
    })
    return NextResponse.json({
      id: booking.id,
      total_price: totalPrice,
      status: booking.status,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
