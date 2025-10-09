import { prisma } from '@/lib/db/prisma'
import type { Booking } from '@/types/schema'

function toBooking(b: {
  id: string
  userId: string
  attractionId: string
  bookingDate: Date
  bookingTime: string
  numberOfPeople: number
  totalPrice: { toNumber: () => number }
  status: string
  specialRequests: string | null
  createdAt: Date
  updatedAt: Date
  attraction?: {
    id: string
    name: string
    imageUrl: string | null
    price: { toNumber: () => number }
  } | null
}): Booking & { attraction?: Booking['attraction'] } {
  const out: Booking & { attraction?: Booking['attraction'] } = {
    id: b.id,
    user_id: b.userId,
    attraction_id: b.attractionId,
    booking_date: b.bookingDate.toISOString().slice(0, 10),
    booking_time: b.bookingTime,
    number_of_people: b.numberOfPeople,
    total_price: Number(b.totalPrice),
    status: b.status as Booking['status'],
    special_requests: b.specialRequests ?? undefined,
    created_at: b.createdAt.toISOString(),
    updated_at: b.updatedAt.toISOString(),
  }
  if (b.attraction) {
    out.attraction = {
      id: b.attraction.id,
      name: b.attraction.name,
      description: '',
      short_description: '',
      image_url: b.attraction.imageUrl ?? '',
      location: { latitude: 0, longitude: 0, address: '' },
      category: '',
      difficulty: '',
      duration: '',
      accessibility: '',
      highlights: [],
      best_time: '',
      featured: false,
      price: Number(b.attraction.price),
      created_at: '',
      updated_at: '',
    }
  }
  return out
}

export async function getBookings(userId: string): Promise<Booking[]> {
  const list = await prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return list.map(toBooking)
}

export async function getUserBookings(userId: string): Promise<(Booking & { attraction?: Booking['attraction'] })[]> {
  const list = await prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { attraction: true },
  })
  return list.map(toBooking)
}

export async function getBookingById(id: string, userId: string): Promise<Booking | null> {
  const b = await prisma.booking.findFirst({
    where: { id, userId },
    include: { attraction: true },
  })
  return b ? toBooking(b) : null
}

export async function cancelBooking(id: string, userId: string): Promise<void> {
  await prisma.booking.updateMany({
    where: { id, userId },
    data: { status: 'cancelled' },
  })
}
