import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Attraction } from '@/types/schema';

const TABLE = 'attractions';

// Get all attractions
export async function getAllAttractions(): Promise<Attraction[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Attraction[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get featured attractions
export async function getFeaturedAttractions(limitCount = 3): Promise<Attraction[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) throw error;
    return data as Attraction[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get attraction by ID
export async function getAttractionById(id: string): Promise<Attraction | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Attraction;
  } catch (error) {
    handleSupabaseError(error);
    return null;
  }
}

// Create attraction
export async function createAttraction(attraction: Omit<Attraction, 'id' | 'created_at' | 'updated_at'>, imageFile: File): Promise<string> {
  try {
    // Upload image to Supabase Storage
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `attractions/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('attractions')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('attractions')
      .getPublicUrl(filePath);

    // Create attraction record
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        ...attraction,
        image_url: publicUrl,
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

// Update attraction
export async function updateAttraction(
  id: string,
  data: Partial<Omit<Attraction, 'id' | 'created_at' | 'updated_at'>>,
  imageFile?: File
): Promise<void> {
  try {
    let image_url = data.image_url;

    if (imageFile) {
      // Upload new image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `attractions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('attractions')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('attractions')
        .getPublicUrl(filePath);

      image_url = publicUrl;

      // Delete old image if it exists
      if (data.image_url) {
        const oldPath = data.image_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('attractions')
            .remove([oldPath]);
        }
      }
    }

    const { error } = await supabase
      .from(TABLE)
      .update({
        ...data,
        image_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
}

// Delete attraction
export async function deleteAttraction(id: string): Promise<void> {
  try {
    // Get attraction to get image URL before deleting it
    const { data: attraction } = await supabase
      .from(TABLE)
      .select('image_url') // Only select image_url, as it's the only field needed
      .eq('id', id)
      .maybeSingle(); // Use maybeSingle to handle cases where no row is returned

    // Delete image from storage if the attraction and its image_url exist
    if (attraction?.image_url) {
      const imagePath = attraction.image_url.split('/').pop();
      if (imagePath) {
        await supabase.storage
          .from('attractions')
          .remove([imagePath]);
      }
    }

    // Delete from database regardless of whether image was found/deleted
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