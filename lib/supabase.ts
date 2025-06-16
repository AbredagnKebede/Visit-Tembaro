import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): never {
  // Log the full error for debugging
  console.error('Supabase error:', {
    message: error?.message || 'Unknown error',
    details: error?.details || 'No details available',
    hint: error?.hint || 'No hint available',
    code: error?.code || 'No error code',
    error
  });

  // Throw a more user-friendly error
  throw new Error(
    error?.message || 
    error?.details || 
    error?.hint || 
    'An error occurred with the database'
  );
}

// Function to set up RLS policies
export async function setupRLSPolicies() {
  try {
    // Enable RLS on cultural_items table
    await supabase.rpc('enable_rls', { table_name: 'cultural_items' });

    // Create policy for authenticated users to read all cultural items
    await supabase.rpc('create_policy', {
      table_name: 'cultural_items',
      policy_name: 'Allow authenticated users to read cultural items',
      definition: 'SELECT',
      using: 'auth.role() = \'authenticated\''
    });

    // Create policy for authenticated users to insert cultural items
    await supabase.rpc('create_policy', {
      table_name: 'cultural_items',
      policy_name: 'Allow authenticated users to insert cultural items',
      definition: 'INSERT',
      using: 'auth.role() = \'authenticated\''
    });

    // Create policy for authenticated users to update cultural items
    await supabase.rpc('create_policy', {
      table_name: 'cultural_items',
      policy_name: 'Allow authenticated users to update cultural items',
      definition: 'UPDATE',
      using: 'auth.role() = \'authenticated\''
    });

    // Create policy for authenticated users to delete cultural items
    await supabase.rpc('create_policy', {
      table_name: 'cultural_items',
      policy_name: 'Allow authenticated users to delete cultural items',
      definition: 'DELETE',
      using: 'auth.role() = \'authenticated\''
    });

    // Create policy for public to read cultural items
    await supabase.rpc('create_policy', {
      table_name: 'cultural_items',
      policy_name: 'Allow public to read cultural items',
      definition: 'SELECT',
      using: 'true'
    });

    console.log('RLS policies set up successfully');
  } catch (error) {
    console.error('Error setting up RLS policies:', error);
    throw error;
  }
} 