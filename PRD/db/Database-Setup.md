# **Database Setup and Configuration**

## **1. Prerequisites**

### **1.1 Required Extensions**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- For UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- For text search
```

## **2. Conventions**

### **2.1 Standard Field Types**
- **Primary Keys**
  - Type: UUID
  - Default: uuid_generate_v4()
  - Always NOT NULL

- **Foreign Keys**
  - Type: UUID
  - Constraint: ON DELETE RESTRICT, ON UPDATE RESTRICT
  - Always NOT NULL when referencing required relationships

- **Timestamps**
  - Type: TIMESTAMPTZ
  - Stored in UTC
  - Default: now() for creation timestamps

- **Money/Financial**
  - Type: BIGINT
  - Represents cents/smallest currency unit
  - Avoids floating-point precision issues
  - Always NOT NULL with DEFAULT 0

- **Text Fields**
  - Short Text: VARCHAR(255)
  - Long Text: TEXT
  - Always use VARCHAR with specified length for predictable storage

- **Status Fields**
  - Type: TEXT
  - Always has CHECK constraints for valid values
  - Always NOT NULL with DEFAULT value

- **Boolean Flags**
  - Type: BOOLEAN
  - Always NOT NULL with DEFAULT value
  - Use positive naming (e.g., is_active vs not_disabled)

- **JSON Data**
  - Type: JSONB
  - DEFAULT '{}'
  - Use JSONB over JSON for indexing and querying

### **2.2 Standard Audit Fields**
Every table must include these audit fields:
```sql
created_at    TIMESTAMPTZ    NOT NULL DEFAULT now(),
created_by    UUID           NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
updated_at    TIMESTAMPTZ    NOT NULL DEFAULT now(),
updated_by    UUID           NOT NULL REFERENCES auth.users(user_id) ON DELETE RESTRICT,
deleted_at    TIMESTAMPTZ,
deleted_by    UUID           REFERENCES auth.users(user_id) ON DELETE RESTRICT
```

### **2.2 JSONB Field Standards**
- **Structure**
  - Use nested objects sparingly
  - Keep structure flat when possible
  - Always include version field for schema evolution
  - Use consistent naming across all JSONB fields

- **Account Type-Specific JSONB Fields**
  ```sql
  -- Personal Account Details
  {
    "version": "1.0",
    "owners": [
      {
        "name": "string",
        "ownership_percentage": "number?"  // Required for joint accounts
      }
    ]
  }

  -- Entity Account Details
  {
    "version": "1.0",
    "formation_date": "date",
    "formation_state": "string",
    "formation_country": "string",
    "fiscal_year_end": "date",
    "is_privately_held": "boolean",
    "is_foreign": "boolean",
    "entity_specific_info": {
      "trust": {
        "trust_type": "string",
        "grantor_status": "string",
        "beneficiary": "string"
      }
    }
  }

  -- Retirement Account Details
  {
    "version": "1.0",
    "custodian_name": "string",
    "plan_name": "string?"  // Required for 401k
  }
  ```

### **2.3 Account Type Validation**
```sql
-- Account type and subtype validation using CHECK constraints
ALTER TABLE accounts ADD CONSTRAINT accounts_account_type_check 
    CHECK (account_type IN ('personal', 'entity', 'retirement', 'special_other'));

ALTER TABLE accounts ADD CONSTRAINT accounts_account_subtype_check 
    CHECK (
        (account_type = 'personal' AND account_subtype IN ('individual', 'joint'))
        OR
        (account_type = 'entity' AND account_subtype IN ('LLC', 'trust', 'partnership', 'corporation'))
        OR
        (account_type = 'retirement' AND account_subtype IN ('IRA', '401k'))
        OR
        (account_type = 'special_other')
    );

-- JSONB field validation
ALTER TABLE accounts ADD CONSTRAINT valid_personal_details 
    CHECK (
        (account_type = 'personal' AND personal_details IS NOT NULL)
        OR account_type != 'personal'
    );

ALTER TABLE accounts ADD CONSTRAINT valid_retirement_details 
    CHECK (
        (account_type = 'retirement' AND retirement_details IS NOT NULL)
        OR account_type != 'retirement'
    );

ALTER TABLE accounts ADD CONSTRAINT valid_entity_details 
    CHECK (
        (account_type = 'entity' AND entity_details IS NOT NULL)
        OR account_type != 'entity'
    );
