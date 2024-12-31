# LP Portal Functional Requirements

## 1. Authentication & User Management

### FR-1.1: User Registration
- System must allow users to register with email and password
- Registration form must collect: first name, last name, email, password
- System must validate email format and password strength (minimum 8 characters, including uppercase, lowercase, number, special character)
- After registration, system must send email verification link
- Users cannot access the platform until email is verified
- Upon first login, prompt user to complete profile information

### FR-1.2: User Profile Management
- Users must be able to update their profile information
- Required profile fields: professional title, company name, phone number
- Optional fields: LinkedIn URL, profile image, timezone
- System must track last profile update timestamp
- Profile changes must be audited with before/after values
- Profile must show all accounts where user has access

### FR-1.3: Session Management
- System must maintain user session after successful login
- Sessions must expire after 24 hours of inactivity
- System must support concurrent sessions across devices
- Users must be able to view and terminate active sessions
- Failed login attempts must be limited to 5 within 15 minutes
- System must force password reset after 5 failed attempts

## 2. Account Management

### FR-2.1: Account Creation & Setup
- System must support creation of four account types: Personal, Entity, Retirement, Special/Other
- Each account type must have specific subtypes (e.g., Individual/Joint for Personal)
- System must collect different information based on account type
- System must validate tax ID format based on account type (SSN, EIN, ITIN)
- System must enforce required fields based on account type and subtype

### FR-2.2: Account Team Management
- Support four role types: Signer, Admin, Editor, Viewer
- Allow adding team members to accounts with specific roles
- Enable role changes for existing team members
- Allow team members to remove themselves from accounts
- Restrict signer role management to GP admins only
- Track all team member changes in audit log

### FR-2.3: Account Information Management
- Allow updating of account details based on user role
- Maintain version history of all account changes
- Support multiple addresses per account
- Enable banking information management
- Support multiple bank accounts with primary designation
- Validate bank account details (routing numbers, SWIFT codes)

## 3. Investment Management

### FR-3.1: Investment Overview
- Display total portfolio value across all accounts
- Show investment performance metrics (IRR, multiple, etc.)
- Present investment distribution across companies
- Display unrealized and realized gains
- Show historical investment performance
- Enable filtering investments by account or company

### FR-3.2: Investment Details
- Show detailed breakdown of each investment
- Display investment-specific documents
- Track capital calls and distributions
- Show ownership percentage
- Display investment dates and amounts
- Calculate and display return metrics

### FR-3.3: Investment Activity Tracking
- Log all investment-related activities
- Track document views and downloads
- Record capital calls and responses
- Monitor distribution payments
- Track valuation updates
- Generate activity reports

## 4. Document Management

### FR-4.1: Document Upload & Storage
- Support multiple document types (PDF, Excel, Word, etc.)
- Enable bulk document upload
- Validate file types and sizes
- Generate document previews where possible
- Support document versioning
- Maintain document metadata

### FR-4.2: Document Access Control
- Implement three visibility scopes: company-wide, investment-specific, account-specific
- Control document access based on user roles
- Track document access and downloads
- Enable/disable document downloading
- Support document expiration dates
- Maintain access audit logs

### FR-4.3: Document Organization
- Enable document categorization
- Support document tagging
- Implement document search
- Allow filtering by multiple criteria
- Support document folders/hierarchy
- Enable bulk operations on documents

## 5. Company Information

### FR-5.1: Company Profiles
- Display company overview information
- Show company financial metrics
- Present historical performance data
- List all related investments
- Show company-wide documents
- Track company updates and news

### FR-5.2: Company Performance Tracking
- Display revenue growth metrics
- Show headcount changes
- Track key financial indicators
- Present comparison metrics
- Enable performance period selection
- Support custom metric definition

## 6. Activity Feed & Notifications

### FR-6.1: Activity Tracking
- Track user actions across the platform
- Categorize activities by type
- Support activity filtering
- Enable activity search
- Maintain activity history
- Generate activity reports

### FR-6.2: Notification System
- Support multiple notification types
- Enable notification preferences
- Allow notification muting
- Support email notifications
- Enable notification history
- Track notification status

## 7. Data Export & Reporting

### FR-7.1: Data Export
- Support CSV/Excel export formats
- Enable bulk data export
- Allow custom export fields
- Support scheduled exports
- Track export history
- Enable export templates

### FR-7.2: Report Generation
- Support multiple report types
- Enable custom report creation
- Allow report scheduling
- Support report templates
- Enable report sharing
- Track report access

## 8. System Administration (GP Features)

### FR-8.1: User Management
- Manage user access levels
- Enable/disable user accounts
- Reset user passwords
- View user activity logs
- Manage user roles
- Track administrative actions

### FR-8.2: System Configuration
- Manage system settings
- Configure email templates
- Set system parameters
- Define validation rules
- Manage dropdown options
- Configure security settings

## 9. Security Requirements

### FR-9.1: Access Control
- Implement role-based access control
- Enforce data segregation
- Manage API access
- Control session management
- Implement IP restrictions
- Track security events

### FR-9.2: Data Protection
- Encrypt sensitive data
- Mask sensitive information
- Implement data backups
- Enable data recovery
- Track data access
- Maintain audit logs

## 10. Integration Requirements

### FR-10.1: External Systems
- Support SSO integration
- Enable API access
- Support webhook notifications
- Enable data import/export
- Support file transfers
- Track integration status

### FR-10.2: Communication
- Support email integration
- Enable SMS notifications
- Support document delivery
- Enable secure messaging
- Track communication status
- Maintain delivery logs