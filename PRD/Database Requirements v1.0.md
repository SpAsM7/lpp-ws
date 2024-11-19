# **LP Portal Database Requirements**

## **1. Database Configuration**

### **1.1 Extensions**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- For UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- For text search
```

### **1.2 Standard Field Types**
- Primary Keys: UUID DEFAULT uuid_generate_v4()
- Foreign Keys: UUID with ON DELETE RESTRICT, ON UPDATE RESTRICT
- Timestamps: TIMESTAMPTZ
- Money/Financial: BIGINT (represents cents/smallest currency unit)
- Short Text: VARCHAR(255)
- Long Text: TEXT
- Status Fields: TEXT with CHECK constraints
- Soft Delete: deleted_at TIMESTAMPTZ NULL
- JSONB Fields: DEFAULT '{}'

### **1.3 Standard Audit Fields**
```sql
created_at    TIMESTAMPTZ    NOT NULL DEFAULT now(),
created_by    UUID           NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
updated_at    TIMESTAMPTZ    NOT NULL DEFAULT now(),
updated_by    UUID           NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
deleted_at    TIMESTAMPTZ,
deleted_by    UUID           REFERENCES auth.users(user_id) ON DELETE RESTRICT
```

## **2. Core Authentication & User Data**

### **2.1 auth.users**
-- Managed by Supabase Auth - not modified

### **2.2 user_profiles**
-- Extends auth.users with business-specific user data
```sql
CREATE TABLE user_profiles (
    user_id                 UUID           PRIMARY KEY REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    first_name             VARCHAR(255)    NOT NULL,
    last_name              VARCHAR(255)    NOT NULL,
    phone                  VARCHAR(50),
    professional_title     VARCHAR(255),
    company_name           VARCHAR(255),
    linkedin_url           VARCHAR(255),
    profile_image_url      VARCHAR(255),
    timezone              VARCHAR(100),
    communication_preferences JSONB        NOT NULL DEFAULT '{
        "email_notifications": {
            "newsletters": true,
            "account_updates": true,
            "tax_documents": true,
            "announcements": true,
            "all": true
        }
    }',
    created_at            TIMESTAMPTZ      NOT NULL DEFAULT now(),
    created_by            UUID             NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    updated_at            TIMESTAMPTZ      NOT NULL DEFAULT now(),
    updated_by            UUID             NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    deleted_at            TIMESTAMPTZ,
    deleted_by            UUID             REFERENCES auth.users(user_id) ON DELETE RESTRICT
);
```

## **3. Business Entities**

### **3.1 companies**
-- Represents investment opportunities/portfolio companies
```sql
CREATE TABLE companies (
    company_id            UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name          VARCHAR(255)    NOT NULL,
    status               TEXT            NOT NULL,
    description          TEXT,
    industry             TEXT            NOT NULL,
    founded_date         DATE,
    website              VARCHAR(255),
    logo_url             VARCHAR(255),
    created_at           TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by           UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    updated_at           TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by           UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    deleted_at           TIMESTAMPTZ,
    deleted_by           UUID            REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    
    CONSTRAINT companies_status_check 
        CHECK (status IN ('active', 'inactive', 'pending', 'archived')),
    CONSTRAINT companies_industry_check 
        CHECK (industry IN ('technology', 'healthcare', 'finance', 'real_estate', 'consumer', 'industrial'))
);
```

### **3.2 accounts**
-- Represents investor entities (individual, IRA, trust, etc.)
```sql
CREATE TABLE accounts (
    account_id            UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_name          VARCHAR(255)    NOT NULL,
    account_type          TEXT            NOT NULL,
    tax_id                VARCHAR(50),
    status                TEXT            NOT NULL,
    kyc_status            TEXT            NOT NULL,
    accreditation_status  TEXT            NOT NULL,
    banking_information   JSONB           DEFAULT '{}',
    address_information   JSONB           DEFAULT '{}',
    created_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by            UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    updated_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by            UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    deleted_at            TIMESTAMPTZ,
    deleted_by            UUID            REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    
    CONSTRAINT accounts_account_type_check 
        CHECK (account_type IN ('individual', 'ira', 'trust', 'corporation', 'partnership', 'llc')),
    CONSTRAINT accounts_status_check 
        CHECK (status IN ('active', 'inactive', 'pending', 'archived')),
    CONSTRAINT accounts_kyc_status_check 
        CHECK (kyc_status IN ('not_started', 'in_progress', 'completed', 'expired')),
    CONSTRAINT accounts_accreditation_status_check 
        CHECK (accreditation_status IN ('accredited', 'not_accredited', 'pending_verification'))
);
```

### **3.3 investments**
-- Links accounts to companies and tracks investment details
```sql
CREATE TABLE investments (
    investment_id         UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id            UUID            NOT NULL REFERENCES accounts(account_id) ON DELETE RESTRICT,
    company_id            UUID            NOT NULL REFERENCES companies(company_id) ON DELETE RESTRICT,
    investment_status     TEXT            NOT NULL,
    investment_type       TEXT            NOT NULL,
    initial_investment_date DATE          NOT NULL,
    total_committed_capital BIGINT        NOT NULL,
    total_called_capital   BIGINT         NOT NULL,
    total_distributions    BIGINT         NOT NULL,
    current_nav           BIGINT          NOT NULL,
    last_valuation_date   TIMESTAMPTZ,
    investment_metrics    JSONB           DEFAULT '{}',
    created_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by            UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    updated_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by            UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    deleted_at            TIMESTAMPTZ,
    deleted_by            UUID            REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    
    CONSTRAINT investments_investment_status_check 
        CHECK (investment_status IN ('active', 'pending', 'fully_exited', 'partially_exited')),
    CONSTRAINT investments_investment_type_check 
        CHECK (investment_type IN ('direct', 'fund', 'spv')),
    CONSTRAINT investments_committed_capital_check 
        CHECK (total_committed_capital >= 0),
    CONSTRAINT investments_called_capital_check 
        CHECK (total_called_capital >= 0),
    CONSTRAINT investments_distributions_check 
        CHECK (total_distributions >= 0),
    CONSTRAINT investments_nav_check 
        CHECK (current_nav >= 0)
);
```

### **3.4 roles**
-- Manages user access to accounts
```sql
CREATE TABLE roles (
    role_id               UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id               UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    account_id            UUID            NOT NULL REFERENCES accounts(account_id) ON DELETE RESTRICT,
    role_type             TEXT            NOT NULL,
    created_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by            UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    updated_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by            UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    deleted_at            TIMESTAMPTZ,
    deleted_by            UUID            REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    
    CONSTRAINT roles_type_check 
        CHECK (role_type IN ('signer', 'admin', 'editor', 'viewer')),
    CONSTRAINT roles_user_account_unique 
        UNIQUE (user_id, account_id)
);
```

### **3.5 files**
-- Stores document metadata and access control information
```sql
CREATE TABLE files (
    file_id               UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name             VARCHAR(255)    NOT NULL,
    file_type             TEXT            NOT NULL,
    storage_path          VARCHAR(255)    NOT NULL,
    company_id            UUID            REFERENCES companies(company_id) ON DELETE RESTRICT,
    investment_id         UUID            REFERENCES investments(investment_id) ON DELETE RESTRICT,
    account_id            UUID            REFERENCES accounts(account_id) ON DELETE RESTRICT,
    visibility_scope      TEXT            NOT NULL,
    modification_access   TEXT            NOT NULL,
    created_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by            UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    updated_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by            UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    deleted_at            TIMESTAMPTZ,
    deleted_by            UUID            REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    
    CONSTRAINT files_file_type_check 
        CHECK (file_type IN ('k1', 'tax_document', 'report', 'statement', 'legal', 'correspondence')),
    CONSTRAINT files_visibility_scope_check 
        CHECK (visibility_scope IN ('company_wide', 'investment_specific', 'account_specific')),
    CONSTRAINT files_modification_access_check 
        CHECK (modification_access IN ('gp_only', 'lp_full', 'read_only'))
);
```

### **3.6 file_access_logs**
-- Tracks document access
```sql
CREATE TABLE file_access_logs (
    log_id                UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id               UUID            NOT NULL REFERENCES files(file_id) ON DELETE RESTRICT,
    user_id               UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    access_type           TEXT            NOT NULL,
    access_timestamp      TIMESTAMPTZ     NOT NULL DEFAULT now(),
    
    CONSTRAINT file_access_logs_access_type_check 
        CHECK (access_type IN ('view', 'download'))
);
```

### **3.7 activities**
-- Records all system activities
```sql
CREATE TABLE activities (
    activity_id           UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_type         TEXT            NOT NULL,
    title                 VARCHAR(255)    NOT NULL,
    description           TEXT            NOT NULL,
    entity_type           TEXT            NOT NULL,
    entity_id             UUID            NOT NULL,
    metadata              JSONB           DEFAULT '{}',
    importance            TEXT            NOT NULL,
    read_status          JSONB           DEFAULT '{"read_by": {}}',
    user_id               UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    created_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by            UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    updated_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by            UUID            NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    deleted_at            TIMESTAMPTZ,
    deleted_by            UUID            REFERENCES auth.users(user_id) ON DELETE RESTRICT,
    
    CONSTRAINT activities_activity_type_check 
        CHECK (activity_type IN ('document', 'investment', 'company', 'account', 'administrative')),
    CONSTRAINT activities_entity_type_check 
        CHECK (entity_type IN ('company', 'investment', 'account', 'file')),
    CONSTRAINT activities_importance_check 
        CHECK (importance IN ('low', 'medium', 'high'))
);
```

## **4. Indexes**

### **4.1 Primary Indexes**
```sql
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_roles_user_account ON roles(user_id, account_id);
CREATE INDEX idx_investments_account_id ON investments(account_id);
CREATE INDEX idx_investments_company_id ON investments(company_id);
CREATE INDEX idx_files_relationship_ids ON files(company_id, investment_id, account_id);
CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id);
CREATE INDEX idx_file_access_logs_file_id ON file_access_logs(file_id);
```

### **4.2 Search Indexes**
```sql
CREATE INDEX idx_companies_name_trgm ON companies USING gin(company_name gin_trgm_ops);
CREATE INDEX idx_accounts_name_trgm ON accounts USING gin(account_name gin_trgm_ops);
CREATE INDEX idx_files_name_trgm ON files USING gin(file_name gin_trgm_ops);
```

### **4.3 JSONB Indexes**
```sql
CREATE INDEX idx_activities_metadata ON activities USING gin(metadata);
CREATE INDEX idx_activities_read_status ON activities USING gin(read_status);
```

## **5. Row Level Security (RLS) Policies**

### **5.1 Account Access**
```sql
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Users can view accounts where they have an active role
CREATE POLICY account_view_policy ON accounts
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = accounts.id 
            AND deleted_at IS NULL
        )
    );

