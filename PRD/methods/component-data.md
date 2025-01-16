```markdown
# Component Data Usage Rules

> **Documentation Guidelines**  
> - Keep this as a **quick reference** for front-end data patterns  
> - Emphasize **React Query**, **error handling**, **loading states**, and **component organization**  
> - **Do not** include detailed implementation code snippets (only references to files/hooks)  

---

## Overview

- **React Query** is our primary data-fetching library in components.  
- We handle **loading** with skeletons (via shadcn or similar).  
- We handle **errors** with structured messages or toasts.  
- We **never** call Airtable directly in component code (all data must come from domain services).  

---

## Folder & File Structure

```
src/components/
  providers/
    query-provider.tsx  // Global React Query context
    ...
  ...
src/lib/domains/
  <domain>/
    hooks/
      use-<something>.ts // Domain-level React Query hooks for data fetching
  ...
```

### Query Provider
- **Location**: `src/components/providers/query-provider.tsx`  
  - Exports a `QueryClientProvider` (React Query context)  
  - Maintains a stable `QueryClient` instance (usually via `useRef`)  
  - Default config: `staleTime = 5 minutes`, `retry = 3`, etc.  

---

## React Query Patterns

### 1. Domain Hooks

- **Location**: `src/lib/domains/<domain>/hooks/`  
  - Provide a single function per data scenario (e.g. `useUserProfile()`, `useDocument()`).  
- **Must**:
  - Encapsulate the actual query key, fetch function, and any transforms.
  - Return `{ data, error, isLoading, ... }` in typical React Query style.

### 2. Loading States

- Use **skeleton** components (e.g., from `shadcn/ui`) to show placeholder UI when `isLoading` is true.  
- **Must** not block rendering logic on loading states; skeleton or spinner is expected.

### 3. Error Handling

- When `error` is truthy, show a user-friendly message (toast or inline).
- Log the error to the console or external service for debugging.
- **Must** not leak sensitive details (stack traces, tokens, etc.) to the user.

### 4. Data Transform & Access Checks

- **Must** rely on domain-layer transforms (e.g., `transforms.ts`) rather than modifying data in the component.  
- **Must** not attempt to do direct access checks in the component.  
- **Must** trust the domain service or hook for returning only authorized data.

---

## Shadcn UI Integration

1. **Skeletons**: Provide placeholders for list items, detail pages, etc.  
2. **Buttons & Alerts**: Show consistent styling for retry actions or error states.  
3. **Do** prefer consistent design tokens and theming across loading and error states.

---

## Must / Must Not Summary

1. **Must** use domain-level hooks (e.g. `useUserProfile()`) for data in components.  
2. **Must** show loading skeletons (shadcn) when `isLoading` is true.  
3. **Must** show error messages or toasts when `error` is truthy.  
4. **Must** not do any direct fetch or Airtable calls in component files.  
5. **Must** not store or manipulate sensitive data in local state; rely on domain hooks.  
6. **Must** handle pagination or filtering within domain hooks if needed (avoid inline logic in components).  
7. **Must** not leak stack traces or secrets in UI error messages.