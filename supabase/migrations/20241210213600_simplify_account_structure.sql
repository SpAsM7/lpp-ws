-- Simplify account structure by consolidating all account types into a single table
-- with JSONB fields for type-specific details

-- Drop existing detail tables if they exist
DROP TABLE IF EXISTS individual_details CASCADE;
DROP TABLE IF EXISTS entity_details CASCADE;
DROP TABLE IF EXISTS trust_details CASCADE;
DROP TABLE IF EXISTS retirement_details CASCADE;

-- Drop existing account type ENUMs if they exist
DROP TYPE IF EXISTS account_type CASCADE;
DROP TYPE IF EXISTS account_subtype CASCADE;

-- Drop existing constraints if they exist
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_account_type_check;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_account_subtype_check;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_status_check;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS valid_personal_details;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS valid_retirement_details;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS valid_entity_details;

-- Temporarily alter updated_by to allow nulls
ALTER TABLE accounts ALTER COLUMN updated_by DROP NOT NULL;
ALTER TABLE accounts ALTER COLUMN created_by DROP NOT NULL;

-- Temporarily disable triggers during migration
ALTER TABLE accounts DISABLE TRIGGER log_account_activity;

-- Modify accounts table to support new structure
ALTER TABLE accounts
DROP COLUMN IF EXISTS account_type_id CASCADE;

-- Add new columns for simplified structure
ALTER TABLE accounts
ADD COLUMN IF NOT EXISTS account_type TEXT,
ADD COLUMN IF NOT EXISTS account_subtype TEXT,
ADD COLUMN IF NOT EXISTS tax_id VARCHAR(50), 
ADD COLUMN IF NOT EXISTS status TEXT,
ADD COLUMN IF NOT EXISTS personal_details JSONB,
ADD COLUMN IF NOT EXISTS retirement_details JSONB,
ADD COLUMN IF NOT EXISTS entity_details JSONB,
ADD COLUMN IF NOT EXISTS address JSONB,
ADD COLUMN IF NOT EXISTS qualifications JSONB,
ADD COLUMN IF NOT EXISTS compliance_info JSONB;

-- Temporarily alter activities table constraints
ALTER TABLE activities ALTER COLUMN created_by DROP NOT NULL;

-- Allow NULL values
ALTER TABLE accounts ALTER COLUMN account_type DROP NOT NULL;
ALTER TABLE accounts ALTER COLUMN account_subtype DROP NOT NULL;
ALTER TABLE accounts ALTER COLUMN status DROP NOT NULL;

-- First set any invalid account_types to NULL
UPDATE accounts 
SET account_type = NULL
WHERE account_type NOT IN ('personal', 'entity', 'retirement', 'special_other');

-- Then update audit fields
UPDATE accounts 
SET 
    status = COALESCE(status, 'pending'),
    updated_at = CURRENT_TIMESTAMP,
    updated_by = COALESCE(updated_by, '00000000-0000-0000-0000-000000000000'::uuid),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    created_by = COALESCE(created_by, '00000000-0000-0000-0000-000000000000'::uuid);

-- Add constraints that allow NULL but validate values when present
ALTER TABLE accounts
ADD CONSTRAINT accounts_account_type_check 
    CHECK (account_type IS NULL OR account_type IN ('personal', 'entity', 'retirement', 'special_other'));

ALTER TABLE accounts
ADD CONSTRAINT accounts_account_subtype_check 
    CHECK (
        (account_type IS NULL OR account_type = 'personal' AND account_subtype IN ('individual', 'joint'))
        OR
        (account_type IS NULL OR account_type = 'entity' AND account_subtype IN ('LLC', 'trust', 'partnership', 'corporation', 'non_profit'))
        OR
        (account_type IS NULL OR account_type = 'retirement' AND account_subtype IN ('IRA', '401k'))
        OR
        (account_type IS NULL OR account_type = 'special_other')
    );

ALTER TABLE accounts
ADD CONSTRAINT accounts_status_check
    CHECK (status IS NULL OR status IN ('pending', 'active', 'closed'));

-- Add constraints for JSONB field requirements with relaxed validation
ALTER TABLE accounts
ADD CONSTRAINT valid_personal_details 
    CHECK (
        account_type IS NULL OR account_type != 'personal' 
        OR personal_details IS NULL 
        OR (personal_details ? 'owners')
    );

ALTER TABLE accounts
ADD CONSTRAINT valid_retirement_details 
    CHECK (
        account_type IS NULL OR account_type != 'retirement' 
        OR retirement_details IS NULL 
        OR (retirement_details ? 'custodian_name')
    );

ALTER TABLE accounts
ADD CONSTRAINT valid_entity_details 
    CHECK (
        account_type IS NULL OR account_type != 'entity'
        OR entity_details IS NULL
        OR (
            entity_details ? 'formation_state' AND
            entity_details ? 'formation_country'
        )
    );

