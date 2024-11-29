-- Add missing investment amount validation
CREATE OR REPLACE FUNCTION validate_investment_amounts()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure all monetary amounts are non-negative
    IF NEW.total_committed_capital < 0 OR
       NEW.total_called_capital < 0 OR
       NEW.total_distributions < 0 OR
       NEW.current_nav < 0 THEN
        RAISE EXCEPTION 'Investment amounts cannot be negative';
    END IF;

    -- Ensure called capital doesn't exceed committed capital
    IF NEW.total_called_capital > NEW.total_committed_capital THEN
        RAISE EXCEPTION 'Called capital cannot exceed committed capital';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_investment_amounts
    BEFORE INSERT OR UPDATE ON investments
    FOR EACH ROW
    EXECUTE FUNCTION validate_investment_amounts();

-- Add accreditation expiry validation
CREATE OR REPLACE FUNCTION validate_accreditation_dates()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure expiry date is in the future
    IF NEW.expires_at IS NOT NULL AND NEW.expires_at <= CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Accreditation expiry date must be in the future';
    END IF;

    -- Ensure verification date is not in the future
    IF NEW.verified_at > CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Verification date cannot be in the future';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_accreditation_dates
    BEFORE INSERT OR UPDATE ON accreditation
    FOR EACH ROW
    EXECUTE FUNCTION validate_accreditation_dates();

-- Add missing activity logging triggers
CREATE TRIGGER log_accreditation_status_activity 
    AFTER UPDATE OF accreditation_status ON accounts
    FOR EACH ROW
    WHEN (OLD.accreditation_status IS DISTINCT FROM NEW.accreditation_status)
    EXECUTE FUNCTION log_activity('accreditation_status');

CREATE TRIGGER log_kyc_status_activity 
    AFTER UPDATE OF kyc_status ON accounts
    FOR EACH ROW
    WHEN (OLD.kyc_status IS DISTINCT FROM NEW.kyc_status)
    EXECUTE FUNCTION log_activity('kyc_status');

-- Add missing indexes for common queries
CREATE INDEX idx_accreditation_status ON accounts(accreditation_status)
    WHERE deleted_at IS NULL;

CREATE INDEX idx_kyc_status ON accounts(kyc_status)
    WHERE deleted_at IS NULL;

CREATE INDEX idx_investments_dates ON investments(initial_investment_date, last_valuation_date)
    WHERE deleted_at IS NULL;

CREATE INDEX idx_files_created ON files(created_at)
    WHERE deleted_at IS NULL;

-- Add composite indexes for common joins
CREATE INDEX idx_roles_account_user ON roles(account_id, user_id)
    WHERE deleted_at IS NULL;

CREATE INDEX idx_investments_account_company ON investments(account_id, company_id)
    WHERE deleted_at IS NULL;

-- Add monitoring view for accreditation status
CREATE OR REPLACE VIEW monitoring.accreditation_status AS
SELECT 
    a.account_id,
    a.account_name,
    a.account_type,
    a.accreditation_status,
    acc.qualification_type,
    acc.verified_at,
    acc.expires_at,
    CASE 
        WHEN acc.expires_at IS NULL THEN 'never'
        WHEN acc.expires_at <= CURRENT_TIMESTAMP + INTERVAL '30 days' THEN 'expiring_soon'
        ELSE 'valid'
    END as status
FROM accounts a
LEFT JOIN accreditation acc ON a.account_id = acc.account_id
WHERE a.deleted_at IS NULL
AND acc.deleted_at IS NULL;

-- Add monitoring view for KYC status
CREATE OR REPLACE VIEW monitoring.kyc_status AS
SELECT 
    a.account_id,
    a.account_name,
    a.account_type,
    a.kyc_status,
    aml.verification_type,
    aml.verified_at,
    aml.pep_status,
    aml.sanctions_check
FROM accounts a
LEFT JOIN aml_verification aml ON a.account_id = aml.account_id
WHERE a.deleted_at IS NULL
AND aml.deleted_at IS NULL;

-- Add function to check for expired accreditations
CREATE OR REPLACE FUNCTION maintenance.check_expired_accreditations()
RETURNS TABLE (
    account_id uuid,
    account_name text,
    expires_at timestamptz,
    days_until_expiry integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.account_id,
        a.account_name,
        acc.expires_at,
        EXTRACT(DAY FROM acc.expires_at - CURRENT_TIMESTAMP)::integer as days_until_expiry
    FROM accounts a
    JOIN accreditation acc ON a.account_id = acc.account_id
    WHERE a.deleted_at IS NULL
    AND acc.deleted_at IS NULL
    AND acc.expires_at IS NOT NULL
    AND acc.expires_at <= CURRENT_TIMESTAMP + INTERVAL '90 days'
    ORDER BY acc.expires_at;
END;
$$ LANGUAGE plpgsql;

-- Add function to check for stale KYC verifications
CREATE OR REPLACE FUNCTION maintenance.check_stale_kyc()
RETURNS TABLE (
    account_id uuid,
    account_name text,
    kyc_status text,
    verified_at timestamptz,
    days_since_verification integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.account_id,
        a.account_name,
        a.kyc_status,
        aml.verified_at,
        EXTRACT(DAY FROM CURRENT_TIMESTAMP - aml.verified_at)::integer as days_since_verification
    FROM accounts a
    JOIN aml_verification aml ON a.account_id = aml.account_id
    WHERE a.deleted_at IS NULL
    AND aml.deleted_at IS NULL
    AND aml.verified_at <= CURRENT_TIMESTAMP - INTERVAL '365 days'
    ORDER BY aml.verified_at;
END;
$$ LANGUAGE plpgsql;

-- Add policy for LP admins to manage their own KYC/accreditation documents
CREATE POLICY "LP admins can manage KYC documents" ON files
AS PERMISSIVE FOR ALL
TO public
USING (
    file_type IN ('kyc_document', 'accreditation_document')
    AND auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = files.account_id
        AND role_type = 'admin'
        AND deleted_at IS NULL
    )
);
