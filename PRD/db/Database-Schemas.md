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
    is_gp_admin           BOOLEAN         NOT NULL DEFAULT false,
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
```

### **2.2 accounts**
```sql
CREATE TABLE accounts (
    account_id            UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_name          VARCHAR(255)    NOT NULL,
    account_type          TEXT            NOT NULL,
    status               TEXT            NOT NULL DEFAULT 'pending',
    kyc_status           TEXT            NOT NULL DEFAULT 'not_started',
    accreditation_status TEXT            NOT NULL DEFAULT 'pending_verification',
    created_at           TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by           UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at           TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by           UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at           TIMESTAMPTZ,
    deleted_by           UUID            REFERENCES auth.users(user_id),
    
    CONSTRAINT accounts_account_type_check 
        CHECK (account_type IN ('individual', 'entity', 'trust', 'retirement')),
    CONSTRAINT accounts_status_check 
        CHECK (status IN ('pending', 'active', 'suspended', 'closed')),
    CONSTRAINT accounts_kyc_status_check 
        CHECK (kyc_status IN ('not_started', 'in_progress', 'completed', 'expired')),
    CONSTRAINT accounts_accreditation_status_check 
        CHECK (accreditation_status IN ('accredited', 'not_accredited', 'pending_verification'))
);
```

## **3. Account Details Schema**

### **3.1 individual_details**
```sql
CREATE TABLE individual_details (
    id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id           UUID            NOT NULL REFERENCES accounts(account_id),
    tax_id_type         TEXT            NOT NULL,
    tax_id              VARCHAR(50)     NOT NULL,
    us_person           BOOLEAN         NOT NULL,
    tax_year_end        VARCHAR(10),
    joint_account       BOOLEAN         NOT NULL DEFAULT false,
    joint_holder_info   JSONB           DEFAULT '{}',
    professional_title  VARCHAR(255),
    employer            VARCHAR(255),
    acting_as_nominee   BOOLEAN         NOT NULL DEFAULT false,
    mailing_address     JSONB           NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at          TIMESTAMPTZ,
    deleted_by          UUID            REFERENCES auth.users(user_id),

    CONSTRAINT individual_details_tax_id_type_check
        CHECK (tax_id_type IN ('ssn', 'itin', 'foreign'))
);
```

### **3.2 entity_details**
```sql
CREATE TABLE entity_details (
    id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id           UUID            NOT NULL REFERENCES accounts(account_id),
    entity_type          TEXT            NOT NULL,
    tax_id              VARCHAR(50)     NOT NULL,
    jurisdiction        VARCHAR(100)    NOT NULL,
    formation_date      DATE            NOT NULL,
    us_person           BOOLEAN         NOT NULL,
    tax_year_end        VARCHAR(10),
    tax_exempt          BOOLEAN         NOT NULL DEFAULT false,
    investment_company_status BOOLEAN   NOT NULL DEFAULT false,
    bank_entity_status  BOOLEAN         NOT NULL DEFAULT false,
    formed_to_invest    BOOLEAN         NOT NULL DEFAULT false,
    public_reporting_entity BOOLEAN     NOT NULL DEFAULT false,
    fatf_jurisdiction   BOOLEAN         NOT NULL DEFAULT true,
    mailing_address     JSONB           NOT NULL DEFAULT '{}',
    principal_place_business JSONB      NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at          TIMESTAMPTZ,
    deleted_by          UUID            REFERENCES auth.users(user_id),

    CONSTRAINT entity_details_entity_type_check
        CHECK (entity_type IN ('corporation', 'partnership', 'llc', 'other'))
);
```

### **3.3 trust_details**
```sql
CREATE TABLE trust_details (
    id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id           UUID            NOT NULL REFERENCES accounts(account_id),
    trust_type          TEXT            NOT NULL,
    tax_id              VARCHAR(50)     NOT NULL,
    us_person           BOOLEAN         NOT NULL,
    tax_year_end        VARCHAR(10),
    revocable           BOOLEAN         NOT NULL,
    formation_date      DATE            NOT NULL,
    formed_to_invest    BOOLEAN         NOT NULL DEFAULT false,
    grantor_trust       BOOLEAN         NOT NULL DEFAULT false,
    mailing_address     JSONB           NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at          TIMESTAMPTZ,
    deleted_by          UUID            REFERENCES auth.users(user_id),

    CONSTRAINT trust_details_trust_type_check
        CHECK (trust_type IN ('living', 'testamentary', 'charitable', 'business'))
);
```

### **3.4 retirement_details**
```sql
CREATE TABLE retirement_details (
    id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id           UUID            NOT NULL REFERENCES accounts(account_id),
    plan_type           TEXT            NOT NULL,
    tax_id              VARCHAR(50)     NOT NULL,
    tax_year_end        VARCHAR(10),
    self_directed       BOOLEAN         NOT NULL DEFAULT false,
    custodian_info      JSONB           NOT NULL DEFAULT '{}',
    mailing_address     JSONB           NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at          TIMESTAMPTZ,
    deleted_by          UUID            REFERENCES auth.users(user_id),

    CONSTRAINT retirement_details_plan_type_check
        CHECK (plan_type IN ('traditional_ira', 'roth_ira', '401k', 'other'))
);
```

## **4. Investment Schema**

### **4.1 investments**
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

### **4.2 beneficial_owners**
```sql
CREATE TABLE beneficial_owners (
    id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id            UUID            NOT NULL,
    parent_type          TEXT            NOT NULL,
    owner_type          TEXT            NOT NULL,
    name                VARCHAR(255)    NOT NULL,
    ownership_percent   NUMERIC(5,2)    NOT NULL,
    relationship_type   TEXT            NOT NULL,
    control_person      BOOLEAN         NOT NULL DEFAULT false,
    tax_id              VARCHAR(50)     NOT NULL,
    citizenship         VARCHAR(100)    NOT NULL,
    employment_info     JSONB           DEFAULT '{}',
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at          TIMESTAMPTZ,
    deleted_by          UUID            REFERENCES auth.users(user_id),

    CONSTRAINT beneficial_owners_parent_type_check
        CHECK (parent_type IN ('entity_details', 'trust_details', 'retirement_details')),
    CONSTRAINT beneficial_owners_owner_type_check
        CHECK (owner_type IN ('individual', 'entity')),
    CONSTRAINT beneficial_owners_relationship_type_check
        CHECK (relationship_type IN ('shareholder', 'partner', 'member', 'trustee', 'beneficiary')),
    CONSTRAINT beneficial_owners_ownership_percent_check
        CHECK (ownership_percent >= 0 AND ownership_percent <= 100)
);
```

### **4.3 erisa_status**
```sql
CREATE TABLE erisa_status (
    id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id            UUID            NOT NULL,
    parent_type          TEXT            NOT NULL,
    subject_to_erisa    BOOLEAN         NOT NULL DEFAULT false,
    benefit_plan_percentage NUMERIC(5,2),
    fiduciary_name      VARCHAR(255),
    governmental_plan   BOOLEAN         NOT NULL DEFAULT false,
    church_plan         BOOLEAN         NOT NULL DEFAULT false,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at          TIMESTAMPTZ,
    deleted_by          UUID            REFERENCES auth.users(user_id),

    CONSTRAINT erisa_status_parent_type_check
        CHECK (parent_type IN ('entity_details', 'retirement_details')),
    CONSTRAINT erisa_status_benefit_plan_percentage_check
        CHECK (benefit_plan_percentage IS NULL OR 
               (benefit_plan_percentage >= 0 AND benefit_plan_percentage <= 100))
);
```

## **5. Compliance Schema**

### **5.1 accreditation**
```sql
CREATE TABLE accreditation (
    id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id           UUID            NOT NULL REFERENCES accounts(account_id),
    qualification_type   TEXT            NOT NULL,
    qualification_details JSONB          NOT NULL DEFAULT '{}',
    verified_at         TIMESTAMPTZ,
    expires_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at          TIMESTAMPTZ,
    deleted_by          UUID            REFERENCES auth.users(user_id),

    CONSTRAINT accreditation_qualification_type_check
        CHECK (qualification_type IN ('income', 'net_worth', 'professional', 'entity'))
);
```

### **5.2 aml_verification**
```sql
CREATE TABLE aml_verification (
    id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id           UUID            NOT NULL REFERENCES accounts(account_id),
    verification_type    TEXT            NOT NULL,
    verification_details JSONB           NOT NULL DEFAULT '{}',
    pep_status          BOOLEAN         NOT NULL DEFAULT false,
    sanctions_check     BOOLEAN         NOT NULL DEFAULT false,
    verified_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at          TIMESTAMPTZ,
    deleted_by          UUID            REFERENCES auth.users(user_id),

    CONSTRAINT aml_verification_type_check
        CHECK (verification_type IN ('manual', 'automated', 'third_party'))
);
```

## **6. Banking Schema**

### **6.1 bank_info**
```sql
CREATE TABLE bank_info (
    id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id           UUID            NOT NULL REFERENCES accounts(account_id),
    bank_name           VARCHAR(255)    NOT NULL,
    account_name        VARCHAR(255)    NOT NULL,
    account_number      VARCHAR(255)    NOT NULL,
    routing_number      VARCHAR(50)     NOT NULL,
    swift_code          VARCHAR(50),
    bank_address        JSONB           NOT NULL DEFAULT '{}',
    bank_country        VARCHAR(100)    NOT NULL,
    primary_account     BOOLEAN         NOT NULL DEFAULT false,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at          TIMESTAMPTZ,
    deleted_by          UUID            REFERENCES auth.users(user_id)
);
```

## **7. Access Control Schema**

### **7.1 roles**
```sql
CREATE TABLE roles (
    id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id           UUID            NOT NULL REFERENCES accounts(account_id),
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
```

### **7.2 contact_designations**
```sql
CREATE TABLE contact_designations (
    id                   UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id              UUID            NOT NULL REFERENCES roles(id),
    designation_type     TEXT            NOT NULL,
    contact_preferences  JSONB           NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by          UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at          TIMESTAMPTZ,
    deleted_by          UUID            REFERENCES auth.users(user_id),

    CONSTRAINT contact_designations_type_check
        CHECK (designation_type IN ('primary', 'tax', 'legal', 'operations'))
);
```

## **8. Document Schema**

### **8.1 files**
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

### **8.2 file_access_logs**
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

## **9. Activity Schema**

### **9.1 activities**
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

## **10. Indexes**

### **10.1 Primary Access Pattern Indexes**
```sql
-- Account lookups
CREATE INDEX idx_accounts_status ON accounts(status) WHERE deleted_at IS NULL;

-- Details lookups
CREATE INDEX idx_individual_details_account ON individual_details(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_entity_details_account ON entity_details(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_trust_details_account ON trust_details(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_retirement_details_account ON retirement_details(account_id) WHERE deleted_at IS NULL;

-- Investment lookups
CREATE INDEX idx_investments_account_id ON investments(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_investments_company_id ON investments(company_id) WHERE deleted_at IS NULL;

-- Beneficial ownership lookups
CREATE INDEX idx_beneficial_owners_parent ON beneficial_owners(parent_id, parent_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_beneficial_owners_tax_id ON beneficial_owners(tax_id) WHERE deleted_at IS NULL;

-- Bank information lookups
CREATE INDEX idx_bank_info_account ON bank_info(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_bank_info_primary ON bank_info(account_id, primary_account) WHERE deleted_at IS NULL AND primary_account = true;

-- Role lookups
CREATE INDEX idx_roles_account ON roles(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_user ON roles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_composite ON roles(account_id, user_id, role_type) WHERE deleted_at IS NULL;

-- Contact designation lookups
CREATE INDEX idx_contact_designations_role ON contact_designations(role_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_contact_designations_type ON contact_designations(role_id, designation_type) WHERE deleted_at IS NULL;

-- File lookups
CREATE INDEX idx_files_relationship_ids ON files(company_id, investment_id, account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_file_access_logs_file_id ON file_access_logs(file_id);

-- Activity lookups
CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id) WHERE deleted_at IS NULL;
```

### **10.2 Search Optimization Indexes**
```sql
-- Full text search
CREATE INDEX idx_companies_name_trgm ON companies USING gin(company_name gin_trgm_ops);
CREATE INDEX idx_accounts_name_trgm ON accounts USING gin(account_name gin_trgm_ops);
CREATE INDEX idx_files_name_trgm ON files USING gin(file_name gin_trgm_ops);

-- Tax ID search
CREATE INDEX idx_individual_details_tax_id_trgm ON individual_details USING gin(tax_id gin_trgm_ops);
CREATE INDEX idx_entity_details_tax_id_trgm ON entity_details USING gin(tax_id gin_trgm_ops);
CREATE INDEX idx_trust_details_tax_id_trgm ON trust_details USING gin(tax_id gin_trgm_ops);
CREATE INDEX idx_retirement_details_tax_id_trgm ON retirement_details USING gin(tax_id gin_trgm_ops);

-- Beneficial owner search
CREATE INDEX idx_beneficial_owners_name_trgm ON beneficial_owners USING gin(name gin_trgm_ops);
```

### **10.3 JSONB Indexes**
```sql
-- Address searches
CREATE INDEX idx_individual_details_address ON individual_details USING gin(mailing_address jsonb_path_ops);
CREATE INDEX idx_entity_details_address ON entity_details USING gin(mailing_address jsonb_path_ops);
CREATE INDEX idx_trust_details_address ON trust_details USING gin(mailing_address jsonb_path_ops);
CREATE INDEX idx_retirement_details_address ON retirement_details USING gin(mailing_address jsonb_path_ops);

-- Bank address searches
CREATE INDEX idx_bank_info_address ON bank_info USING gin(bank_address jsonb_path_ops);

-- Contact preferences
CREATE INDEX idx_contact_designations_preferences ON contact_designations USING gin(contact_preferences jsonb_path_ops);

-- Activity metadata
CREATE INDEX idx_activities_metadata ON activities USING gin(metadata);
CREATE INDEX idx_activities_read_status ON activities USING gin(read_status);
