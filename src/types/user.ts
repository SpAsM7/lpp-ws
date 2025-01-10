import { z } from 'zod';

// Zod schema for validating user profile data from Airtable
export const userProfileSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  name: z.string(),
  avatar: z.string().optional(),
});

// TypeScript type derived from the schema
export type UserProfile = z.infer<typeof userProfileSchema>;

// Type for the normalized user profile response
export type NormalizedUserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  avatar?: string;
};

// Type for user action responses
export type UserActionResponse<T> = {
  data?: T;
  error?: string;
  isSuccess: boolean;
};
