import { supabase, handleSupabaseError } from '@/lib/supabase';
import { NewsArticle } from '@/types/schema';

const TABLE = 'news';

// Get all news articles
export async function getAllNewsArticles(): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as NewsArticle[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get featured news articles
export async function getFeaturedNewsArticles(limitCount = 3): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) throw error;
    return data as NewsArticle[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get latest news articles
export async function getLatestNewsArticles(limitCount = 3): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) throw error;
    return data as NewsArticle[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get news article by ID
export async function getNewsArticleById(id: string): Promise<NewsArticle | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as NewsArticle;
  } catch (error) {
    handleSupabaseError(error);
    return null;
  }
}

// Get news articles by category
export async function getNewsArticlesByCategory(category: string): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as NewsArticle[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Create news article
export async function createNewsArticle(article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>, imageFile: File): Promise<string> {
  try {
    // Upload image to Supabase Storage
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `news/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('news')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('news')
      .getPublicUrl(filePath);

    // Create news article record
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        ...article,
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

// Update news article
export async function updateNewsArticle(
  id: string,
  data: Partial<Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>>,
  imageFile?: File
): Promise<void> {
  try {
    let image_url = data.image_url;

    if (imageFile) {
      // Upload new image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `news/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('news')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('news')
        .getPublicUrl(filePath);

      image_url = publicUrl;

      // Delete old image if it exists
      if (data.image_url) {
        const oldPath = data.image_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('news')
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

// Delete news article
export async function deleteNewsArticle(id: string): Promise<void> {
  try {
    // Get news article to get image URL
    const { data: article, error: fetchError } = await supabase
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
    if (article?.image_url) {
      const imagePath = article.image_url.split('/').pop();
      if (imagePath) {
        await supabase.storage
          .from('news')
          .remove([imagePath]);
      }
    }
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
}