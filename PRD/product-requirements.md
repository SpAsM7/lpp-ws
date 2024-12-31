# LP Portal Product Requirements Document (PRD)

**Version:** 2.3  
**Date:** 12-31-24  

---

## 1. Overview

The **LP Portal** is a secure, user-friendly web application enabling limited partners (LPs) to access and manage their investment documents, portfolio updates, and fund performance metrics. It provides:

- User authentication  
- User-specific content visibility  
- Document storage  
- An interface for efficient browsing/searching of LP-related data  

General Partners (GPs) handle all administrative tasks (e.g., uploads, permissions) directly via Airtable.

### 1.1 Key Objectives

1. **User Experience & Interface**  
   - Deliver a streamlined interface that aligns with how investors view their investments  
   - Enable intuitive navigation of positions, documents, and financial reports  

2. **Security & Data Management**  
   - Use Supabase for secure user sign-up, login, and authentication tokens  
   - Rely on Airtable for LP data, user profiles, documents, and multi-account role assignments  
   - Enforce user-specific content visibility through a custom permissions model  
   - GPs manage data and permissions directly in Airtable  

3. **Communication & Clarity**  
   - Provide straightforward access to newsletters, reports, and updates  
   - Address LP confusion around multiple accounts, offering clear breakdowns  
   - Maintain an effective communication channel between LPs and administrators  

4. **Scalability & Performance**  
   - Support up to ~1,000 users with responsive performance  
   - Optimize for efficient data retrieval and display  

### 1.2 Scope and Limitations

- **Scope**  
  - Manage investments, multiple accounts, associated documents, and communication updates  
  - Accessible via modern web browsers (desktop/mobile)

- **Limitations**  
  - No advanced analytics, third-party financial planning tools, or GP Portal features in this release  
  - Current focus on investment tracking, document management, and streamlined authentication  
  - **E-Signature** is **not** included in this portal. A separate Pandadocs integration handles document signing via Airtable user data. Future versions may add direct e-sign integration.

---

## 2. User Management

### 2.1 User Roles & Teams

#### 2.1.1 LP Roles

- **Signer**  
  - Primary owner of an account with full access  
  - Removal or role change only by GP Admin  

- **Admin**  
  - All actions except legal document signing  
  - Can remove themselves from an account  

- **Editor**  
  - Same as Admin but cannot add or remove team members  
  - Can remove themselves  

- **Viewer**  
  - Read-only access  
  - Can remove themselves  

#### 2.1.2 GP Management

- GPs manage all platform administration through Airtable  
- GPs do not access the LP web application  
- GP tasks (document uploads, user management, permissions) happen in Airtable  
- GPs can pre-register LP users by creating email-based records in Airtable  

#### 2.1.3 Team Structure & Role Storage

- Each LP account has a dedicated team  
- An LP user may have different roles (e.g., Admin, Editor, Viewer) across multiple accounts  
- **Role assignments** are stored in Airtable in a dedicated roles table, linking:  
  1. A user profile (`supabase_uuid`)  
  2. A specific account  
  3. The assigned role  

### 2.2 Use Cases

#### 2.2.1 LP Registration & Authentication Flow

1. **New User Sign-up**  
   - User signs up via Supabase Auth  
   - The system checks Airtable for a record matching the user’s email  
   - If a match is found:  
     - Update the existing Airtable record with the Supabase UUID  
     - User inherits all pre-configured permissions  
   - If no match:  
     - Create a new Airtable user record with the Supabase UUID  

2. **LP Login & Dashboard Access**  
   - LP authenticates via Supabase  
   - LP's Supabase UUID is retrieved from the JWT  
   - Serverless functions on Vercel query Airtable, filtering records by “allowed user UUIDs”  
   - LP sees a dashboard of authorized documents, investments, and metrics  

#### 2.2.2 Permission Management

