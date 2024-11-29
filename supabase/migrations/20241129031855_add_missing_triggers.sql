-- Add soft delete triggers to all tables
CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deleted_at = CURRENT_TIMESTAMP;
    NEW.deleted_by = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply soft delete triggers to all tables
CREATE TRIGGER soft_delete_accounts BEFORE UPDATE OF deleted_at ON accounts
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_accreditation BEFORE UPDATE OF deleted_at ON accreditation
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_activities BEFORE UPDATE OF deleted_at ON activities
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_aml_verification BEFORE UPDATE OF deleted_at ON aml_verification
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_bank_info BEFORE UPDATE OF deleted_at ON bank_info
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_beneficial_owners BEFORE UPDATE OF deleted_at ON beneficial_owners
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_companies BEFORE UPDATE OF deleted_at ON companies
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_contact_designations BEFORE UPDATE OF deleted_at ON contact_designations
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_entity_details BEFORE UPDATE OF deleted_at ON entity_details
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_erisa_status BEFORE UPDATE OF deleted_at ON erisa_status
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_files BEFORE UPDATE OF deleted_at ON files
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_gp_roles BEFORE UPDATE OF deleted_at ON gp_roles
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_individual_details BEFORE UPDATE OF deleted_at ON individual_details
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_investments BEFORE UPDATE OF deleted_at ON investments
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_retirement_details BEFORE UPDATE OF deleted_at ON retirement_details
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_roles BEFORE UPDATE OF deleted_at ON roles
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_trust_details BEFORE UPDATE OF deleted_at ON trust_details
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

CREATE TRIGGER soft_delete_user_profiles BEFORE UPDATE OF deleted_at ON user_profiles
    FOR EACH ROW WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();

-- Add audit trail triggers to all tables
CREATE OR REPLACE FUNCTION update_audit_fields()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.updated_by = auth.uid();
    
    IF TG_OP = 'INSERT' THEN
        NEW.created_at = CURRENT_TIMESTAMP;
        NEW.created_by = auth.uid();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply audit trail triggers to all tables
CREATE TRIGGER audit_accounts BEFORE INSERT OR UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_accreditation BEFORE INSERT OR UPDATE ON accreditation
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_activities BEFORE INSERT OR UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_aml_verification BEFORE INSERT OR UPDATE ON aml_verification
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_bank_info BEFORE INSERT OR UPDATE ON bank_info
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_beneficial_owners BEFORE INSERT OR UPDATE ON beneficial_owners
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_companies BEFORE INSERT OR UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_contact_designations BEFORE INSERT OR UPDATE ON contact_designations
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_entity_details BEFORE INSERT OR UPDATE ON entity_details
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_erisa_status BEFORE INSERT OR UPDATE ON erisa_status
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_files BEFORE INSERT OR UPDATE ON files
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_gp_roles BEFORE INSERT OR UPDATE ON gp_roles
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_individual_details BEFORE INSERT OR UPDATE ON individual_details
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_investments BEFORE INSERT OR UPDATE ON investments
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_retirement_details BEFORE INSERT OR UPDATE ON retirement_details
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_roles BEFORE INSERT OR UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_trust_details BEFORE INSERT OR UPDATE ON trust_details
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

CREATE TRIGGER audit_user_profiles BEFORE INSERT OR UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_audit_fields();

-- Add activity logging triggers to more tables
CREATE TRIGGER log_accreditation_activity AFTER INSERT OR UPDATE OR DELETE ON accreditation
    FOR EACH ROW EXECUTE FUNCTION log_activity('accreditation');

CREATE TRIGGER log_aml_verification_activity AFTER INSERT OR UPDATE OR DELETE ON aml_verification
    FOR EACH ROW EXECUTE FUNCTION log_activity('aml_verification');

CREATE TRIGGER log_bank_info_activity AFTER INSERT OR UPDATE OR DELETE ON bank_info
    FOR EACH ROW EXECUTE FUNCTION log_activity('bank_info');

CREATE TRIGGER log_beneficial_owners_activity AFTER INSERT OR UPDATE OR DELETE ON beneficial_owners
    FOR EACH ROW EXECUTE FUNCTION log_activity('beneficial_owner');

CREATE TRIGGER log_company_activity AFTER INSERT OR UPDATE OR DELETE ON companies
    FOR EACH ROW EXECUTE FUNCTION log_activity('company');

CREATE TRIGGER log_investment_activity AFTER INSERT OR UPDATE OR DELETE ON investments
    FOR EACH ROW EXECUTE FUNCTION log_activity('investment');

CREATE TRIGGER log_file_activity AFTER INSERT OR UPDATE OR DELETE ON files
    FOR EACH ROW EXECUTE FUNCTION log_activity('file');

-- Add missing RLS policies for modification access
CREATE POLICY "GP users can manage all accounts" ON accounts
AS PERMISSIVE FOR ALL
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM user_profiles 
        WHERE is_gp_user = true 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Account admins can manage their accounts" ON accounts
AS PERMISSIVE FOR UPDATE
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = accounts.account_id 
        AND role_type = 'admin'
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Account admins can manage their details" ON individual_details
AS PERMISSIVE FOR UPDATE
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = individual_details.account_id 
        AND role_type = 'admin'
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Account admins can manage their details" ON entity_details
AS PERMISSIVE FOR UPDATE
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = entity_details.account_id 
        AND role_type = 'admin'
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Account admins can manage their details" ON trust_details
AS PERMISSIVE FOR UPDATE
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = trust_details.account_id 
        AND role_type = 'admin'
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Account admins can manage their details" ON retirement_details
AS PERMISSIVE FOR UPDATE
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = retirement_details.account_id 
        AND role_type = 'admin'
        AND deleted_at IS NULL
    )
);

-- Add RLS policies for file modification
CREATE POLICY "LP users can modify their own files" ON files
AS PERMISSIVE FOR UPDATE
TO public
USING (
    modification_access = 'lp_full'
    AND auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = files.account_id
        AND role_type IN ('signer', 'admin')
        AND deleted_at IS NULL
    )
);