-- Add function to validate JSONB fields with relaxed requirements
CREATE OR REPLACE FUNCTION validate_account_jsonb_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate personal_details for personal accounts
    IF NEW.account_type = 'personal' 
       AND NEW.personal_details IS NOT NULL 
       AND (NOT (NEW.personal_details ? 'owners')) THEN
        RAISE EXCEPTION 'Invalid personal_details structure: missing owners array';
    END IF;

    -- Validate entity_details for entity accounts
    IF NEW.account_type = 'entity' 
       AND NEW.entity_details IS NOT NULL 
       AND NOT (
           NEW.entity_details ? 'formation_state' AND
           NEW.entity_details ? 'formation_country'
       ) THEN
        RAISE EXCEPTION 'Invalid entity_details structure: missing required fields';
    END IF;

    -- Entity-specific validation only when specific info is provided
    IF NEW.account_type = 'entity' AND NEW.entity_details IS NOT NULL 
       AND NEW.entity_details ? 'entity_specific_info' THEN
        CASE NEW.account_subtype
            WHEN 'trust' THEN
                IF NEW.entity_details->'entity_specific_info' ? 'trust' 
                   AND NOT (
                       NEW.entity_details->'entity_specific_info'->'trust' ? 'trust_type'
                   ) THEN
                    RAISE EXCEPTION 'Invalid trust details: missing required fields';
                END IF;
            WHEN 'corporation' THEN
                IF NEW.entity_details->'entity_specific_info' ? 'corporation'
                   AND NOT (
                       NEW.entity_details->'entity_specific_info'->'corporation' ? 'corp_type'
                   ) THEN
                    RAISE EXCEPTION 'Invalid corporation details: missing required fields';
                END IF;
            WHEN 'LLC' THEN
                IF NEW.entity_details->'entity_specific_info' ? 'llc'
                   AND NOT (
                       NEW.entity_details->'entity_specific_info'->'llc' ? 'type'
                   ) THEN
                    RAISE EXCEPTION 'Invalid LLC details: missing required fields';
                END IF;
            WHEN 'partnership' THEN
                IF NEW.entity_details->'entity_specific_info' ? 'partnership'
                   AND NOT (
                       NEW.entity_details->'entity_specific_info'->'partnership' ? 'partnership_type'
                   ) THEN
                    RAISE EXCEPTION 'Invalid partnership details: missing required fields';
                END IF;
            WHEN 'non_profit' THEN
                IF NEW.entity_details->'entity_specific_info' ? 'non_profit'
                   AND NOT (
                       NEW.entity_details->'entity_specific_info'->'non_profit' ? 'tax_exempt_status'
                   ) THEN
                    RAISE EXCEPTION 'Invalid non-profit details: missing required fields';
                END IF;
        END CASE;
    END IF;

    -- Validate retirement_details for retirement accounts
    IF NEW.account_type = 'retirement' 
       AND NEW.retirement_details IS NOT NULL 
       AND NOT (NEW.retirement_details ? 'custodian_name') THEN
        RAISE EXCEPTION 'Invalid retirement_details structure: missing custodian_name';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for JSONB validation
CREATE TRIGGER validate_account_jsonb
    BEFORE INSERT OR UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION validate_account_jsonb_fields();

-- Add indexes for common access patterns
CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts(account_type) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_accounts_subtype ON accounts(account_subtype) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_accounts_tax_id ON accounts(tax_id) WHERE deleted_at IS NULL;

-- Add JSONB indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_accounts_personal_details ON accounts USING gin(personal_details jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_accounts_entity_details ON accounts USING gin(entity_details jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_accounts_retirement_details ON accounts USING gin(retirement_details jsonb_path_ops);

-- Update RLS policies
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

-- Insert policy for account team members
CREATE POLICY account_insert_policy ON accounts
    FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = accounts.account_id 
            AND deleted_at IS NULL
            AND role_type = 'admin'
        )
    );

-- Update policy for account team members
CREATE POLICY account_update_policy ON accounts
    FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = accounts.account_id 
            AND deleted_at IS NULL
            AND role_type = 'admin'
        )
    );

-- Delete policy for account team members
CREATE POLICY account_delete_policy ON accounts
    FOR DELETE
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = accounts.account_id 
            AND deleted_at IS NULL
            AND role_type = 'admin'
        )
    );

-- Comment on table and columns
COMMENT ON TABLE accounts IS 'Stores all account information with type-specific details in JSONB fields';
COMMENT ON COLUMN accounts.account_type IS 'Type of account: personal, entity, retirement, or special_other';
COMMENT ON COLUMN accounts.account_subtype IS 'Specific subtype based on account_type';
COMMENT ON COLUMN accounts.tax_id IS 'Tax identification number (SSN, ITIN, or EIN) based on account type';
COMMENT ON COLUMN accounts.personal_details IS 'JSONB field containing personal account specific details';
COMMENT ON COLUMN accounts.entity_details IS 'JSONB field containing entity account specific details';
COMMENT ON COLUMN accounts.retirement_details IS 'JSONB field containing retirement account specific details';
COMMENT ON COLUMN accounts.address IS 'JSONB field containing account address';
COMMENT ON COLUMN accounts.qualifications IS 'JSONB field containing account qualifications';
COMMENT ON COLUMN accounts.compliance_info IS 'JSONB field containing account compliance information';
