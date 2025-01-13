terms references in login

toasts persist sometimes

move use-toast to hooks folder

auth comonents may need a doc update in the rules

the auth animation does funny scaling when the window is resized

password reset flow is not working--it goes directly to home becuase of active session. Need to decided how to handle. Could split the sessions and force a new login or could just send the user directly to the update password page inside the app.

make auth a route group

centralized airtable caching, just put a clock on things so we don't overload the database


# Working Status

# Airtable User Profile Integration Plan

## Overview
Integrate user profile data from Airtable into the side menu avatar component, replacing the hardcoded "John Doe" with actual user data.

## Implementation Steps

### 1. Verify Existing Infrastructure 
- [x] Confirmed users table exists in Airtable with fields:
  - name_first
  - name_last
  - email
  - user_id (links to Supabase ID)
- [x] Verified `getUserBySupabaseId` server action exists
- [x] Schema types are already generated

### 2. Component Updates 
- [x] Added state management for user profile data
- [x] Added loading state handling
- [x] Added error state handling
- [x] Replaced hardcoded user data with dynamic data

### 3. Data Flow Implementation 
- [x] Created User Profile Hook
- [x] Integrated with Supabase auth
- [x] Implemented loading and error states
- [ ] Implement caching with TanStack Query

### 4. Error Handling 
- [x] Handle missing Supabase user
- [x] Handle missing Airtable profile
- [x] Handle network errors
- [x] Show appropriate error messages to user

### 5. Testing 
- [ ] Test scenarios to verify:
  - [ ] Successful profile load
  - [ ] Loading states
  - [ ] Error states
  - [ ] Network failure recovery
  - [ ] Missing data handling

### 6. Performance Considerations 
- [ ] Implement caching:
  - [ ] Cache profile data with TanStack Query
  - [ ] Implement proper revalidation
  - [ ] Handle stale data scenarios

## Current Status
- First pass implementation is complete 
- Need to implement caching and testing before production ready 

## Next Steps
1. Implement TanStack Query for caching
2. Write and execute test scenarios
3. Verify performance with caching

## Dependencies
- Supabase Client
- Airtable Integration
- UI Components (Avatar, Loading Skeletons)
- Toast Notifications for Error States

## Known Issues & TODOs

### Airtable Integration & Caching
1. **Client Implementation**
   - [x] Add environment variable validation in Airtable client initialization
   - [x] Move hardcoded table IDs to environment configuration
   - [x] Implement Zod schema validation for API responses

2. **Caching & Query Configuration**
   - [ ] Review and adjust TanStack Query staleTime settings for different data types
   - [ ] Enable refetchOnReconnect for better offline recovery
   - [ ] Add error boundary configuration for failed queries
   - [ ] Configure retry delays to prevent API rate limiting

3. **Type Safety**
   - [ ] Define explicit UserTableRecord type instead of Zod inference
   - [ ] Add runtime type validation for Airtable responses
   - [ ] Implement strict type checking for table field access

4. **Server Operations**
   - [ ] Add proper pagination to scanUsers function
   - [ ] Implement rate limiting for Airtable API calls
   - [ ] Add error logging strategy

5. **Documentation & Security**
   - [ ] Document error handling strategies
   - [ ] Document caching behaviors and invalidation strategies
   - [ ] Complete JSDoc comments for public functions
   - [ ] Implement API key rotation support
   - [ ] Add request timeout configurations
   - [ ] Set up API request auditing

## Notes
- Keep default avatar placeholder for now
- Ensure proper error messages for user feedback
- Follow existing patterns for loading states
- Maintain type safety throughout implementation
