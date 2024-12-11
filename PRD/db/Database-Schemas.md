# **Database Schemas**

## **1. Authentication Schema**

### **1.1 auth.users**
Managed by Supabase Auth - not modified

### **1.2 user_profiles**
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
    is_gp_user            BOOLEAN         NOT NULL DEFAULT false,
    is_lp_user            BOOLEAN         NOT NULL DEFAULT false,
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

## **2. Core Business Schema**

### **2.1 companies**
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

### **2.2 accounts**
```sql
CREATE TABLE accounts (
    id                    UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_number        VARCHAR(50)     NOT NULL UNIQUE,
    legal_name           VARCHAR(255)    NOT NULL,
    account_type         TEXT            NOT NULL,
    account_subtype      TEXT            NOT NULL,
    tax_id               VARCHAR(50)     NOT NULL,
    personal_details     JSONB,
    retirement_details   JSONB,
    entity_details       JSONB,
    created_at           TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by           UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at           TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by           UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at           TIMESTAMPTZ,
    deleted_by           UUID            REFERENCES auth.users(user_id),
    
    CONSTRAINT accounts_account_type_check 
        CHECK (account_type IN ('personal', 'entity', 'retirement', 'special_other')),
    CONSTRAINT accounts_account_subtype_check 
        CHECK (
            (account_type = 'personal' AND account_subtype IN ('individual', 'joint')) OR
            (account_type = 'entity' AND account_subtype IN ('LLC', 'trust', 'partnership', 'corporation')) OR
            (account_type = 'retirement' AND account_subtype IN ('IRA', '401k')) OR
            (account_type = 'special_other')
        ),
    CONSTRAINT valid_personal_details 
        CHECK (
            (account_type = 'personal' AND personal_details IS NOT NULL) OR
            account_type != 'personal'
        ),
    CONSTRAINT valid_retirement_details 
        CHECK (
            (account_type = 'retirement' AND retirement_details IS NOT NULL) OR
            account_type != 'retirement'
        ),
    CONSTRAINT valid_entity_details 
        CHECK (
            (account_type = 'entity' AND entity_details IS NOT NULL) OR
            account_type != 'entity'
        )
);
```

## **3. Investment Schema**

### **4.1 investments**
```sql
CREATE TABLE investments (
    investment_id         UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id            UUID            NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
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

## **4. Access Control Schema**

### **7.1 roles**
```sql
CREATE TABLE roles (
    id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id           UUID            NOT NULL REFERENCES accounts(id),
    user_id             UUID            NOT NULL REFERENCES auth.users(user_id),
    role_type           TEXT            NOT NULL,
    can_remove_self     BOOLEAN         NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at          TIMESTAMPTZ,
    deleted_by          UUID            REFERENCES auth.users(user_id),
    
    CONSTRAINT roles_role_type_check
        CHECK (role_type IN ('signer', 'admin', 'editor', 'viewer')),
    CONSTRAINT roles_user_account_unique 
        UNIQUE (user_id, account_id)
);

## **5. Document Schema**

### **8.1 files**
```sql
CREATE TABLE files (
    file_id               UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name             VARCHAR(255)    NOT NULL,
    file_type             TEXT            NOT NULL,
    storage_path          VARCHAR(255)    NOT NULL,
    company_id            UUID            REFERENCES companies(company_id) ON DELETE RESTRICT,
    investment_id         UUID            REFERENCES investments(investment_id) ON DELETE RESTRICT,
    account_id            UUID            REFERENCES accounts(id) ON DELETE RESTRICT,
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

## **6. Indexes**

### **10.1 Primary Access Pattern Indexes**
```sql
-- Account lookups
CREATE INDEX idx_accounts_status ON accounts(account_type) WHERE deleted_at IS NULL;

-- Investment lookups
CREATE INDEX idx_investments_account_id ON investments(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_investments_company_id ON investments(company_id) WHERE deleted_at IS NULL;

-- Role lookups
CREATE INDEX idx_roles_account ON roles(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_user ON roles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_composite ON roles(account_id, user_id, role_type) WHERE deleted_at IS NULL;

-- File lookups
CREATE INDEX idx_files_relationship_ids ON files(company_id, investment_id, account_id) WHERE deleted_at IS NULL;
```

### **10.2 Search Optimization Indexes**
```sql
-- Full text search
CREATE INDEX idx_companies_name_trgm ON companies USING gin(company_name gin_trgm_ops);
CREATE INDEX idx_accounts_name_trgm ON accounts USING gin(legal_name gin_trgm_ops);
CREATE INDEX idx_files_name_trgm ON files USING gin(file_name gin_trgm_ops);
```

### **10.3 JSONB Indexes**
```sql
-- Address searches
CREATE INDEX idx_accounts_personal_details ON accounts USING gin(personal_details jsonb_path_ops);
CREATE INDEX idx_accounts_entity_details ON accounts USING gin(entity_details jsonb_path_ops);
CREATE INDEX idx_accounts_retirement_details ON accounts USING gin(retirement_details jsonb_path_ops);
