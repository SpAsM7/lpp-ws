# LP Portal: component-requirements.md

**Version:** 1.0  
**Date:** 12-31-24  

## Overview

This document outlines the **UI-first** breakdown of the LP Portal, listing the components/pages in the order they should be developed. Each section describes the visual components first, then the logic and data integrations required to complete the feature. **All** code must adhere to the rules in `coding-rules.md` (naming conventions, file placement, environment usage, etc.).

---

## **1. Application Shell & Layout**

### **1.1 Shell Structure**

**Reference:** `1.1.x`  

- **1.1.1 Minimal Layout**  
  - **Requirement**: Create a bare-bones Next.js layout that displays a simple "Hello, LP Portal" message and can route between pages (e.g., "/home", "/auth/login") without errors.  
  - **Acceptance Criteria**:  
    - A top-level layout file that wraps all pages.  
    - Basic test navigation links (e.g., "Home," "Login").  
    - No business logic; purely a structural placeholder.
    - Proper code splitting for routes configured.
    - Lazy loading set up for heavy components.

- **1.1.2 Basic Global Styling**  
  - **Requirement**: Ensure Tailwind + shadcn UI base styles are configured.  
  - **Acceptance Criteria**:  
    - Tailwind is correctly set up (see `coding-rules.md` for example).  
    - `globals.css` or equivalent includes minimal resets.  
    - No conflicting or duplicated CSS frameworks.

- **1.1.3 Directory Layout**  
  - **Requirement**: Maintain the recommended folder structure (`/app`, `/src/lib`, etc.) from `coding-rules.md`.  
  - **Acceptance Criteria**:  
    - Placeholder directories for "(auth)" pages, "(dashboard)" pages, `src/lib/airtable`, etc.  
    - `.env.example` present with placeholders for environment variables.  

#### **Logic & Data Integration**  
- None required at this stage. Layout is purely UI scaffolding.

---

### **1.2 Header / Branding**

**Reference:** `1.2.x`  

- **1.2.1 Header UI**  
  - **Requirement**: Build a header with a placeholder brand name (e.g., “Emberline”).  
  - **Acceptance Criteria**:  
    - Visual alignment with the project’s brand concept (or placeholder if brand concept not finalized).  
    - The header is **visible** and **fixed** at the top of all pages.  

- **1.2.2 Quick Nav Elements**  
  - **Requirement**: Include minimal links: “Home,” “Companies,” “Investments,” “Documents,” “Accounts,” etc.  
  - **Acceptance Criteria**:  
    - Each link navigates (or attempts to navigate) to a corresponding route.  
    - Visual feedback on hover and active states (shadcn classes or tailwind).  

#### **Logic & Data Integration**  
- **1.2.3** (Future) Display the **logged-in user’s name** once Auth is implemented.  
- **1.2.4** (Future) “Sign Out” or “Profile” link to appear if user is authenticated.

---

### **1.3 Sidebar / Main Content**

**Reference:** `1.3.x`  

- **1.3.1 Sidebar Structure**  
  - **Requirement**: Optionally create a left sidebar (if needed) that can collapse or expand.  
  - **Acceptance Criteria**:  
    - Mobile-friendly toggling (open/close) is present or stubbed out.  
    - The main content area is clearly separated from the sidebar.  

- **1.3.2 Responsive Layout**  
  - **Requirement**: Ensure the layout (header + sidebar + main area) adapts to different viewport sizes.  
  - **Acceptance Criteria**:  
    - On narrow screens, sidebar collapses or becomes a drawer.  
    - No horizontal scrollbars if properly done.  

#### **Logic & Data Integration**  
- **1.3.3** (Future) Menu items conditionally visible based on user role (e.g., “Admin”).  

---

## **2. Authentication Flows**

### **2.1 Login Page (UI-First)**

**Reference:** `2.1.x`  

- **2.1.1 Layout & Fields**  
  - **Requirement**: Create a login screen with **Email** and **Password** fields, plus a “Sign In” button.  
  - **Acceptance Criteria**:  
    - Centered form or minimal, brand-aligned layout.  
    - Basic validation states (highlight empty fields on submit).  

