import { createClient } from '@/lib/supabase/client'
import { Booking } from '@/types/schema'

export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'status'>) {
  try {
    // Validate required fields
    if (!bookingData.user_id) {
      throw new Error('User ID is required')
    }
    if (!bookingData.attraction_id) {
      throw new Error('Attraction ID is required')
    }
    if (!bookingData.booking_date) {
      throw new Error('Booking date is required')
    }
    if (!bookingData.booking_time) {
      throw new Error('Booking time is required')
    }
    if (!bookingData.number_of_people || bookingData.number_of_people <= 0) {
      throw new Error('Number of people must be greater than 0')
    }
    if (!bookingData.total_price || bookingData.total_price <= 0) {
      throw new Error('Total price must be greater than 0')
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        ...bookingData,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      // Log the full error object for debugging
      console.error('Supabase error:', error)
      
      // Check for specific error types
      if (error.code === '23505') {
        throw new Error('A booking already exists for this time slot')
      }
      if (error.code === '23503') {
        throw new Error('Invalid user or attraction ID')
      }
      if (error.code === '42501') {
        throw new Error('You do not have permission to create this booking')
      }
      
      // If no specific error is matched, use the error message or a default
      throw new Error(error.message || 'Failed to create booking. Please try again.')
    }

    return data
  } catch (error) {
    // Log the error for debugging
    console.error('Error in createBooking:', error)
    
    // If it's already an Error object, throw it as is
    if (error instanceof Error) {
      throw error
    }
    
    // Otherwise, create a new error with a generic message
    throw new Error('An unexpected error occurred while creating the booking')
  }
}

export async function getBookings(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getUserBookings(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      attraction:attractions(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user bookings:', error)
    throw new Error('Failed to fetch bookings')
  }

  return data
}

export async function getBookingById(bookingId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      attraction:attractions(*)
    `)
    .eq('id', bookingId)
    .single()

  if (error) {
    console.error('Error fetching booking:', error)
    throw new Error('Failed to fetch booking')
  }

  return data
}

export async function updateBookingStatus(bookingId: string, status: Booking['status']) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()
    .single()

  if (error) {
    console.error('Error updating booking status:', error)
    throw new Error('Failed to update booking status')
  }

  return data
}

export async function cancelBooking(bookingId: string) {
  return updateBookingStatus(bookingId, 'cancelled')
}

export async function getAllBookings() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      attraction:attractions(*),
      user:users(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all bookings:', error)
    throw new Error('Failed to fetch bookings')
  }

  return data
} 