'use server'

import { scanUsers, AirtableError } from '@/lib/airtable/client';
import { userProfileSchema, type UserActionResponse, type NormalizedUserProfile } from '@/types/user';
import { logger } from '@/lib/logger';

// Users table name from Airtable
const USERS_TABLE_ID = 'Users';  // Table names are case-sensitive in Airtable

/**
 * Fetches a user's profile from Airtable using their Supabase ID
 * @param supabaseId - The user's Supabase auth ID
 * @returns Promise<UserActionResponse<NormalizedUserProfile>> - The normalized user profile or error
 */
export async function getUserBySupabaseId(
  supabaseId: string
): Promise<UserActionResponse<NormalizedUserProfile>> {
  if (!supabaseId) {
    logger.error('getUserBySupabaseId.validation.error', {
      error: 'No Supabase ID provided',
      supabaseId
    });
    return {
      error: 'No Supabase ID provided',
      isSuccess: false
    };
  }

  try {
    logger.info('getUserBySupabaseId.fetch.start', { supabaseId });
    
    // Query users table with a filter for the specific user_id
    const users = await scanUsers(
      `{user_id} = '${supabaseId}'`,
      1
    );
    
    if (!users || users.length === 0) {
      logger.warn('getUserBySupabaseId.fetch.notFound', { supabaseId });
      return {
        error: 'User not found',
        isSuccess: false
      };
    }

    const user = users[0];
    
    // Extract avatar URL from the first attachment if it exists
    // We keep the schema simple (string[] | null) but Airtable returns objects
    const avatarUrl: string | null = user.avatar?.[0] ?? null;
    
    const rawUser: NormalizedUserProfile = {
      id: user.id,
      firstName: user.name_first ?? '',
      lastName: user.name_last ?? '',
      email: user.email ?? '',
      name: `${user.name_first ?? ''} ${user.name_last ?? ''}`.trim(),
      avatar: avatarUrl,
    };

    // Validate the user data against our schema
    const validationResult = userProfileSchema.safeParse(rawUser);
    
    if (!validationResult.success) {
      logger.error('getUserBySupabaseId.validation.failed', {
        supabaseId,
        userId: user.id,
        error: validationResult.error
      });
      return {
        error: 'Invalid user data format',
        isSuccess: false
      };
    }

    logger.info('getUserBySupabaseId.success', { 
      supabaseId,
      userId: user.id 
    });

    return {
      data: validationResult.data,
      isSuccess: true
    };
  } catch (error) {
    logger.error('getUserBySupabaseId.error', {
      supabaseId,
      error: error instanceof Error ? error.message : String(error)
    });
    
    return {
      error: error instanceof AirtableError 
        ? 'Failed to fetch user profile from Airtable'
        : 'An unexpected error occurred',
      isSuccess: false
    };
  }
}