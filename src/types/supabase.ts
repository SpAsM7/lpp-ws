/**
 * Type definitions for Supabase database.
 * We only use Supabase for authentication, not data storage.
 * Auth types are imported from @supabase/supabase-js
 */

export interface Database {
  public: {
    Tables: {
      // We don't use Supabase tables - all data is in Airtable
      // This is just for type completion with the Supabase client
    }
    Views: {
      // We don't use Supabase views
    }
    Functions: {
      // We don't use Supabase functions
    }
    Enums: {
      // We don't use Supabase enums
    }
  }
} 