```

### **2.3 Naming Conventions**

#### **Tables**
- Use plural, snake_case names
- Prefix with schema name in SQL
- Examples: auth.users, public.companies

#### **Columns**
- Use singular, snake_case names
- Suffix _id for primary and foreign keys
- Suffix _at for timestamps
- Suffix _by for user references
- Examples: user_id, created_at, updated_by

#### **Constraints**
- Primary Keys: pk_[table]
- Foreign Keys: fk_[table]_[referenced_table]
- Unique: uq_[table]_[column(s)]
- Check: ck_[table]_[column]_[rule]
- Examples: pk_users, fk_roles_users, uq_roles_user_account

#### **Indexes**
- Prefix with idx_
- Include table name
- Describe indexed columns
- Examples: idx_users_email, idx_companies_name_trgm

## **3. Configuration Guidelines**

### **3.1 Database Settings**
```sql
-- Time zone handling
SET timezone = 'UTC';

-- Text search configuration
SET default_text_search_config = 'pg_catalog.english';

-- Statement timeout
SET statement_timeout = '60s';

-- Lock timeout
SET lock_timeout = '10s';

-- Idle transaction timeout
SET idle_in_transaction_session_timeout = '60s';
```

### **3.2 Connection Settings**
```sql
-- Maximum connections
ALTER SYSTEM SET max_connections = '100';

-- Idle session timeout
ALTER SYSTEM SET idle_session_timeout = '1h';

-- Connection pooling (using PgBouncer)
SET pool_mode = 'transaction';
SET default_pool_size = 20;
```

### **3.3 Memory Settings**
```sql
-- Work memory
ALTER SYSTEM SET work_mem = '32MB';

-- Maintenance work memory
ALTER SYSTEM SET maintenance_work_mem = '256MB';

-- Shared buffers
ALTER SYSTEM SET shared_buffers = '1GB';
```

## **4. Security Configuration**

### **4.1 Authentication**
```sql
-- Managed by Supabase Auth
-- Custom configuration in auth schema
ALTER SYSTEM SET password_encryption = 'scram-sha-256';
```

### **4.2 Role Setup**
```sql
-- Application roles
CREATE ROLE app_user;
CREATE ROLE app_admin;

-- Read-only role for reporting
CREATE ROLE readonly;
```

### **4.3 Schema Security**
```sql
-- Restrict schema creation
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- Grant usage on necessary schemas
GRANT USAGE ON SCHEMA public TO app_user;
GRANT USAGE ON SCHEMA auth TO app_user;
```

## **5. Maintenance Configuration**

### **5.1 Backup Settings**
```sql
-- WAL retention
ALTER SYSTEM SET wal_keep_segments = 32;

-- Archive command
ALTER SYSTEM SET archive_command = 'test ! -f /mnt/archive/%f && cp %p /mnt/archive/%f';

-- Archive timeout
ALTER SYSTEM SET archive_timeout = '1h';
```

### **5.2 Vacuum Settings**
```sql
-- Autovacuum configuration
ALTER SYSTEM SET autovacuum = on;
ALTER SYSTEM SET autovacuum_vacuum_threshold = 50;
ALTER SYSTEM SET autovacuum_analyze_threshold = 50;
ALTER SYSTEM SET autovacuum_vacuum_scale_factor = 0.2;
ALTER SYSTEM SET autovacuum_analyze_scale_factor = 0.1;
```

## **6. Setup Notes**

1. All timestamps must be stored in UTC
2. All financial calculations must use BIGINT to avoid floating-point issues
3. All tables must implement soft deletion through deleted_at field
4. All foreign keys must use ON DELETE RESTRICT to prevent orphaned records
5. All JSONB structures must be validated at the application level
6. All tables must have appropriate indexes for common access patterns
7. All status fields must have CHECK constraints
8. All text search fields must have trigram indexes
9. All audit fields must be properly maintained
10. All tables must have appropriate RLS policies

## **7. GP Role Indexes**

### **7.1 GP Role Indexes**
```sql
-- Add GP role indexes
CREATE INDEX idx_gp_roles_user ON gp_roles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_gp_roles_type ON gp_roles(role_type) WHERE deleted_at IS NULL;

-- Add user type indexes
CREATE INDEX idx_user_profiles_gp ON user_profiles(user_id) WHERE is_gp_user = true;
CREATE INDEX idx_user_profiles_lp ON user_profiles(user_id) WHERE is_lp_user = true;
