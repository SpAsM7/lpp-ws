# LP Portal Implementation Guide

## Phase 1: Foundation Setup
### 1.1 Development Environment
- [x] Set up Next.js with TypeScript project
- [x] Install and configure core UI dependencies
- [x] Set up version control
- **Success Criteria**: 
  - [x] Running `pnpm dev` shows a styled webpage in your browser
  - [x] Page has shadcn UI styling (proper fonts, colors, spacing)
  - [x] No error messages in the browser console

### 1.2 Supabase Setup
- [x] Set up Supabase project
- [x] Configure database access
- [x] Test connectivity
- **Success Criteria**: 
  - [x] Can log into Supabase dashboard
  - [x] Database appears in the dashboard
  - [x] Test query returns expected results
  - [x] Environment variables are set up and working

### 1.3 Core Layout Components
- [x] Create basic application layout
- [x] Implement navigation structure
- [x] Set up routing
- **Success Criteria**: 
  - Page shows company name in header
  - Sidebar navigation menu appears and can be clicked
  - Clicking menu items changes the content
  - Layout looks correct on both desktop and mobile

## Phase 2: Authentication & Data Layer
### 2.1 User Authentication
- [x] Implement authentication flow
- [x] Set up protected routes
- [x] Test user session management
- **Success Criteria**: 
  - Can create a new user account
  - Can log in with email/password
  - Can log out
  - Can reset password via email
  - After logging out, trying to access the dashboard redirects to login page
  - After logging in, you stay logged in even after refreshing the page

### 2.2 Database Schema Implementation
- [ ] Create core database tables
- [ ] Set up relationships
- [ ] Implement security policies
- **Success Criteria**: 
  - All tables appear in Supabase dashboard
  - Can create test data in each table through the Supabase dashboard
  - Relationships work (e.g., can link an investment to both a company and an account)
  - Data appears properly formatted (dates, numbers, etc.)

### 2.3 Data Access Layer
- [ ] Set up type definitions
- [ ] Create data fetching patterns
- [ ] Implement basic data operations
- **Success Criteria**: 
  - Can create new records through the application
  - Can view existing records
  - Can update records
  - Can delete records
  - Changes appear immediately without refresh
  - Error messages appear when operations fail

## Phase 3: Core Features
### 3.1 Home Page
- [ ] Build activity feed
- [ ] Implement portfolio overview
- [ ] Add real-time updates
- **Success Criteria**: 
  - Page loads without errors
  - Shows total portfolio value
  - Displays recent activity list
  - Numbers are properly formatted (e.g., $1,234,567.89)
  - Activity feed updates when new activities occur
  - Can filter activities
  - Metrics update automatically when data changes

### 3.2 Companies & Investments
- [ ] Create company detail views
- [ ] Implement investment data table
- [ ] Add portfolio metrics and visualizations
- **Success Criteria**: 
  - Company detail page shows all required sections (overview, metrics, growth, reports)
  - Investment table displays all required columns with proper formatting
  - Data is properly formatted (currencies, percentages, dates)
  - Sorting and filtering works as expected
  - View toggles switch between Company and Account views
  - Charts and visualizations render correctly
  - Performance meets requirements (< 300ms for view changes)
  - All metrics update automatically

### 3.3 Accounts Management
- [ ] Create account views
- [ ] Implement team management
- [ ] Set up role-based access
- **Success Criteria**: 
  - Can view list of all accounts
  - Can view individual account details
  - Can add team members to accounts
  - Can assign different roles (Signer, Admin, Editor, Viewer)
  - Team members can only access what their role allows
  - Can remove team members
  - Account owners can't be removed

## Phase 4: Document Management
### 4.1 File Storage Setup
- [ ] Set up file storage system
- [ ] Implement access controls
- [ ] Create file operations
- **Success Criteria**: 
  - Can upload files
  - Can download files
  - Can view file preview
  - Files are only visible to authorized users
  - Storage limits are enforced
  - Invalid file types are rejected
  - Large files upload with progress indicator

### 4.2 Document Interface
- [ ] Create document management interface
- [ ] Implement search and filtering
- [ ] Add document preview
- **Success Criteria**: 
  - Documents page shows all accessible documents
  - Can search for documents by name
  - Can filter by document type
  - Can filter by date range
  - Preview opens when clicking a document
  - Can download documents
  - Shows appropriate error messages for invalid operations
  - Can bulk select and download multiple documents