-- Only GP admins can insert/update accounts
CREATE POLICY account_modify_policy ON accounts
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE is_gp_admin = true));
```

### **5.2 Document Access**
```sql
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Company-wide documents
CREATE POLICY files_company_wide_policy ON files
    FOR SELECT
    USING (
        visibility_scope = 'company_wide' 
        AND auth.uid() IN (
            SELECT r.user_id 
            FROM roles r
            JOIN investments i ON r.account_id = i.account_id
            WHERE i.company_id = files.company_id
            AND r.deleted_at IS NULL
        )
    );

-- Investment-specific documents
CREATE POLICY files_investment_specific_policy ON files
    FOR SELECT
    USING (
        visibility_scope = 'investment_specific'
        AND auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id IN (
                SELECT account_id 
                FROM investments 
                WHERE investment_id = files.investment_id
            )
            AND deleted_at IS NULL
        )
    );

-- Account-specific documents
CREATE POLICY files_account_specific_policy ON files
    FOR SELECT
    USING (
        visibility_scope = 'account_specific'
        AND auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = files.account_id
            AND deleted_at IS NULL
        )
    );
```

### **5.3 Modification Rights**
```sql
-- GP admin override
CREATE POLICY gp_admin_modify_policy ON files
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE is_gp_admin = true));

-- LP full access for account documents
CREATE POLICY lp_full_modify_policy ON files
    FOR UPDATE
    USING (
        modification_access = 'lp_full'
        AND auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = files.account_id
            AND role_type IN ('signer', 'admin', 'editor')
            AND deleted_at IS NULL
        )
    );
```

## **6. Notes**

1. All tables implement soft deletion through deleted_at field
2. All foreign keys use ON DELETE RESTRICT to prevent orphaned records
3. All timestamps are stored in UTC
4. Financial amounts are stored in cents/smallest currency unit as BIGINT
5. JSONB structures will be validated at the application level
6. File storage paths reference Supabase Storage bucket locations

