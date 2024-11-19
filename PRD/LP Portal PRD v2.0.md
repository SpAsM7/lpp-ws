# **Product Requirements Document (PRD)**

## **Investor Portal Development**

---

## **1. Executive Summary**

This PRD outlines the requirements for developing a clean and intuitive full-stack application for an investor portal. The portal aims to provide investors with an efficient way to manage their private market investments, accounts, and documents, while facilitating clear communication and minimizing user confusion around multiple accounts and investments.

---

## **2. Objectives**

- **Enhance User Experience**: Provide an intuitive and streamlined interface that aligns with how investors think about their investments across accounts
- **Simplify Investment Management**: Make it easy for users to understand their investment positions, find key documents and digest company financials and reports
- **Facilitate Clear Communication**: Ensure that newsletters, reports, and updates are easily accessible and understandable
- **Reduce Confusion**: Address user confusion around multiple accounts while maintaining clear account breakdowns for administrative needs

---

## **3. Scope and Limitations**

- **Scope**: The investor portal will include features for managing investments, accounts, related documents, and communication updates. It will be accessible via web browsers on desktop and mobile devices.

- **Limitations**: This version will not include advanced analytics, integration with third-party financial planning tools, or GP (General Partner) Portal features. The primary focus is on investment tracking and document management.

- **Future Features**: The following features are beyond the scope of this current PRD but are planned for future development:
  - Ability for the user to open a new account
  - Ability for the user to start a new investment
  - Messaging system between users and GP admins
  - Tasking system between users and GP admins when users have open items
  - Notification system
  - Advanced analytics dashboard
  
---

## **4. Design Principles**

- **Clarity and Intuitiveness**: Users should always know their total investment position and how to access administrative functions
- **Minimalism**: Use a grayscale palette with strategic accent colors, leveraging shadcn UI components
- **Consistency**: Maintain a cohesive look and feel throughout the portal
- **Responsive Design**: Interface should adapt to different screen sizes and viewports
- **Accessibility**: Comply with accessibility standards to cater to all users
- **Style Guide**: Follow the shadcn style guide to ensure consistency
- **Framework and Tools**: Use the shadcn framework with Zinc theme

---

## **5. User Personas, Teams, and Journeys**

### **5.1 User Personas**

1. **Primary Investor**:
   - **Characteristics**: Individual investing personally, through an IRA, or a family business
   - **Needs**:
     - View total investment positions across accounts
     - Access investment and financial information centered around companies
     - Receive and read newsletters and reports
     - Access tax documents and other important files

2. **Accountant/Admin/Advisor**:
   - **Characteristics**: Users added by primary investors to help manage accounts
   - **Needs**:
     - Access specific account information
     - Manage documents and reports relevant to their role
     - Update account information as needed

### **5.2 User Types, Teams, and Account Relationships**

- **Team Structure**: Teams are associated per account. A primary investor may have different team members for each account, such as an advisor for their personal account and a CFO for their holding company (holdco) account.
- **User Roles Across Accounts**: A user can hold different roles across multiple accounts.

### **5.3 User Types per Account**

- **Signer**: Primary owner of an account with full access, except for items restricted to a GP Portal user. Only a GP admin can remove or change the signer.
- **Admin**: Can perform all actions except signing documents. Admins can remove themselves from an account.
- **Editor**: Can do everything an Admin can except add or remove team members. Editors can remove themselves from an account.
- **Viewer**: Read-only user. Viewers can remove themselves from an account.

### **5.4 User Journeys**

1. **Primary Investor**:
   - **Scenario**: Reviewing total investment position
   - **Journey**: User logs in to home showing aggregated positions, navigates to specific company for detailed view, and can expand account breakdowns when needed

2. **Investment-Focused Investor**:
   - **Scenario**: Analyzing total position in a company across multiple accounts
   - **Journey**: 
     1. Views dashboard with aggregated investment positions
     2. Clicks into specific company to view total investment relationship
     3. Reviews performance metrics and documentation
     4. Expands view for account breakdown when needed
     5. Uses Account Management for administrative tasks

