'use server'

import { queryTable } from '@/lib/airtable/client';

// Users table ID from Airtable
const USERS_TABLE_ID = 'tblEyO6PHeFXuxq4F';

export async function getUserBySupabaseId(supabaseId: string) {
  if (!supabaseId) {
    console.error('No Supabase ID provided');
    return null;
  }

  console.log('Fetching user with Supabase ID:', supabaseId);
  
  try {
    // Query users table with a filter for the specific user_id
    const users = await queryTable(USERS_TABLE_ID, {
      filterByFormula: `{user_id} = '${supabaseId}'`,
      maxRecords: 1,
      fields: ['id', 'name_first', 'name_last', 'email', 'user_id']
    });
    
    console.log('Query completed. Raw response:', users);
    
    if (!users || !users.length) {
      console.log('No user found with Supabase ID:', supabaseId);
      return null;
    }

    const user = users[0].fields;
    console.log('Raw user data:', user);
    
    if (!user.name_first || !user.name_last) {
      console.error('User data is missing required fields:', user);
      return null;
    }

    // Return a normalized user object
    const normalizedUser = {
      id: users[0].id, // Use the record ID from Airtable
      firstName: user.name_first,
      lastName: user.name_last,
      email: user.email,
      name: `${user.name_first} ${user.name_last}`.trim(),
    };
    
    console.log('Returning normalized user:', normalizedUser);
    return normalizedUser;
  } catch (error) {
    console.error('Error fetching user:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
} 