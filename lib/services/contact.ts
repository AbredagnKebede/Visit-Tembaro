import { supabase, handleSupabaseError } from '@/lib/supabase';
import { ContactMessage } from '@/types/schema';

const TABLE = 'contact_messages';

// Save a new contact message
export async function saveContactMessage(message: Omit<ContactMessage, 'id' | 'read' | 'created_at'>): Promise<string> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        ...message,
        read: false,
        created_at: new Date().toISOString()
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

// Get all contact messages
export async function getAllContactMessages(): Promise<ContactMessage[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ContactMessage[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Get unread contact messages
export async function getUnreadContactMessages(): Promise<ContactMessage[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ContactMessage[];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

// Mark message as read
export async function markMessageAsRead(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE)
      .update({ read: true })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error);
    throw error;
  }
}

// Delete a message
export async function deleteContactMessage(id: string): Promise<void> {
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

// Get message by ID
export async function getContactMessageById(id: string): Promise<ContactMessage | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ContactMessage;
  } catch (error) {
    handleSupabaseError(error);
    return null;
  }
}