3. **Accountant/Tax Professional**:
   - **Scenario**: Accessing and downloading K-1s for tax preparation
   - **Journey**: 
     1. User receives email notification that new K-1s are available
     2. Can access documents either through:
        - Home notification quick link (applies relevant filters automatically)
        - Documents page with filters
        - Account page via "View Tax Documents" button (applies account and tax document filters automatically)
     3. Views filtered documents in main Documents interface
     4. Can bulk download selected documents
     5. System records document access for audit purposes

### **5.5 Activity Types and Use Cases**

1. **Document Activities**
   - Purpose: Track document availability and updates
   - Types:
     - New document uploaded
     - Document replaced/updated
     - Tax document available
     - Statements available
   - User Impact: Users receive clear notifications about important document updates and can quickly access new materials

2. **Investment Activities**
   - Purpose: Track investment changes and financial events
   - Types:
     - New investment made
     - Distribution/dividend paid
     - Capital call notice
   - User Impact: Investors stay informed about critical financial events and required actions

3. **Company Activities**
   - Purpose: Track company updates and information
   - Types:
     - Quarterly report available
     - Company news/updates
     - Valuation changes
     - Important announcements
   - User Impact: Users receive timely updates about company performance and important changes

4. **Account Activities**
   - Purpose: Track account management and team changes
   - Types:
     - Team member added/removed
     - Account details updated
     - KYC/documentation needs attention
     - Banking information changed
   - User Impact: Administrators can monitor account changes and required actions

5. **Administrative Activities**
   - Purpose: Track required actions and deadlines
   - Types:
     - Required action items
     - Important deadlines
   - User Impact: Users receive clear notifications about pending tasks and upcoming deadlines

---

## **6. Technical Architecture**

### **6.1 Technology Stack**

- **Frontend**:
  - Next.js 15
  - React 18
  - TypeScript
  - Tailwind CSS
  - shadcn UI components (with Zinc theme)

- **Backend Platform**: Supabase
  - PostgreSQL Database
  - Authentication
  - File Storage
  - Real-time subscriptions
  - Edge Functions (for custom server-side logic)

- **Additional Tools**:
  - React Hook Form & Zod for form handling
  - TanStack Query for data fetching
  - TanStack Table for data tables
  - Recharts for data visualization
  - date-fns for date handling

- **Infrastructure**:
  - Vercel (frontend hosting)
  - Supabase Cloud (backend services)

### **6.2 Functional Requirements**

#### **6.2.1 Navigation and Layout**

- **Top Header**:
  - Company name ("Emberline") in top left
  - Breadcrumb navigation in top center/right

- **Left-Hand Sidebar**:
  - Fixed-width sidebar with collapsible sections
  - Response time for navigation changes: < 300ms

#### **Navigation Hierarchy**

1. **Menu Label**:
   - Clear "Menu" text to separate navigation from header

2. **Primary Navigation Items**:
   - **Home**: Dashboard view with icon
   - **Companies**: Expandable section with icon
     - Dynamic list of companies
     - Chevron indicator for expansion
   - **Investments**: Direct link with icon
   - **Accounts**: Expandable section with icon
     - Dynamic list of accounts
     - Chevron indicator for expansion
   - **Documents**: Direct link with icon

#### **6.2.2 Home**

The home page consists of two main sections: an activity feed panel on the left and a metrics overview panel on the right.

**Left Panel - Latest Activity**
- **Header**:
  - Title: "Latest Activity"
  - Subtitle: "Recent transactions and updates across your portfolio"

- **Activity Feed Controls**:
  - Search bar with placeholder "Search activities..."
  - Filter pills/buttons for:
    - Investment
    - Account
    - Type

- **Activity List**:
  - Each activity item displays:
    - Timestamp (relative time, e.g., "8 months ago")
    - Activity icon representing the type
    - Activity title in bold
    - Activity type label (document, notification, alert)
    - Brief description in secondary text
  - Activity types include:
    - Quarterly Report Available
    - Dividend Payment
    - Tax Document
    - Portfolio Alert
    - Account Statement
  - Vertical timeline connector between activities
  - Scrollable list with consistent spacing

