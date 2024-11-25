# **LP Portal Database Requirements v2.0**

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

### **3.1 accounts**
```sql
CREATE TABLE accounts (
    account_id            UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_name          VARCHAR(255)    NOT NULL,
    account_type          TEXT            NOT NULL,
    status               TEXT            NOT NULL DEFAULT 'pending',
    created_at           TIMESTAMPTZ     NOT NULL DEFAULT now(),
    created_by           UUID            NOT NULL REFERENCES auth.users(user_id),
    updated_at           TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_by           UUID            NOT NULL REFERENCES auth.users(user_id),
    deleted_at           TIMESTAMPTZ,
    deleted_by           UUID            REFERENCES auth.users(user_id),
    
    CONSTRAINT accounts_account_type_check 
        CHECK (account_type IN ('individual', 'entity', 'trust', 'retirement')),
    CONSTRAINT accounts_status_check 
        CHECK (status IN ('pending', 'active', 'suspended', 'closed'))
);
```

### **3.2 individual_details**
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

### **3.3 entity_details**
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

### **3.4 trust_details**
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

### **3.5 retirement_details**
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

### **3.6 beneficial_owners**
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

### **3.7 erisa_status**
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

### **3.8 accreditation**
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

### **3.9 aml_verification**
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

### **3.10 bank_info**
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

### **3.11 roles**
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

### **3.12 contact_designations**
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

## **4. Indexes**

### **4.1 Primary Access Patterns**
```sql
-- Account lookups
CREATE INDEX idx_accounts_status ON accounts(status) WHERE deleted_at IS NULL;

-- Details lookups
CREATE INDEX idx_individual_details_account ON individual_details(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_entity_details_account ON entity_details(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_trust_details_account ON trust_details(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_retirement_details_account ON retirement_details(account_id) WHERE deleted_at IS NULL;

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
```

### **4.2 Search Optimization**
```sql
-- Full text search on account names
CREATE INDEX idx_accounts_name_trgm ON accounts USING gin(account_name gin_trgm_ops);

-- Search on tax IDs
CREATE INDEX idx_individual_details_tax_id_trgm ON individual_details USING gin(tax_id gin_trgm_ops);
CREATE INDEX idx_entity_details_tax_id_trgm ON entity_details USING gin(tax_id gin_trgm_ops);
CREATE INDEX idx_trust_details_tax_id_trgm ON trust_details USING gin(tax_id gin_trgm_ops);
CREATE INDEX idx_retirement_details_tax_id_trgm ON retirement_details USING gin(tax_id gin_trgm_ops);

-- Search on beneficial owner names
CREATE INDEX idx_beneficial_owners_name_trgm ON beneficial_owners USING gin(name gin_trgm_ops);
```

### **4.3 JSONB Indexes**
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
```

## **5. Row Level Security (RLS) Policies**

### **5.1 Account Access**
```sql
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- View policy for account team members
CREATE POLICY account_view_policy ON accounts
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = accounts.account_id 
            AND deleted_at IS NULL
        )
    );

-- Modification policy for account signers and admins
CREATE POLICY account_modify_policy ON accounts
    FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = accounts.account_id 
            AND role_type IN ('signer', 'admin')
            AND deleted_at IS NULL
        )
    );
```

### **5.2 Details Access**
```sql
-- Apply to all detail tables (individual, entity, trust, retirement)
ALTER TABLE individual_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE retirement_details ENABLE ROW LEVEL SECURITY;

-- Example for individual_details (repeat for other detail tables)
CREATE POLICY details_view_policy ON individual_details
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = individual_details.account_id 
            AND deleted_at IS NULL
        )
    );

CREATE POLICY details_modify_policy ON individual_details
    FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = individual_details.account_id 
            AND role_type IN ('signer', 'admin')
            AND deleted_at IS NULL
        )
    );
```

### **5.3 Beneficial Owner Access**
```sql
ALTER TABLE beneficial_owners ENABLE ROW LEVEL SECURITY;

CREATE POLICY beneficial_owners_view_policy ON beneficial_owners
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id IN (
                SELECT account_id 
                FROM entity_details 
                WHERE id = beneficial_owners.parent_id
                UNION
                SELECT account_id 
                FROM trust_details 
                WHERE id = beneficial_owners.parent_id
                UNION
                SELECT account_id 
                FROM retirement_details 
                WHERE id = beneficial_owners.parent_id
            )
            AND deleted_at IS NULL
        )
    );
```

### **5.4 Role Management**
```sql
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- View policy for account team members
CREATE POLICY roles_view_policy ON roles
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = roles.account_id 
            AND deleted_at IS NULL
        )
    );

-- Modification policy for signers and admins
CREATE POLICY roles_modify_policy ON roles
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = roles.account_id 
            AND role_type IN ('signer', 'admin')
            AND deleted_at IS NULL
        )
    );
```

## **6. Data Validation Functions**

### **6.1 Tax ID Validation**
```sql
CREATE OR REPLACE FUNCTION validate_tax_id(
    tax_id_type TEXT,
    tax_id TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    CASE tax_id_type
        WHEN 'ssn' THEN
            RETURN tax_id ~ '^[0-9]{3}-[0-9]{2}-[0-9]{4}$';
        WHEN 'itin' THEN
            RETURN tax_id ~ '^9[0-9]{2}-[0-9]{2}-[0-9]{4}$';
        WHEN 'ein' THEN
            RETURN tax_id ~ '^[0-9]{2}-[0-9]{7}$';
        ELSE
            RETURN TRUE;
    END CASE;
END;
$$ LANGUAGE plpgsql;
```

### **6.2 Ownership Validation**
```sql
CREATE OR REPLACE FUNCTION validate_ownership_percentage(
    parent_id UUID,
    parent_type TEXT
) RETURNS TRIGGER AS $$
BEGIN
    -- Check that total ownership doesn't exceed 100%
    IF (
        SELECT SUM(ownership_percent)
        FROM beneficial_owners
        WHERE parent_id = NEW.parent_id
        AND parent_type = NEW.parent_type
        AND deleted_at IS NULL
    ) > 100 THEN
        RAISE EXCEPTION 'Total ownership percentage cannot exceed 100%%';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_ownership_percentage
    BEFORE INSERT OR UPDATE ON beneficial_owners
    FOR EACH ROW
    EXECUTE FUNCTION validate_ownership_percentage();
```

## **7. Migration Notes**

1. **Order of Table Creation**
   - Create base accounts table first
   - Create detail tables (individual, entity, trust, retirement)
   - Create supporting tables (beneficial_owners, erisa_status)
   - Create relationship tables (roles, contact_designations)
   - Add indexes and RLS policies last

2. **Data Migration Considerations**
   - Validate all tax IDs before insertion
   - Ensure ownership percentages sum correctly
   - Verify all JSON structures match expected schemas
   - Maintain audit trail during migration

3. **Post-Migration Verification**
   - Verify all RLS policies are working as expected
   - Test all access patterns with indexes
   - Validate data integrity across relationships
   - Check performance of common queries