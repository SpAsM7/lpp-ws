'use client';

import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentUser } from '@/lib/actions/user/get-current-user';
import type { NormalizedUserProfile } from '@/types/user';
import { useCallback } from 'react';

export type UserProfileState = {
  profile: NormalizedUserProfile | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * React Query hook for fetching and caching user profile data
 * 
 * Manages the fetching, caching, and error handling of user profile data from Airtable.
 * Uses TanStack Query for automatic background updates and caching.
 * 
 * @returns {UserProfileState} Current state of the user profile including:
 *   - profile: The normalized user profile data or null
 *   - isLoading: Whether the profile is currently being fetched
 *   - error: Any error message that occurred during fetching
 * 
 * @example
 * ```tsx
 * function ProfileComponent() {
 *   const { profile, isLoading, error } = useUserProfile();
 *   
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorDisplay error={error} />;
 *   
 *   return <UserProfile data={profile} />;
 * }
 * ```
 * 
 * @sideEffects
 * - Makes server action calls to fetch user data
 * - Shows toast messages on errors
 * - Caches responses for 5 minutes
 */
export function useUserProfile(): UserProfileState {
  const { toast } = useToast();

  // Memoize the error handler to prevent unnecessary re-renders
  const handleError = useCallback((err: Error) => {
    toast({
      title: 'Profile Error',
      description: err.message,
      variant: 'destructive',
    });
  }, [toast]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const result = await getCurrentUser();
      
      if (!result.isSuccess || !result.data) {
        throw new Error(result.error || 'Failed to fetch profile');
      }

      return result.data;
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    gcTime: 30 * 60 * 1000,   // Keep in cache for 30 minutes
    meta: {
      errorHandler: handleError
    }
  });

  return {
    profile: data || null,
    isLoading,
    error: error ? (error as Error).message : null
  };
}
