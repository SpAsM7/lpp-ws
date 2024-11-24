// Common type definitions for the application

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
