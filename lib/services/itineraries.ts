import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Itinerary } from '@/types/schema';

const TABLE = 'itineraries';

// Get all itineraries
export async function getAllItineraries(): Promise<Itinerary[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Itinerary[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get itinerary by ID
export async function getItineraryById(id: string): Promise<Itinerary | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Itinerary;
  } catch (error) {
    handleSupabaseError(error);
    return null;
  }
}

// Create itinerary
export async function createItinerary(itinerary: Omit<Itinerary, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        ...itinerary,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
}

// Update itinerary
export async function updateItinerary(
  id: string,
  data: Partial<Omit<Itinerary, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE)
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
}

// Delete itinerary
export async function deleteItinerary(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
} 