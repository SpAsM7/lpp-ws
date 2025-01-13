'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.delete(name);
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, error: error?.message || 'No user found' };
  }

  return { success: true, data: user };
} 