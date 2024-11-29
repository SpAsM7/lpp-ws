-- Add documentation comments to tables and policies to ensure compliance with coding rules

-- Document currency handling
COMMENT ON COLUMN investments.total_committed_capital IS 'Stored in dollars (not cents) as BIGINT per coding rules';
COMMENT ON COLUMN investments.total_called_capital IS 'Stored in dollars (not cents) as BIGINT per coding rules';
COMMENT ON COLUMN investments.total_distributions IS 'Stored in dollars (not cents) as BIGINT per coding rules';
COMMENT ON COLUMN investments.current_nav IS 'Stored in dollars (not cents) as BIGINT per coding rules';

-- Document JSONB usage and validation
COMMENT ON COLUMN user_profiles.communication_preferences IS 'Preferences only - no sensitive data. Validated via triggers';
COMMENT ON COLUMN individual_details.joint_holder_info IS 'Configuration only - no sensitive data. Validated via triggers';
COMMENT ON COLUMN investments.investment_metrics IS 'Metrics and configuration only - no sensitive data. Validated via triggers';
COMMENT ON COLUMN retirement_details.custodian_info IS 'Configuration only - no sensitive data. Validated via triggers';

-- Document GP/LP role separation
COMMENT ON TABLE user_profiles IS 'Implements dual-check system for GP access (is_gp_user flag + gp_roles table)';
COMMENT ON TABLE gp_roles IS 'Second factor of dual-check system for GP access. User must have both is_gp_user=true and a gp_role';
COMMENT ON COLUMN user_profiles.is_gp_user IS 'First factor of dual-check system for GP access';
COMMENT ON COLUMN user_profiles.is_lp_user IS 'LP access flag - mutually exclusive with GP access';

-- Document RLS policies
COMMENT ON POLICY "GP users can manage all accounts" ON accounts IS 'Requires both is_gp_user=true and valid gp_role';
COMMENT ON POLICY "GP users can manage all accreditation" ON accreditation IS 'Requires both is_gp_user=true and valid gp_role';
COMMENT ON POLICY "LP users can view active companies" ON companies IS 'LP-specific access, requires is_lp_user=true';
COMMENT ON POLICY "Account admins can manage their accounts" ON accounts IS 'LP admin access, requires admin role_type';

-- Document audit trail implementation
COMMENT ON COLUMN accounts.created_at IS 'Automatically set by trigger';
COMMENT ON COLUMN accounts.created_by IS 'Set to auth.uid() by trigger';
COMMENT ON COLUMN accounts.updated_at IS 'Automatically updated by trigger';
COMMENT ON COLUMN accounts.updated_by IS 'Set to auth.uid() by trigger';
COMMENT ON COLUMN accounts.deleted_at IS 'Null until soft deleted';
COMMENT ON COLUMN accounts.deleted_by IS 'Set to auth.uid() on soft delete';

-- Document GP action auditing
COMMENT ON VIEW monitoring.gp_actions IS 'Dedicated GP action audit trail per coding rules';
COMMENT ON VIEW monitoring.gp_role_audit IS 'Tracks GP role assignments and changes';
COMMENT ON VIEW monitoring.gp_access_diagnostic IS 'Monitors GP access patterns and role combinations';

-- Add rollback statements as required by coding rules
-- To roll back documentation:
-- COMMENT ON COLUMN investments.total_committed_capital IS NULL;
-- COMMENT ON COLUMN investments.total_called_capital IS NULL;
-- COMMENT ON COLUMN investments.total_distributions IS NULL;
-- COMMENT ON COLUMN investments.current_nav IS NULL;
-- etc...