1. GP manages permissions in Airtable (e.g., “Documents” table)  
2. GP links LP user records (with UUIDs) to the “Allowed_Users” field  
3. Airtable’s linked/lookup fields produce a list of permitted `supabase_uuid`s  
4. The serverless code checks this list when the LP queries the portal  

#### 2.2.3 Document Upload & Storage

1. GP uploads PDFs directly to Airtable’s “Documents” table  
2. Attachment URL + metadata (title, date, related investment) are stored  
3. Serverless functions only return documents containing the LP’s UUID in permission fields  

---

## 3. Technical Architecture

### 3.1 System Overview

#### 3.1.1 High-Level Diagram

```
|--------|       |-------------|      |---------|
|  Client| ----> |   Vercel    | ---> | Airtable| (GP Mgmt)
|  (Next)| <---- | Serverless  | <--- |---------|
|--------|       |  Functions  |
        |             ^   ^
        |             |   |
        v             |   |
    |---------|        |   |
    | Supabase| <-------   |
    |  Auth   |
    |---------|
```

#### 3.1.2 Front-End (LP Portal)
- **Next.js** on Vercel  
- Renders the LP Portal UI  
- Uses Supabase Auth for sessions/JWT tokens  

#### 3.1.3 Back-End
- **Authentication (Supabase)**  
  - User sign-up/sign-in, password resets, JWT issuance (with `supabase_uuid`)  
  - Email matching for pre-registered users  
- **Data Management**  
  - All data (documents, user roles, investments) stored in Airtable  
  - Serverless functions handle read operations, user registration flow, and partial updates  

### 3.2 Data Management

#### 3.2.1 Data Storage (Airtable)

- **User_Profiles**  
  - Stores `supabase_uuid`, name, email, and more  
  - May exist with only an email (pre-registration) until Supabase UUID is added

- **Roles**  
  - Maps user UUIDs to accounts and roles (Signer, Admin, Editor, Viewer)

- **Accounts**  
  - Account-level metadata (name, type, etc.)  
  - Links to Roles table for user access

- **Documents**  
  - PDF attachments and metadata (GP-managed)  
  - `Allowed_Users` field linking to User_Profiles  
  - Lookup/rollup of user UUIDs for permission

- **Investments** (and other domain tables)  
  - Similar structure for user permissions  
  - GP-managed entries in Airtable

- **Events/Activities**  
  - Single table for all logged events (documents, investments, companies, accounts)  
  - Each record references relevant entities (IDs, user IDs, etc.)

#### 3.2.2 Row-Level Permission Simulation
- Each record has a lookup/rollup of `supabase_uuid`s granted access  
- Serverless functions filter results by the authenticated user’s UUID  

#### 3.2.3 Serverless Logic (Vercel)
- **User Registration**  
  1. Receive user signup from Supabase  
  2. Check Airtable for email match  
  3. If match: update existing record with UUID  
  4. If none: create new record  
- **Data Fetch**  
  1. Retrieve `supabase_uuid` from JWT  
  2. Query Airtable  
  3. Filter by `supabase_uuid` before returning results  
- **Updates (Admin actions)**  
  1. Authenticated GP request  
  2. Update Airtable to add/remove `Allowed_Users` or modify roles  

### 3.3 File Management

#### 3.3.1 File Storage & Retrieval
- **Uploads**  
  - GP attaches documents to Airtable  
- **Retrieval**  
  - LP only sees docs if their UUID is in the record’s permission fields  
  - Potential future file proxy for large/sensitive docs  

#### 3.3.2 Scalability & Performance
- Up to ~1,000 users initially  
- Early usage = minimal need for caching or pagination  
- Consider a more robust store (Postgres) or advanced caching if usage grows

### 3.4 Activity Logging

#### 3.4.1 Activity Types
- **Document Activities** (uploads, updates, tax docs)  
- **Investment Activities** (new investment, distributions, capital calls)  
- **Company Activities** (quarterly reports, news, valuations)  
- **Account Activities** (team changes, KYC updates)  
- **Administrative** (required actions, deadlines)  

