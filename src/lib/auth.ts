import { supabase } from './supabase';
import { initializeDatabase } from './database';

let isInitialized = false;

export async function initializeAuth() {
  if (!isInitialized) {
    try {
      await initializeDatabase();
      isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      throw error;
    }
  }
}

export async function createOrUpdateProfile(userId: string, email: string, fullName: string) {
  try {
    await initializeAuth();

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          email,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to create/update profile:', error);
    throw error;
  }
}