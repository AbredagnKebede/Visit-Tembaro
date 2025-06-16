import { supabase, handleSupabaseError } from '@/lib/supabase';
import { CulturalItem } from '@/types/schema';

const TABLE = 'cultural_items';

// Get all cultural items
export async function getAllCulturalItems(): Promise<CulturalItem[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as CulturalItem[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get featured cultural items
export async function getFeaturedCulturalItems(limit: number = 4): Promise<CulturalItem[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as CulturalItem[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get cultural item by ID
export async function getCulturalItemById(id: string): Promise<CulturalItem | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as CulturalItem;
  } catch (error) {
    handleSupabaseError(error);
    return null;
  }
}

// Create cultural item
export async function createCulturalItem(item: Omit<CulturalItem, 'id' | 'created_at' | 'updated_at'>, imageFile: File): Promise<string> {
  try {
    // Upload image to Supabase Storage
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `cultural/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('cultural')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('cultural')
      .getPublicUrl(filePath);

    // Create cultural item record
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        ...item,
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

// Update cultural item
export async function updateCulturalItem(
  id: string,
  data: Partial<Omit<CulturalItem, 'id' | 'created_at' | 'updated_at'>>,
  imageFile?: File
): Promise<void> {
  try {
    let image_url = data.image_url;

    if (imageFile) {
      // Upload new image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `cultural/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cultural')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cultural')
        .getPublicUrl(filePath);

      image_url = publicUrl;

      // Delete old image if it exists
      if (data.image_url) {
        const oldPath = data.image_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('cultural')
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

// Delete cultural item
export async function deleteCulturalItem(id: string): Promise<void> {
  try {
    // Get cultural item to get image URL
    const { data: item, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from database
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Delete image from storage if it exists
    if (item?.image_url) {
      const imagePath = item.image_url.split('/').pop();
      if (imagePath) {
        await supabase.storage
          .from('cultural')
          .remove([imagePath]);
      }
    }
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
} 