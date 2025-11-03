import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function AdminBookingsPage() {
  const session = await getSession()
  if (!session) redirect('/admin')
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bookings (admin)</h1>
      <p className="text-gray-600">View all bookings from the main dashboard or use the public /bookings page for user bookings.</p>
    </div>
  )
}
