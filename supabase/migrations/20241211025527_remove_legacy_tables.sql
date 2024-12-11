-- Migration: Remove legacy tables and update schema structure
-- Description: Removes legacy tables and updates primary keys and table names for consistency

-- Step 1: Save data for potential rollback
CREATE TABLE IF NOT EXISTS public.legacy_data_backup AS
SELECT 
    'accreditation' as table_name,
    row_to_json(t.*) as data
FROM public.accreditation t
UNION ALL
SELECT 
    'aml_verification' as table_name,
    row_to_json(t.*) as data
FROM public.aml_verification t
UNION ALL
SELECT 
    'beneficial_owners' as table_name,
    row_to_json(t.*) as data
FROM public.beneficial_owners t
UNION ALL
SELECT 
    'contact_designations' as table_name,
    row_to_json(t.*) as data
FROM public.contact_designations t
UNION ALL
SELECT 
    'erisa_status' as table_name,
    row_to_json(t.*) as data
FROM public.erisa_status t;

-- Step 2: Handle roles table rename first (as other tables might depend on it)
ALTER TABLE public.roles DROP CONSTRAINT IF EXISTS roles_pkey CASCADE;
ALTER TABLE public.roles RENAME COLUMN id TO lp_id;
ALTER TABLE public.roles RENAME TO lp_roles;
ALTER TABLE public.lp_roles ADD PRIMARY KEY (lp_id);

-- Step 3: Drop legacy tables
DROP TABLE IF EXISTS public.accreditation CASCADE;
DROP TABLE IF EXISTS public.aml_verification CASCADE;
DROP TABLE IF EXISTS public.beneficial_owners CASCADE;
DROP TABLE IF EXISTS public.contact_designations CASCADE;
DROP TABLE IF EXISTS public.erisa_status CASCADE;

-- Step 4: Update other primary keys
-- bank_info: id -> bank_id
ALTER TABLE public.bank_info DROP CONSTRAINT IF EXISTS bank_info_pkey CASCADE;
ALTER TABLE public.bank_info RENAME COLUMN id TO bank_id;
ALTER TABLE public.bank_info ADD PRIMARY KEY (bank_id);

-- gp_roles: id -> gp_id
ALTER TABLE public.gp_roles DROP CONSTRAINT IF EXISTS gp_roles_pkey CASCADE;
ALTER TABLE public.gp_roles RENAME COLUMN id TO gp_id;
ALTER TABLE public.gp_roles ADD PRIMARY KEY (gp_id);

-- Step 5: Remove deprecated fields from accounts table (do this last as it might have many dependencies)
-- Drop any policies that might reference these columns
DO $$ 
DECLARE
    policy_name text;
BEGIN
    -- Drop any policies that reference these columns
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'accounts' 
          AND schemaname = 'public'
          AND (policyname LIKE '%kyc%' OR policyname LIKE '%accreditation%')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(policy_name) || ' ON public.accounts';
    END LOOP;
END $$;

-- Now drop the columns with CASCADE to handle any remaining dependencies
ALTER TABLE public.accounts 
    DROP COLUMN IF EXISTS kyc_status CASCADE,
    DROP COLUMN IF EXISTS accreditation_status CASCADE;

/** 
 * Rollback SQL:
 * 
 * -- Restore tables and data:
 * -- 1. First recreate the tables (schema would need to be provided)
 * -- 2. Then restore data from legacy_data_backup
 * -- 3. Drop the backup table
 * 
 * -- Restore column names and constraints:
 * ALTER TABLE public.bank_info 
 *     DROP CONSTRAINT IF EXISTS bank_info_pkey CASCADE,
 *     RENAME COLUMN bank_id TO id,
 *     ADD PRIMARY KEY (id);
 * 
 * ALTER TABLE public.gp_roles 
 *     DROP CONSTRAINT IF EXISTS gp_roles_pkey CASCADE,
 *     RENAME COLUMN gp_id TO id,
 *     ADD PRIMARY KEY (id);
 * 
 * ALTER TABLE public.lp_roles RENAME TO roles;
 * ALTER TABLE public.roles 
 *     DROP CONSTRAINT IF EXISTS lp_roles_pkey CASCADE,
 *     RENAME COLUMN lp_id TO id,
 *     ADD PRIMARY KEY (id);
 * 
 * ALTER TABLE public.accounts 
 *     ADD COLUMN kyc_status text,
 *     ADD COLUMN accreditation_status text;
 * 
 * DROP TABLE IF EXISTS public.legacy_data_backup;
 */