**Right Panel - Portfolio Overview**
- **Total Portfolio NAV**:
  - Large numerical display: "$1,234,567"
  - Performance indicator: "+20.1% since inception"
  - Currency symbol in top right

- **Key Metrics Cards**:
  - **Performance**:
    - Large percentage display: "+12.5%"
    - Subtext: "+2.5% since inception"
    - Trend icon

  - **Investments**:
    - Number count: "24"
    - Change indicator: "+2 since last month"
    - Clock icon

  - **Companies**:
    - Number count: "15"
    - Change indicator: "+3 since last quarter"
    - Building icon

  - **Accounts**:
    - Number count: "7"
    - Change indicator: "+1 since last month"
    - Chart icon

**Visual Design**:
- Clean, minimal layout using shadcn UI components
- Consistent spacing and alignment
- Clear visual hierarchy
- Responsive design that adapts to different screen sizes

**Interaction**:
- Clickable activity items that navigate to relevant detail pages
- Hoverable metrics cards with tooltip details
- Sticky headers for both panels during scroll
- Real-time updates for new activities

#### **6.2.3 Companies**

- **Company Detail Views**:
  - **Company Overview Section**:
    - Company logo/icon display
    - Company name and website link
    - Company description
    - Key Metrics Display:
      - Headcount
      - Revenue
      - EBITDA
      - Founded year
    
  - **Revenue Growth Section**:
    - Bar chart visualization showing annual revenue performance
    - Y-axis: Revenue
    - X-axis: Years
    
  - **Latest Reports Section**:
    - List of recent financial documents and reports
    - Document metadata (title, format, size, timestamp)


#### **6.2.4 Investments**

- **Page Layout**: Data table interface with filtering and view controls

- **Header Controls**:
  - Search bar with placeholder "Filter investments..."
  - View toggle buttons:
    - Company view
    - Account view
  - View options dropdown menu

- **Data Table**:
  - Sortable columns with clear headers:
    - Company (with logo/icon)
    - Account
    - Capital Invested (formatted currency)
    - Current NAV (formatted currency)
    - Return (percentage with positive/negative indicators)
    - Ownership (percentage)
    - Units Owned (numeric)
    - Distributions (formatted currency)
    - Fee Structure (format: "x/xx")

  - Table Features:
    - Column sorting (clickable headers)
    - Responsive column widths
    - Row selection capability
    - Pagination controls
    - Rows per page selector
    - Selected rows counter

- **UX Considerations**:
  - Consistent money formatting with appropriate decimal places
  - Percentage formatting with "+" or "-" indicators
  - Clear visual hierarchy in cell content
  - Compact but readable row height
  - Subtle row hover states
  - Clear borders and separation between cells
  - Loading states for data updates
  - Empty state handling when no data matches filters

#### **6.2.5 Documents**

- **Purpose**: Central repository for all documents with robust filtering and search

- **Performance Requirements**:
  - Document list load time: < 1 second
  - Filter application: < 300ms
  - Search results: < 500ms
  - Preview load time: < 2 seconds

- **Interface Features**:
  - **Document Search**:
    - Search within document titles and metadata
    - Type-ahead suggestions
    - Recent searches
    - Response time < 500ms

  - **Smart Filtering**:
    - By document type
    - By account
    - By date/year
    - By company
    - Filter application response time < 300ms
  
  - **Document List View**:
    - Clean, scannable table interface
    - Clear document type indicators
    - Related account and company information
    - Upload date and status
    - Column sorting and filtering

  - **Preview Interface**:
    - Full-screen modal with semi-transparent backdrop
    - Close button in top right corner
    - ESC key dismissal
    - Document metadata display
    - Action buttons:
      - Download
      - Close
      - Share (if enabled for document type)
    
    - **Preview Features**:
      - Zoom controls (in/out, fit to width/height)
      - Page navigation for multi-page documents
      - Loading indicators during document fetch
      
    - **Supported Formats**:
      - PDFs
      - Common image formats (PNG, JPG)
      - Microsoft Office documents
      - Text files
      
    - **Error Handling**:
      - Clear error messages for unsupported formats
      - Fallback preview for unsupported types
      - Automatic retry for failed loads
      - Download option always available
      - Network error recovery
    
    - **Performance**:
      - Initial preview load < 2 seconds
      - Document streaming for large files
      - Preview caching for recently viewed docs
    
    - **Security**:
      - Maintain role-based access controls
      - Prevent direct URL access
      - Optional watermarking
      - View audit logging

