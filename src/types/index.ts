/**
 * Common type definitions for the application.
 * Follows Section 5.3 order: top-level exports → subcomponents → helpers → static content → types
 */

// Re-export all auth types
export * from './auth';
export * from './supabase';

// User related types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

// API response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Add other shared types as needed
