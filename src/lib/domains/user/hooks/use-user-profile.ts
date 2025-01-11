'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserBySupabaseId } from '@/lib/actions/user-actions';
import { type NormalizedUserProfile } from '@/types/user';
import { supabase } from '@/lib/supabase/client';

/**
 * Hook to fetch and manage user profile data
 * @param supabaseId - Optional Supabase auth ID. If not provided, uses the current user's ID
 * @returns Query result containing the user profile data and loading/error states
 */
export function useUserProfile(supabaseId?: string) {
  return useQuery<NormalizedUserProfile>({
    queryKey: ['user-profile', supabaseId],
    queryFn: async () => {
      // If no specific user ID provided, get current user
      if (!supabaseId) {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          throw new Error('No authenticated user');
        }
        supabaseId = user.id;
      }

      const response = await getUserBySupabaseId(supabaseId);
      if (!response.isSuccess || !response.data) {
        throw new Error(response.error ?? 'Failed to fetch user profile');
      }
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep unused data in cache for 10 minutes
    enabled: true,
  });
}