### **6.3 Data Architecture**

#### **6.3.0 High-Level Database Schema**

```
auth.users (Supabase managed)
├── id (UUID)
├── email
├── encrypted_password
├── email_confirmed_at
├── last_sign_in_at
└── [Other Supabase auth fields...]

user_profiles
├── user_id (references auth.users)
├── first_name
├── last_name
├── phone
├── professional_title
├── company_name
└── profile settings/preferences

Roles (join table between Users and Accounts)
├── user_id (references auth.users)
├── account_id
└── role_type: signer, admin, editor, viewer

Accounts
├── has many Roles (users)
├── has many Investments
└── has many Files (account-specific docs)

Investments
├── belongs to Account
├── belongs to Company
├── has many Files (investment-specific docs)
└── serves as main connection between Accounts & Companies

Companies
├── has many Investments
└── has many Files (company-wide docs)

Files
├── file metadata (name, type, etc.)
├── company_id (nullable)
├── investment_id (nullable)
├── account_id (nullable)
├── visibility_scope
│   ├── company_wide
│   ├── investment_specific
│   └── account_specific
└── audit/tracking fields (created_by, updated_at, etc.)

Activities
├── activity_type (document, investment, company, account, administrative)
├── related entity references
│   ├── company_id (nullable)
│   ├── investment_id (nullable)
│   └── account_id (nullable)
└── activity metadata (timestamp, description, etc.)
```

### **6.4 Investment Metrics and Calculations**

#### **6.4.1 Portfolio Metrics**
- **Total Portfolio Value**
  - Sum of all current investment valuations
  - Calculation: Σ (Current Value of Each Investment)
  
- **Total Return**
  - Absolute return across entire portfolio
  - Calculation: (Current Value + Total Distributions - Total Contributions) / Total Contributions

- **IRR**
  - Internal Rate of Return calculation methodology
  - Treatment of cash flows and valuation updates

#### **6.4.2 Investment-Level Metrics**
- **Investment Multiple**
  - Calculation: (Total Value + Total Distributions) / Total Contributed Capital
  
- **Unrealized Value**
  - Current holding value
  - Last valuation date and methodology

- **Realized Value**
  - Sum of all distributions
  - Distribution categorization (Return of Capital, Capital Gains, etc.)

### **Document Access Control**

Document access in the LP Portal is managed through two separate mechanisms:

#### **1. Document Visibility**
Determines which users can see a document based on their roles and relationships:

- **Company-Wide Documents**
  - Visible to: All users with roles in any account investing in the company
  - Examples: Quarterly reports, company updates, general announcements
  
- **Investment-Specific Documents**
  - Visible to: Only users with roles in the specific account that made the investment
  - Examples: K-1s, capital call notices, distribution notices
  
- **Account-Specific Documents**
  - Visible to: Only users with roles in that specific account
  - Examples: Subscription agreements, KYC documents, banking information

#### **2. Modification Rights**
Determines what actions users can take with documents they can see:

- **GP-Only Documents**
  - Only GP admins can modify
  - Examples: K-1s, quarterly reports, capital calls

- **LP Full Access Documents**
  - Can be modified by LP users with Signer/Admin/Editor roles
  - Examples: Subscription documents, KYC documents
  
- **Read-Only Documents**
  - No modifications allowed (view/download only)
  - Applied to certain historical or compliance documents

#### **Access Control Matrix**

Common document types and their access patterns:
```
Document Type       | Visibility Scope    | Modification Rights
-------------------|--------------------|-----------------
K-1s               | Investment-specific | GP Only
Quarterly Reports  | Company-wide       | GP Only
Capital Calls      | Investment-specific | GP Only
Subscription Docs  | Account-specific   | LP Full
KYC Documents      | Account-specific   | LP Full
Company Updates    | Company-wide       | GP Only
```