## Phase 5: Polish & Security
### 5.1 Security Implementation
- [ ] Review and enhance security measures
- [ ] Implement audit logging
- [ ] Test security controls
- **Success Criteria**: 
  - Users can only see their own data
  - Unauthorized actions are blocked
  - Failed login attempts are limited
  - Password reset works
  - All user actions are logged
  - Can track who viewed each document
  - Security logs show user activity

### 5.2 Accessibility & Performance
- [ ] Implement accessibility features
- [ ] Optimize performance
- [ ] Add error handling
- **Success Criteria**: 
  - Can navigate entire site using keyboard
  - Screen reader announces all content properly
  - Color contrast meets standards
  - Pages load in under 2 seconds
  - All interactive elements have visible focus states
  - Error messages are clear and helpful
  - Works on different browsers (Chrome, Firefox, Safari)
  - Functions properly on mobile devices

## Phase 6: Testing & Deployment
### 6.1 Testing Setup
- [ ] Implement testing framework
- [ ] Create core tests
- [ ] Set up end-to-end testing
- **Success Criteria**: 
  - All core user flows work repeatedly
  - Edge cases have been tested
  - Different user roles tested
  - Different account types tested
  - All main features work across browsers
  - Mobile functionality verified
  - Performance meets requirements

### 6.2 Deployment
- [ ] Set up deployment pipeline
- [ ] Configure production environment
- [ ] Deploy application
- **Success Criteria**: 
  - Application is accessible via production URL
  - All features work in production
  - Data is secure and backed up
  - Monitoring is in place
  - Error reporting is working
  - Can deploy updates without downtime

## Core Best Practices

1. **Documentation Sync**
   - Update PRD when implementation differs from original spec
   - Document key decisions and why they were made
   - Keep success criteria updated based on new requirements

2. **Data Safety**
   - Never expose sensitive data in client-side code
   - Always use proper data types (e.g., BIGINT for currency)
   - Implement row-level security from the start
   - Query only needed fields, never select all columns

3. **UI/UX Consistency**
   - Use shadcn components instead of custom solutions
   - Follow established layout patterns across all pages
   - Maintain consistent spacing and typography
   - Always show loading and error states

4. **Performance First**
   - Implement pagination for all lists
   - Use proper database indexes
   - Optimize images and large assets
   - Monitor query performance

5. **Testing & Validation**
   - Test with real-world data volumes
   - Verify all calculations with example data
   - Test all user roles and permission combinations
   - Always handle edge cases (empty states, errors, etc.)

6. **Code Organization**
   - Keep components focused and single-purpose
   - Use TypeScript types consistently
   - Follow established project structure
   - Comment complex business logic

7. **User Experience**
   - Show clear feedback for all user actions
   - Implement proper form validation
   - Maintain responsive design across all features
   - Ensure all actions are reversible where possible

8. **Security Mindset**
   - Validate all user input
   - Never trust client-side data
   - Log security-relevant actions
   - Regular security review of new features

## Pending Features

### Authentication Enhancements
- [ ] Implement Google OAuth sign-in
  - Configure Google OAuth in Supabase
  - Add Google sign-in button to login/signup forms
  - Test OAuth flow and redirects
  - Handle OAuth errors and edge cases

### User Profile & Settings
- [ ] Create user profile management
  - Profile editing
  - Avatar upload
  - Email preferences
  - Notification settings

### Email Features
- [ ] Finish setting up email templates
  - [ ] Welcome email sequence
  - [ ] Invite user email
  - [ ] Double check all other email possiblities
  - [x] Password reset email
  - [x] Email verification
  - [x] Custom branding for emails
  - [ ] Investigate email delivery issues (tests are going to spam)

### Security Features
- [ ] Implement rate limiting for auth endpoints
- [ ] Add two-factor authentication
- [ ] Set up session management
  - Session timeout
  - Concurrent session handling
  - Device tracking

### Testing & QA
- [ ] Write E2E tests for auth flows
- [ ] Test email delivery and templates
- [ ] Cross-browser testing
- [ ] Mobile responsive testing