#### 3.4.2 Logging Implementation
- All logged in a single **Events/Activities** table with references to entities and users  

---

## 4. Functional Requirements

### 4.1 Core Features

#### 4.1.1 User Authentication & Profile
- Users sign up/log in via Supabase  
- If pre-registered: system updates existing Airtable record with UUID  
- Otherwise: new `User_Profiles` record is created  
- Logout invalidates local sessions  

#### 4.1.2 Data Access & Permissions
- Row-level filtering by `supabase_uuid`  
- Only authorized data returned to the front-end  

#### 4.1.3 Document Management
- GP Admins upload docs to Airtable  
- Each doc references allowed LP user(s)  
- LP can view/download authorized docs  

#### 4.1.4 Data Management
- GP Admins can add/update LP records in Airtable  
- GP Admins create new records (Documents, Investments) with allowed users  
- LPs have read-only access (except personal/team info)  

#### 4.1.5 Search & Filtering
- Basic keyword search on the front-end  
- Serverless logic filters records by `supabase_uuid`  
- Additional front-end filtering for convenience  

---

## 5. Non-Functional Requirements

### 5.1 Security
- Store Airtable API keys in Vercel environment variables  
- Validate Supabase JWT before accessing Airtable  
- Return only filtered data to the front-end  

### 5.2 Reliability
- Minimal downtime aligned with Airtable/Supabase availability  
- Basic error handling for failed Airtable requests  

### 5.3 Maintainability
- Consistent naming conventions in Airtable fields (`Allowed_Users`, etc.)  
- Code comments explaining data model, filtering logic  

### 5.4 Error Logging & Monitoring
- Lightweight approach (console logs, optional Airtable logging)  
- Potential integration with Sentry or similar in future  

### 5.5 Accessibility & Compliance
- Aim for WCAG 2.1 AA  
- Keyboard navigation, screen reader compatibility  
- Proper color contrast, ARIA roles, alt text for images  

---

## 6. User Experience

### 6.1 Navigation and Layout

#### 6.1.1 Top Header
- Company name (“Emberline”) in top-left  
- Breadcrumb navigation in top center/right  

#### 6.1.2 Left-Hand Sidebar
- Fixed-width, collapsible sections  
- Navigation response < 300ms  

#### 6.1.3 Navigation Hierarchy
1. **Menu Label** (“Menu”)  
2. **Primary Navigation Items**  
   - **Home** (dashboard icon)  
   - **Companies** (expandable, icon)  
   - **Investments** (icon)  
   - **Accounts** (expandable, icon)  
   - **Documents** (icon)  

### 6.2 Page Features

#### 6.2.1 Home Page

**Left Panel - Latest Activity**  
- Header: “Latest Activity” + “Recent transactions…” subtitle  
- Search bar: “Search activities…”  
- Filter pills (investment, account, type)  
- Activity list: timestamps, icons, bold titles, type labels, short descriptions, timeline connector  

**Right Panel - Portfolio Overview**  
- **Total Portfolio NAV** (large numeric, performance indicator)  
- **Key Metrics Cards** (Performance %, Investments count, Companies count, Accounts count)  

#### 6.2.2 Companies Page

- **Company Overview**: logo, name, link, description  
- **Key Metrics**: headcount, revenue, EBITDA, founded year  
- **Revenue Growth**: bar chart (annual revenue)  
- **Latest Reports**: recent docs/reports (title, format, timestamp)  

#### 6.2.3 Investments Page

- **Header Controls**: search bar, view toggles (company/account), options dropdown  
- **Data Table**  
  - Sortable columns: Company, Account, Capital Invested, Current NAV, Return %, Ownership %, Units, Distributions, Fee Structure  
  - Pagination controls, row selection, sorting by columns  

#### 6.2.4 Documents Page