---

## **7. Non-Functional Requirements**

### **7.1 Performance**

- **Page Load Times**:
  - Initial application load: < 2 seconds
  - Navigation between sections: < 300ms
  - Data grid rendering: < 1 second
  
- **Data Operations**:
  - Filter application: < 300ms
  - Sort operation: < 300ms
  - Search results: < 500ms
  
- **Document Operations**:
  - Document list load: < 1 second
  - Preview load: < 2 seconds
  - Download initiation: < 500ms

- **Interactive Elements**:
  - Button response: < 100ms
  - Menu expansion: < 200ms
  - Modal open/close: < 300ms
  
- **API Response Times**:
  - Read operations: < 500ms
  - Write operations: < 1 second
  - Batch operations: < 2 seconds

### **7.2 Security**

#### **7.2.1 Authentication**
- Supabase Auth for user authentication
- Secure password requirements
- Multi-factor authentication support

#### **7.2.2 Role-Based Access Control**

1. **Signer**
   - Full access to account information
   - Can view and download all documents
   - Can manage team members
   - Can sign legal documents
   - Cannot be removed except by GP admin

2. **Admin**
   - Full access to account information
   - Can view and download all documents
   - Can manage team members
   - Cannot sign legal documents
   - Can remove themselves from account

3. **Editor**
   - Can view all account information
   - Can view and download all documents
   - Cannot manage team members
   - Can remove themselves from account

4. **Viewer**
   - Read-only access to account information
   - Can download permitted documents
   - Cannot manage team members
   - Can remove themselves from account

#### **7.2.3 Data Protection**
- End-to-end encryption for sensitive data
- Secure file storage and transmission
- Regular security audits and penetration testing

### **7.3 Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper color contrast ratios

### **7.4 Browser Support**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for different viewport sizes
- Graceful degradation for older browsers

---

## **8. Implementation Guidelines**

### **8.1 Development Standards**
- TypeScript strict mode
- Component-based architecture
- Responsive design principles
- Comprehensive testing

### **8.2 Testing Requirements**
- Unit testing with Jest
- Component testing with Testing Library
- E2E testing with Cypress
- 80% minimum coverage

---

## **9. Future Considerations**

### **9.1 Planned Features**
- Advanced analytics dashboard
- Third-party integrations
- Enhanced reporting tools
- Mobile application

### **9.2 Scalability Planning**
- Infrastructure expansion
- Performance optimization
- Data archival strategy

---

## **10. Appendix**

### **10.1 Glossary**
- **LP**: Limited Partner
- **GP**: General Partner
- **NAV**: Net Asset Value
- **KYC**: Know Your Customer

### **10.2 Reference Documents**
- shadcn UI documentation
- Supabase documentation
- WCAG 2.1 guidelines
- Security compliance requirements

### **10.3 Implementation Examples**

#### **10.3.1 K-1 Document Schema Example**

This example demonstrates how the file schema handles complex document relationships while maintaining proper access control.

**Scenario**: A K-1 tax document for Account Y's investment in Company X

**Document Characteristics**:
- Investment-specific document
- Requires company association
- Account-specific visibility
- GP-only editing rights

**Database Record Example**:
```sql
Files
- id: UUID 
- name: "2023_Company_X_K1.pdf"
- file_type: "k1"
- company_id: UUID (Company X's ID)
- investment_id: UUID (Investment ID linking Account Y and Company X)
- account_id: UUID (Account Y's ID)
- visibility_scope: "investment_specific"
```

**Access Control**:
- GP Admin: Full access (upload/edit/delete)
- LP Users (Account Y): View access only
- Other LP Users: No access

**Key Design Elements**:
1. Nullable foreign keys enable multi-entity relationships
2. visibility_scope controls access patterns
3. investment_id creates necessary account-company relationship

**Similar Document Types**:
- Capital call notices
- Distribution notices
- Investment-specific side letters
- Individual investor reports

This pattern demonstrates how the schema supports complex document relationships while maintaining strict access control and proper data organization.