- **2.1.2 Error Alert UI**  
  - **Requirement**: Placeholder area to show “Invalid email/password” messages.  
  - **Acceptance Criteria**:  
    - Visible alert box or message area.  
    - The message can be replaced with real error handling later.  

#### **Logic & Data Integration**  
- **2.1.3** Hook up the form to Supabase sign-in function.  
- **2.1.4** On success → redirect to “/home” or “/dashboard.”  
- **2.1.5** On error → display actual error in the alert area.  

---

### **2.2 Signup Page (UI-First)**

**Reference:** `2.2.x`  

- **2.2.1 Fields & Layout**  
  - **Requirement**: Create a sign-up screen with **Email**, **Password**, **Confirm Password**, and “Create Account” button.  
  - **Acceptance Criteria**:  
    - Form is visually distinct from login.  
    - “Password mismatch” placeholder UI if passwords differ.  

- **2.2.2 Success & Error Messages**  
  - **Requirement**: Visual placeholders for “Signup successful” or “Signup failed.”  

#### **Logic & Data Integration**  
- **2.2.3** Connect to Supabase sign-up endpoint.  
- **2.2.4** On success → store user data, redirect or show “Welcome.”  
- **2.2.5** On error → highlight fields or show error message.  

---

### **2.3 Password Reset & Email Verification**

**Reference:** `2.3.x`  

- **2.3.1 Reset Request Page (UI)**  
  - **Requirement**: Simple form with “Enter your email” + “Send Reset Link” button.  
  - **Acceptance Criteria**:  
    - Confirmation placeholder: “If that email exists, a link has been sent.”

- **2.3.2 Reset Confirmation Page (UI)**  
  - **Requirement**: “Enter new password” + “Confirm password” + “Update Password.”  

- **2.3.3 Email Verification Page (UI)**  
  - **Requirement**: “Your email has been verified” or “Verification failed” message.  

#### **Logic & Data Integration**  
- **2.3.4** Link to real Supabase reset flows (magic links, tokens, etc.).  
- **2.3.5** If user is verified → show success screen and possibly auto-redirect.  

---

## **3. Home (Dashboard) Page**

### **3.1 Dashboard Layout (UI-Only)**

**Reference:** `3.1.x`  

- **3.1.1 Greeting / Basic Info**  
  - **Requirement**: “Welcome, [UserName]!” placeholder.  
  - **Acceptance Criteria**:  
    - If the user is unknown, show a default greeting like “Welcome, Investor!”  