- **Document Search**: type-ahead, recent searches  
- **Smart Filtering**: by doc type, account, date/year, company  
- **Document List View**: scannable table, doc type indicators, associated account/company, upload date  
- **Preview Interface**: full-screen modal, metadata, download/share, zoom/page nav, loading indicators  

### 6.3 Design System

#### 6.3.1 Visual Design
- shadcn UI with Zinc theme  
- Grayscale palette + accent colors  
- Consistent spacing, hierarchy, responsiveness  

#### 6.3.2 Typography
- System font stack  
- Distinct styles for headers, body, labels, metadata, numbers  

#### 6.3.3 Interactive Elements
- Consistent hover states, focus indicators, loading states  
- Clear error/success messages  

#### 6.3.4 Data Visualization
- Standard formatting for currency, percentages, large numbers, dates  
- Positive/negative indicators  
- Responsive chart scaling  

### 6.4 Performance

#### 6.4.1 Page Load Times
- Initial load: < 2s  
- Section navigation: < 300ms  
- Data grid rendering: < 1s  

#### 6.4.2 Interactive Response
- Button clicks: < 100ms  
- Menu expansions: < 200ms  
- Modal open/close: < 300ms  
- Filter application: < 300ms  
- Search results: < 500ms  

#### 6.4.3 Document Operations
- Document list load: < 1s  
- Preview load: < 2s  
- Download start: < 500ms  

### 6.5 User Journeys

#### 6.5.1 LP Investor Journey
1. Log in to a home page showing aggregated positions  
2. Navigate to a specific company for details  
3. Expand account breakdowns if needed  
4. Review performance metrics and docs  

#### 6.5.2 Investment-Focused LP Journey
1. View aggregated investment positions in the dashboard  
2. Select a specific company  
3. Review performance metrics and docs  
4. Expand account breakdown as needed  
5. Use Account Management for tasks  

#### 6.5.3 LP Support User Journey
1. Receive email about new K-1 docs  
2. Access docs via home notification or Documents page  
3. Filter or search for K-1s  
4. Bulk download selected docs  
5. System logs access for auditing  

#### 6.5.4 GP Administration
- GPs perform all admin tasks in Airtable, not through the LP Portal  

### 6.6 Error Handling

#### 6.6.1 Loading States
- shadcn skeleton components for loading  
- Indicators for page/data/doc fetch, filter application  

#### 6.6.2 Error States
- Clear messaging for auth failures, permission denial, network issues, invalid data, rate limits  

#### 6.6.3 Empty States
- Meaningful messages for no docs, no investments, no activity, or search results  
- Suggestions for next actions  

#### 6.6.4 Edge Cases
- Partial data load failures  
- Timeouts  
- Concurrent user actions  
- Large data sets  
- Browser refresh/navigation  

---

## 7. Future Development

### 7.1 Planned Features
- LP account onboarding  
- Direct investment initiation  
- Messaging between LPs and GPs  
- Tasking system for open items  
- Notification/alert system  
- Advanced analytics dashboard  
- Third-party integrations  
- Enhanced reporting tools  
- Mobile application  
- Future GP Portal  

### 7.2 Technical Considerations

1. **Advanced Permissions**  
   - For more complex rules (departmental restrictions, dynamic conditions), consider dedicated ACL services or databases with Row-Level Security  

2. **File Storage Alternatives**  
   - For large/sensitive attachments, consider AWS S3 or Supabase Storage  
   - Store file references in Airtable  

3. **E-Signature Integration**  
   - Currently uses Pandadocs integration triggered from Airtable  
   - Future versions may integrate e-sign features directly  

4. **Color Coding & Theming**  
   - Potential enhancement to distinguish accounts/funds visually  

### 7.3 Scalability Plans
- If data/users significantly increase, migrate from Airtable to a more robust DB (e.g., Postgres)  
- Consider adding caching layers  
- Implement more advanced error logging/monitoring  