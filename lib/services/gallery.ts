import { supabase, handleSupabaseError } from '@/lib/supabase';
import { GalleryItem } from '@/types/schema';

const TABLE = 'gallery';

// Get all gallery items
export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as GalleryItem[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get gallery items by category
export async function getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as GalleryItem[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get recent gallery items
export async function getRecentGalleryItems(limitCount = 8): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) throw error;
    return data as GalleryItem[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get gallery item by ID
export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as GalleryItem;
  } catch (error) {
    handleSupabaseError(error);
    return null;
  }
}

// Create gallery item
export async function createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>, imageFile: File): Promise<string> {
  try {
    // Upload image to Supabase Storage
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    // Create gallery item record
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

// Update gallery item
export async function updateGalleryItem(
  id: string,
  data: Partial<Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>>,
  imageFile?: File
): Promise<void> {
  try {
    let image_url = data.image_url;

    if (imageFile) {
      // Upload new image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      image_url = publicUrl;

      // Delete old image if it exists
      if (data.image_url) {
        const oldPath = data.image_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('gallery')
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

// Delete gallery item
export async function deleteGalleryItem(id: string): Promise<void> {
  try {
    // Get gallery item to get image URL
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
          .from('gallery')
          .remove([imagePath]);
      }
    }
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
}