- **3.1.2 Quick Stats / Summary Cards**  
  - **Requirement**: Up to 4 summary cards (e.g., “Total NAV,” “# of Investments”).  
  - **Acceptance Criteria**:  
    - Hardcoded numbers or placeholders initially.  
    - Visual consistency (shadcn cards, icons).  

- **3.1.3 Recent Activity Panel**  
  - **Requirement**: A vertical list or timeline style for “recent docs,” “recent calls,” or “news.”  
  - **Acceptance Criteria**:  
    - Placeholder items with date/time, short descriptions.  

#### **Logic & Data Integration**  
- **3.1.4** Replace placeholders with actual user name from Supabase after login.  
- **3.1.5** Fetch real stats from Airtable (investments, docs) → fill summary cards.  
- **3.1.6** List real “recent activity” from the “Events/Activities” table in Airtable.  

---

## **4. Companies Page**

### **4.1 Companies List**

**Reference:** `4.1.x`  

- **4.1.1 Listing Layout**  
  - **Requirement**: Grid, cards, or table showing each company’s **logo**, **name**, short description.  
  - **Acceptance Criteria**:  
    - A placeholder or “No companies found” message if empty.  
    - Visible “View Details” button or link.  

- **4.1.2 Search & Filter UI**  
  - **Requirement**: Text input (search by name), plus optional filter (industry, status).  
  - **Acceptance Criteria**:  
    - Appears above or alongside the list.  
    - For now, only filters the placeholder data.

#### **Logic & Data Integration**  
- **4.1.3** Query Airtable for the **Companies** table.  
- **4.1.4** Show results restricted to user’s `supabase_uuid` (if relevant).  
- **4.1.5** Implement search/filter on the returned data.  

---

### **4.2 Company Detail View**

**Reference:** `4.2.x`  

- **4.2.1 Company Profile UI**  
  - **Requirement**: A detail page showing the company’s logo, name, founding date, website link, etc.  
  - **Acceptance Criteria**:  
    - Basic styling with a clear heading.  
    - Possibly a sub-navigation for “Metrics,” “Documents,” “Updates,” etc.

- **4.2.2 Key Metrics Display**  
  - **Requirement**: Revenue, EBITDA, headcount placeholders. Possibly a small chart.  
  - **Acceptance Criteria**:  
    - Visual blocks or cards with numeric data.  
    - Optionally show growth or trends if we embed a chart placeholder.

- **4.2.3 Related Documents or Reports**  
  - **Requirement**: A small table or list showing relevant attachments.  
  - **Acceptance Criteria**:  
    - Each item has a “Download” or “View” button (not active yet).  

#### **Logic & Data Integration**  
- **4.2.4** Fetch a **single company** by an ID from Airtable.  
- **4.2.5** If no record is found, display “Company not found.”  
- **4.2.6** Link documents from the “Documents” table that match this company’s ID.

---

## **5. Investments Page**

### **5.1 Investment List**

**Reference:** `5.1.x`  

- **5.1.1 Table UI**  
  - **Requirement**: Column headings: “Company,” “Account,” “Capital Invested,” “Current NAV,” “Return %,” etc.  
  - **Acceptance Criteria**:  
    - Sortable columns (placeholder icons or arrow UI).  
    - Basic paginated or scrolling approach.

- **5.1.2 Search & Filter**  
  - **Requirement**: A top-level search box to filter by company name or account.  
  - **Acceptance Criteria**:  
    - “No investments found” if filter returns zero items.

#### **Logic & Data Integration**  
- **5.1.3** Fetch **Investments** from Airtable.  
- **5.1.4** Filter by user’s `supabase_uuid` for permission.  
- **5.1.5** Implement sorting (e.g., by “Return %” or “NAV”).  

---

### **5.2 Investment Detail (Optional)**

**Reference:** `5.2.x`  

- **5.2.1 Detailed View**  
  - **Requirement**: Show deeper data (distributions, historical performance chart, etc.).  
  - **Acceptance Criteria**:  
    - Clear reference to the associated company and account.  
    - Possibly a mini timeline of capital calls, distributions.

#### **Logic & Data Integration**  
- **5.2.2** (If used) Pull from a separate “Investment History” or “Events” table in Airtable.

---

## **6. Accounts & Teams Page**

### **6.1 Accounts Overview**

**Reference:** `6.1.x`  

- **6.1.1 List of User Accounts**  
  - **Requirement**: Show each account name, type (e.g., Individual, Trust), and the user’s role.  
  - **Acceptance Criteria**:  
    - “No accounts found” if the user has none.  
    - Minimal layout with a “View Team” or “Manage Team” link.

#### **Logic & Data Integration**  
- **6.1.2** Fetch from the “Accounts” table in Airtable.  
- **6.1.3** Pull the user’s role from the “Roles” table (e.g., Admin, Viewer).

---

### **6.2 Team Management UI**

**Reference:** `6.2.x`  

- **6.2.1 User List for an Account**  
  - **Requirement**: Display all users who have access (their names, emails, roles).  
  - **Acceptance Criteria**:  
    - Potentially a table with columns “User,” “Role,” “Actions.”  

- **6.2.2 Self-Removal Button**  
  - **Requirement**: If the user is Editor or Viewer, show a “Remove Myself” button.  
  - **Acceptance Criteria**:  
    - If user is Signer, no removal. If user is Admin, can’t remove themself if rules forbid it.  

#### **Logic & Data Integration**  
- **6.2.3** Query “Roles” table for the selected account → join with “User_Profiles.”  
- **6.2.4** On removing self, call a server action that updates Airtable → remove user from “Allowed_Users” or the “Roles” table.

---

## **7. Documents Page**

### **7.1 Document List**

**Reference:** `7.1.x`  

- **7.1.1 Table / Card Layout**  
  - **Requirement**: Show doc title, date, doc type (K-1, statement, etc.).  
  - **Acceptance Criteria**:  
    - A “preview” or “download” placeholder button.  
    - “No documents” if empty.

- **7.1.2 Search & Filtering**  
  - **Requirement**: Input to search by doc title or filter by doc type.  
  - **Acceptance Criteria**:  
    - Filter UI at the top of the page.  
    - Real-time or on-submit filtering (placeholder for now).

#### **Logic & Data Integration**  
- **7.1.3** Query “Documents” in Airtable → only return docs with user’s `supabase_uuid` in “Allowed_Users.”  
- **7.1.4** Implement actual search/filter on the result set.

---

### **7.2 Document Preview**

**Reference:** `7.2.x`  

- **7.2.1 Preview UI**  
  - **Requirement**: Modal or full-screen overlay to show a PDF preview.  
  - **Acceptance Criteria**:  
    - Basic loader or skeleton while the PDF is loading.  
    - A “Download” or “Close Preview” button.

#### **Logic & Data Integration**  
- **7.2.2** Use the Airtable attachment URL (if provided).  
- **7.2.3** Gate the user from seeing it if they lack permission.

---

## **8. Activity Logging & Feeds (Optional)**

### **8.1 Activity Feed UI**

**Reference:** `8.1.x`  

- **8.1.1 Timeline or List**  
  - **Requirement**: “User X downloaded Document Y at [time]” style items.  
  - **Acceptance Criteria**:  
    - Sort by recent date.  
    - Placeholder icons for doc downloads vs. investment changes.

#### **Logic & Data Integration**  
- **8.1.2** Query “Events/Activities” in Airtable, filter by user or account.  
- **8.1.3** Show only relevant items based on permissions.

---

## **9. Future Enhancements**

### **9.1 Notifications (Optional)**

**Reference:** `9.1.x`  

- **9.1.1 Notification Bell**  
  - **Requirement**: Small icon in header with a badge for unread items.  
  - **Acceptance Criteria**:  
    - Dropdown or panel listing new docs or system alerts.

#### **Logic & Data Integration**  
- **9.1.2** Possibly store notifications in a separate Airtable table.  
- **9.1.3** Mark notifications as read upon opening.

---

## **10. Finishing Touches & Testing**

### **10.1 UI/UX Polish**

**Reference:** `10.1.x`  

- **10.1.1 Finalize Theming**  
  - **Requirement**: Ensure consistent usage of the shadcn UI Zinc theme.  
  - **Acceptance Criteria**:  
    - All components follow the same font, spacing, color styles from theming.  

- **10.1.2 Accessibility & Responsive Check**  
  - **Requirement**: Keyboard navigation, screen reader labels, mobile layout.  
  - **Acceptance Criteria**:  
    - No major WCAG 2.1 AA violations.  
    - Layouts adapt smoothly to phone/tablet dimensions.

---

### **10.2 Integration Testing**

**Reference:** `10.2.x`  

- **10.2.1 Verify Auth**  
  - **Requirement**: Confirm login, signup, and password reset flows function end-to-end.  
  - **Acceptance Criteria**:  
    - Logging in with correct creds routes user to Dashboard.  
    - Incorrect creds show the correct error.  

- **10.2.2 Verify Data Fetch**  
  - **Requirement**: Confirm each page fetches real Airtable data.  
  - **Acceptance Criteria**:  
    - Companies page loads real list from “Companies” table.  
    - Documents page filters only user-permitted docs.  

- **10.2.3 Permissions**  
  - **Requirement**: Confirm row-level filtering is correct.  
  - **Acceptance Criteria**:  
    - Users do not see data that isn’t assigned to them in Airtable.  

---

## Closing Notes

- **File Referencing**: Remember to keep each component under logical folders (`app/(dashboard)/`, `app/(auth)/`, etc.), and adhere to `coding-rules.md` for function names, environment usage, and error handling.  
- **Incremental Approach**: Complete each **UI piece** first, confirm layout and styling, and **then** integrate the required logic and data.  
- **Iterative Improvements**: As UI elements become common or reused across multiple pages, we may move them into `src/components/` for shared usage.  