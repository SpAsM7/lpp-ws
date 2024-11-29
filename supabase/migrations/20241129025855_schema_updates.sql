-- Add missing extensions
CREATE EXTENSION IF NOT EXISTS "plv8" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

-- Add missing types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE "public"."http_header" AS ("field" character varying, "value" character varying);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."http_request" AS ("method" http_method, "uri" character varying, "headers" http_header[], "content_type" character varying, "content" character varying);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."http_response" AS ("status" integer, "content_type" character varying, "headers" http_header[], "content" character varying);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add missing validation functions
CREATE OR REPLACE FUNCTION validate_tax_id()
RETURNS TRIGGER AS $$
BEGIN
    CASE NEW.tax_id_type
        WHEN 'ssn' THEN
            IF NEW.tax_id !~ '^[0-9]{3}-[0-9]{2}-[0-9]{4}$' THEN
                RAISE EXCEPTION 'Invalid SSN format';
            END IF;
        WHEN 'itin' THEN
            IF NEW.tax_id !~ '^9[0-9]{2}-[0-9]{2}-[0-9]{4}$' THEN
                RAISE EXCEPTION 'Invalid ITIN format';
            END IF;
        WHEN 'ein' THEN
            IF NEW.tax_id !~ '^[0-9]{2}-[0-9]{7}$' THEN
                RAISE EXCEPTION 'Invalid EIN format';
            END IF;
    END CASE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for tax ID validation
DROP TRIGGER IF EXISTS validate_individual_tax_id ON individual_details;
CREATE TRIGGER validate_individual_tax_id
    BEFORE INSERT OR UPDATE ON individual_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_tax_id();

DROP TRIGGER IF EXISTS validate_entity_tax_id ON entity_details;
CREATE TRIGGER validate_entity_tax_id
    BEFORE INSERT OR UPDATE ON entity_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_tax_id();

DROP TRIGGER IF EXISTS validate_trust_tax_id ON trust_details;
CREATE TRIGGER validate_trust_tax_id
    BEFORE INSERT OR UPDATE ON trust_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_tax_id();

DROP TRIGGER IF EXISTS validate_retirement_tax_id ON retirement_details;
CREATE TRIGGER validate_retirement_tax_id
    BEFORE INSERT OR UPDATE ON retirement_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_tax_id();

-- Add missing ownership validation
CREATE OR REPLACE FUNCTION validate_ownership_percentage()
RETURNS TRIGGER AS $$
BEGIN
    -- Check that total ownership doesn't exceed 100%
    IF (
        SELECT SUM(ownership_percent)
        FROM beneficial_owners
        WHERE parent_id = NEW.parent_id
        AND parent_type = NEW.parent_type
        AND deleted_at IS NULL
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) + COALESCE(NEW.ownership_percent, 0) > 100 THEN
        RAISE EXCEPTION 'Total ownership percentage cannot exceed 100%%';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_ownership_percentage ON beneficial_owners;
CREATE TRIGGER check_ownership_percentage
    BEFORE INSERT OR UPDATE ON beneficial_owners
    FOR EACH ROW
    EXECUTE FUNCTION validate_ownership_percentage();

-- Add missing bank information validation
CREATE OR REPLACE FUNCTION validate_bank_info()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate routing number format (US)
    IF NEW.routing_number !~ '^[0-9]{9}$' THEN
        RAISE EXCEPTION 'Invalid routing number format';
    END IF;

    -- Validate SWIFT code format (international)
    IF NEW.swift_code IS NOT NULL AND NEW.swift_code !~ '^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$' THEN
        RAISE EXCEPTION 'Invalid SWIFT code format';
    END IF;

    -- Ensure only one primary account per account_id
    IF NEW.primary_account AND EXISTS (
        SELECT 1 
        FROM bank_info 
        WHERE account_id = NEW.account_id 
        AND primary_account = true 
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        AND deleted_at IS NULL
    ) THEN
        RAISE EXCEPTION 'Only one primary bank account allowed per account';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_bank_info_trigger ON bank_info;
CREATE TRIGGER validate_bank_info_trigger
    BEFORE INSERT OR UPDATE ON bank_info
    FOR EACH ROW
    EXECUTE FUNCTION validate_bank_info();

-- Add missing date validation
CREATE OR REPLACE FUNCTION validate_dates()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure dates are not in the future
    IF NEW.formation_date > CURRENT_DATE THEN
        RAISE EXCEPTION 'Formation date cannot be in the future';
    END IF;

    -- Ensure logical date order
    IF NEW.updated_at < NEW.created_at THEN
        RAISE EXCEPTION 'Updated timestamp cannot be before created timestamp';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply date validation to relevant tables
DROP TRIGGER IF EXISTS validate_entity_dates ON entity_details;
CREATE TRIGGER validate_entity_dates
    BEFORE INSERT OR UPDATE ON entity_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_dates();

