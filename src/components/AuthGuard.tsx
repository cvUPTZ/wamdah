import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { createOrUpdateProfile } from '../lib/auth';
import { LoadingSpinner } from './LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, loading, setState } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Define the checkAuthStatus function
  const checkAuthStatus = async () => {
    try {
      // Update loading state
      setState({ loading: true, error: null });

      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No active session
        setState({ 
          user: null, 
          loading: false, 
          isAuthenticated: false 
        });
        setIsInitialized(true);
        return;
      }

      // Verify the session is valid and not expired
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setState({ 
          user: null, 
          loading: false, 
          isAuthenticated: false 
        });
        setIsInitialized(true);
        return;
      }

      // Create or update profile
      const profile = await createOrUpdateProfile(
        authUser.id,
        authUser.email || '',
        authUser.user_metadata?.full_name || ''
      );

      setState({ 
        user: profile, 
        loading: false, 
        isAuthenticated: true 
      });
      setIsInitialized(true);
    } catch (error) {
      console.error('Check auth status error:', error);
      setState({ 
        user: null,
        error: error instanceof Error ? error.message : 'Failed to check authentication status',
        loading: false,
        isAuthenticated: false
      });
      setIsInitialized(true);
    }
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // If not yet initialized, show loading
  if (!isInitialized || loading) {
    return <LoadingSpinner />;
  }

  // If authentication is required but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authentication is not required or user is authenticated, render children
  return <>{children}</>;
}