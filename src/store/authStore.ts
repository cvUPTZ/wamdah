import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { createOrUpdateProfile } from '../lib/auth';
import type { User } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,

    setState: (partial) => set(partial),

  clearError: () => set({ error: null }),

  checkAuthStatus: async () => {
    try {
      set({ loading: true, error: null });
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No active session
        set({ 
          user: null, 
          loading: false, 
          isAuthenticated: false 
        });
        return;
      }

      // Verify the session is valid and not expired
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        set({ 
          user: null, 
          loading: false, 
          isAuthenticated: false 
        });
        return;
      }

      // Create or update profile
      const profile = await createOrUpdateProfile(
        authUser.id,
        authUser.email || '',
        authUser.user_metadata?.full_name || ''
      );

      set({ 
        user: profile, 
        loading: false, 
        isAuthenticated: true 
      });
    } catch (error) {
      console.error('Check auth status error:', error);
      set({ 
        user: null,
        error: error instanceof Error ? error.message : 'Failed to check authentication status',
        loading: false,
        isAuthenticated: false
      });
    }
  },

  signUp: async (email, password, fullName) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      
      if (error) throw error;
      if (!data.user) throw new Error('No user returned from sign up');
      
      const profile = await createOrUpdateProfile(data.user.id, email, fullName);
      
      set({ 
        user: profile, 
        loading: false, 
        isAuthenticated: true 
      });
    } catch (error) {
      console.error('Sign up error:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
        user: null,
        isAuthenticated: false
      });
      throw error;
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      if (!data.user) throw new Error('No user returned from sign in');
      
      const profile = await createOrUpdateProfile(
        data.user.id,
        data.user.email || '',
        data.user.user_metadata?.full_name || ''
      );
      
      set({ 
        user: profile, 
        loading: false, 
        isAuthenticated: true 
      });
    } catch (error) {
      console.error('Sign in error:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
        user: null,
        isAuthenticated: false
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ 
        user: null, 
        loading: false, 
        isAuthenticated: false,
        error: null
      });
    } catch (error) {
      console.error('Sign out error:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
        user: null,
        isAuthenticated: false
      });
      throw error;
    }
  },
}));