DROP TRIGGER IF EXISTS validate_trust_dates ON trust_details;
CREATE TRIGGER validate_trust_dates
    BEFORE INSERT OR UPDATE ON trust_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_dates();

-- Add missing GP role validation
CREATE OR REPLACE FUNCTION validate_gp_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure user has GP status
    IF NOT EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = NEW.user_id 
        AND is_gp_user = true
    ) THEN
        RAISE EXCEPTION 'User must be marked as GP user before assigning GP role';
    END IF;

    -- Ensure user doesn't already have a different GP role
    IF EXISTS (
        SELECT 1 FROM gp_roles 
        WHERE user_id = NEW.user_id 
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        AND deleted_at IS NULL
    ) THEN
        RAISE EXCEPTION 'User can only have one GP role';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_gp_role_trigger ON gp_roles;
CREATE TRIGGER validate_gp_role_trigger
    BEFORE INSERT OR UPDATE ON gp_roles
    FOR EACH ROW
    EXECUTE FUNCTION validate_gp_role();

-- Add missing activity logging
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activities (
        activity_type,
        title,
        description,
        entity_type,
        entity_id,
        metadata,
        importance,
        user_id,
        created_by
    ) VALUES (
        TG_ARGV[0],
        CASE TG_OP
            WHEN 'INSERT' THEN 'New ' || TG_ARGV[0] || ' Created'
            WHEN 'UPDATE' THEN TG_ARGV[0] || ' Updated'
            WHEN 'DELETE' THEN TG_ARGV[0] || ' Deleted'
        END,
        CASE TG_OP
            WHEN 'INSERT' THEN 'Created new ' || TG_ARGV[0]
            WHEN 'UPDATE' THEN 'Updated existing ' || TG_ARGV[0]
            WHEN 'DELETE' THEN 'Deleted ' || TG_ARGV[0]
        END,
        TG_ARGV[0],
        NEW.id,
        jsonb_build_object(
            'operation', TG_OP,
            'table', TG_TABLE_NAME,
            'timestamp', CURRENT_TIMESTAMP
        ),
        'medium',
        current_user,
        current_user
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply activity logging to relevant tables
DROP TRIGGER IF EXISTS log_account_activity ON accounts;
CREATE TRIGGER log_account_activity
    AFTER INSERT OR UPDATE OR DELETE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION log_activity('account');

-- Add missing JSON validation
CREATE OR REPLACE FUNCTION validate_json_schema()
RETURNS TRIGGER AS $$
BEGIN
    -- Check required fields for mailing_address
    IF NOT (
        NEW.mailing_address ? 'street' AND
        NEW.mailing_address ? 'city' AND
        NEW.mailing_address ? 'country'
    ) THEN
        RAISE EXCEPTION 'Invalid address format - missing required fields';
    END IF;
    
    -- Validate field types
    IF NOT (
        jsonb_typeof(NEW.mailing_address->'street') = 'string' AND
        jsonb_typeof(NEW.mailing_address->'city') = 'string' AND
        jsonb_typeof(NEW.mailing_address->'country') = 'string'
    ) THEN
        RAISE EXCEPTION 'Invalid address format - invalid field types';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply JSON validation to relevant tables
DROP TRIGGER IF EXISTS validate_individual_address ON individual_details;
CREATE TRIGGER validate_individual_address
    BEFORE INSERT OR UPDATE ON individual_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_json_schema();

DROP TRIGGER IF EXISTS validate_entity_address ON entity_details;
CREATE TRIGGER validate_entity_address
    BEFORE INSERT OR UPDATE ON entity_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_json_schema();

DROP TRIGGER IF EXISTS validate_trust_address ON trust_details;
CREATE TRIGGER validate_trust_address
    BEFORE INSERT OR UPDATE ON trust_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_json_schema();

DROP TRIGGER IF EXISTS validate_retirement_address ON retirement_details;
CREATE TRIGGER validate_retirement_address
    BEFORE INSERT OR UPDATE ON retirement_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_json_schema();

-- Create monitoring schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS monitoring;

-- Add GP role monitoring
CREATE OR REPLACE VIEW monitoring.gp_role_audit AS
SELECT
    u.email,
    up.first_name,
    up.last_name,
    up.is_gp_user,
    gr.role_type as gp_role,
    gr.created_at as role_assigned,
    gr.created_by as assigned_by
FROM user_profiles up
JOIN auth.users u ON up.user_id = u.id
LEFT JOIN gp_roles gr ON up.user_id = gr.user_id
WHERE up.is_gp_user = true
AND gr.deleted_at IS NULL;

-- Add GP action monitoring
CREATE OR REPLACE VIEW monitoring.gp_actions AS
SELECT
    a.activity_type,
    a.title,
    a.description,
    u.email as performed_by,
    gr.role_type as gp_role,
    a.created_at
FROM activities a
JOIN user_profiles up ON a.user_id = up.user_id
JOIN auth.users u ON up.user_id = u.id
JOIN gp_roles gr ON up.user_id = gr.user_id
WHERE up.is_gp_user = true
AND gr.deleted_at IS NULL
ORDER BY a.created_at DESC;

-- Add table size monitoring
CREATE OR REPLACE VIEW monitoring.table_sizes AS
SELECT
    n.nspname as schema_name,
    c.relname as table_name,
    pg_size_pretty(pg_total_relation_size(c.oid)) as total_size,
    pg_size_pretty(pg_relation_size(c.oid)) as table_size,
    pg_size_pretty(pg_total_relation_size(c.oid) - pg_relation_size(c.oid)) as index_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'r'
AND n.nspname = 'public'
ORDER BY pg_total_relation_size(c.oid) DESC;

-- Add index usage monitoring
CREATE OR REPLACE VIEW monitoring.index_usage AS
SELECT
    n.nspname as schema_name,
    c.relname as table_name,
    i.relname as index_name,
    s.idx_scan as number_of_scans,
    s.idx_tup_read as tuples_read,
    s.idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes s
JOIN pg_class c ON c.oid = s.relid
JOIN pg_class i ON i.oid = s.indexrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public';

-- Add query performance monitoring
CREATE OR REPLACE VIEW monitoring.slow_queries AS
SELECT
    query,
    calls,
    total_exec_time as total_time,
    mean_exec_time as mean_time,
    rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC;

-- Add connection monitoring
CREATE OR REPLACE VIEW monitoring.connection_stats AS
SELECT
    datname as database_name,
    numbackends as number_of_connections,
    xact_commit as transactions_committed,
    xact_rollback as transactions_rolled_back,
    blks_read as blocks_read,
    blks_hit as blocks_hit,
    tup_returned as rows_returned,
    tup_fetched as rows_fetched,
    tup_inserted as rows_inserted,
    tup_updated as rows_updated,
    tup_deleted as rows_deleted
FROM pg_stat_database;

-- Add lock monitoring
CREATE OR REPLACE VIEW monitoring.locks AS
SELECT
    l.locktype as lock_type,
    c.relname as locked_relation,
    l.mode as lock_mode,
    l.granted,
    l.pid as process_id
FROM pg_locks l
LEFT JOIN pg_class c ON l.relation = c.oid
WHERE NOT l.granted;

-- Add transaction monitoring
CREATE OR REPLACE VIEW monitoring.transaction_stats AS
SELECT
    pid as process_id,
    usename as username,
    application_name,
    client_addr as client_address,
    backend_start,
    xact_start as transaction_start,
    query_start,
    state
FROM pg_stat_activity
WHERE state != 'idle';

-- Add GP access diagnostic view
CREATE OR REPLACE VIEW monitoring.gp_access_diagnostic AS
SELECT
    u.email,
    up.first_name,
    up.last_name,
    up.is_gp_user,
    up.is_lp_user,
    gr.role_type as gp_role,
    COUNT(DISTINCT r.account_id) as lp_account_count,
    STRING_AGG(DISTINCT r.role_type, ', ') as lp_roles
FROM user_profiles up
JOIN auth.users u ON up.user_id = u.id
LEFT JOIN gp_roles gr ON up.user_id = gr.user_id
LEFT JOIN roles r ON up.user_id = r.user_id
WHERE (up.is_gp_user = true OR up.is_lp_user = true)
AND up.deleted_at IS NULL
GROUP BY u.email, up.first_name, up.last_name, up.is_gp_user, up.is_lp_user, gr.role_type;

-- Add maintenance schema and functions
CREATE SCHEMA IF NOT EXISTS maintenance;

-- Add vacuum function
CREATE OR REPLACE FUNCTION maintenance.vacuum_tables()
RETURNS void AS $$
DECLARE
    table_name text;
BEGIN
    FOR table_name IN 
        SELECT relname 
        FROM pg_class 
        WHERE relkind = 'r' 
        AND relnamespace = 'public'::regnamespace
    LOOP
        EXECUTE 'VACUUM ANALYZE ' || quote_ident(table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Add reindex function
CREATE OR REPLACE FUNCTION maintenance.reindex_tables()
RETURNS void AS $$
DECLARE
    index_name text;
BEGIN
    FOR index_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'REINDEX INDEX ' || quote_ident(index_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Set database configuration
ALTER DATABASE postgres SET timezone TO 'UTC';
ALTER DATABASE postgres SET statement_timeout TO '60s';
ALTER DATABASE postgres SET lock_timeout TO '10s';
ALTER DATABASE postgres SET idle_in_transaction_session_timeout TO '60s';
ALTER DATABASE postgres SET default_text_search_config TO 'pg_catalog.english';

-- Note: System-level configurations should be set by database administrator
-- outside of migrations
