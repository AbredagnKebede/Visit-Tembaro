'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, XCircle } from 'lucide-react'
import { toast } from 'sonner'

type Booking = {
  id: string
  booking_date: string
  booking_time: string
  number_of_people: number
  total_price: number
  status: string
  special_requests?: string
  attraction?: {
    id: string
    name: string
    image_url: string | null
    price: number
  } | null
}

export default function BookingsPage() {
  const { data: session, status } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== 'authenticated') {
      setLoading(false)
      return
    }
    async function load() {
      try {
        const res = await fetch('/api/bookings', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setBookings(data)
      } catch {
        toast.error('Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [status])

  async function handleCancel(id: string) {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'cancelled' }),
      })
      if (!res.ok) throw new Error('Failed to cancel')
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)))
      toast.success('Booking cancelled')
    } catch {
      toast.error('Failed to cancel booking')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your bookings.</p>
          <Link href="/admin">
            <Button>Sign in</Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-600">
              <p className="mb-4">You have no bookings yet.</p>
              <Link href="/attractions">
                <Button>Explore attractions</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <Card key={b.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">{b.attraction?.name ?? 'Attraction'}</CardTitle>
                    <Badge variant={b.status === 'cancelled' ? 'secondary' : 'default'} className="mt-2">
                      {b.status}
                    </Badge>
                  </div>
                  {b.status !== 'cancelled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(b.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {b.booking_date} at {b.booking_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {b.number_of_people} {b.number_of_people === 1 ? 'person' : 'people'}
                  </span>
                  <span className="font-medium">Total: ${Number(b.total_price).toFixed(2)}</span>
                  {b.special_requests && (
                    <p className="w-full text-gray-500 border-t pt-2 mt-2">{b.special_requests}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
