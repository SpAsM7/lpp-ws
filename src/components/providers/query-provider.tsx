'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode, useRef } from 'react'

/**
 * TanStack Query Provider for managing server state and caching
 * 
 * Provides centralized data fetching, caching, and state management for the application.
 * Configures global defaults for query behavior.
 * 
 * @param {ReactNode} children - Child components to wrap with the query provider
 * @returns {JSX.Element} Provider-wrapped children with query capabilities
 * 
 * @example
 * ```tsx
 * <QueryProvider>
 *   <YourApp />
 * </QueryProvider>
 * ```
 * 
 * @sideEffects
 * - Creates and maintains a QueryClient instance
 * - Manages cache lifecycle and garbage collection
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  // Use ref to maintain the same client instance across renders
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          // Consider data fresh for 5 minutes
          staleTime: 5 * 60 * 1000,
          // Keep unused data in cache for 30 minutes
          gcTime: 30 * 60 * 1000,
          // Retry failed requests 3 times
          retry: 3,
          // Allow initial data fetch
          refetchOnMount: true,
          // Prevent unnecessary refetches
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
      },
    })
  ).current

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
