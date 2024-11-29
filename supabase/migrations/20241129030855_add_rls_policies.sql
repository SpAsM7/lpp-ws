-- Enable RLS on all tables
ALTER TABLE "public"."accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."accreditation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."activities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."aml_verification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."bank_info" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."beneficial_owners" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."companies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."contact_designations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."entity_details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."erisa_status" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."file_access_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."files" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."gp_roles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."individual_details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."investments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."retirement_details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."trust_details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "GP users can view all accounts" ON "public"."accounts";
DROP POLICY IF EXISTS "Users can view accounts they have roles in" ON "public"."accounts";
DROP POLICY IF EXISTS "Account team members can view accreditation" ON "public"."accreditation";
DROP POLICY IF EXISTS "GP users can manage all accreditation" ON "public"."accreditation";
DROP POLICY IF EXISTS "GP users can view all activities" ON "public"."activities";
DROP POLICY IF EXISTS "Users can view activities for their accounts" ON "public"."activities";
DROP POLICY IF EXISTS "Account team members can view AML verification" ON "public"."aml_verification";
DROP POLICY IF EXISTS "GP users can manage all AML verification" ON "public"."aml_verification";
DROP POLICY IF EXISTS "Account signers and admins can manage bank info" ON "public"."bank_info";
DROP POLICY IF EXISTS "Account team members can view bank info" ON "public"."bank_info";
DROP POLICY IF EXISTS "GP users can view all bank info" ON "public"."bank_info";
DROP POLICY IF EXISTS "GP users can manage all beneficial owners" ON "public"."beneficial_owners";
DROP POLICY IF EXISTS "Users can view beneficial owners for their accounts" ON "public"."beneficial_owners";
DROP POLICY IF EXISTS "GP users can manage companies" ON "public"."companies";
DROP POLICY IF EXISTS "LP users can view active companies" ON "public"."companies";
DROP POLICY IF EXISTS "GP users can manage all contact designations" ON "public"."contact_designations";
DROP POLICY IF EXISTS "Users can view contact designations for their accounts" ON "public"."contact_designations";
DROP POLICY IF EXISTS "GP users can view all entity details" ON "public"."entity_details";
DROP POLICY IF EXISTS "Users can view details for their accounts" ON "public"."entity_details";
DROP POLICY IF EXISTS "GP users can manage all ERISA status" ON "public"."erisa_status";
DROP POLICY IF EXISTS "Users can view ERISA status for their accounts" ON "public"."erisa_status";
DROP POLICY IF EXISTS "GP users can view all access logs" ON "public"."file_access_logs";
DROP POLICY IF EXISTS "Users can view their own access logs" ON "public"."file_access_logs";
DROP POLICY IF EXISTS "Account-specific document access" ON "public"."files";
DROP POLICY IF EXISTS "Company-wide document access" ON "public"."files";
DROP POLICY IF EXISTS "GP users can manage all files" ON "public"."files";
DROP POLICY IF EXISTS "Investment-specific document access" ON "public"."files";
DROP POLICY IF EXISTS "GP admins can manage GP roles" ON "public"."gp_roles";
DROP POLICY IF EXISTS "Users can view their own GP role" ON "public"."gp_roles";
DROP POLICY IF EXISTS "GP users can view all individual details" ON "public"."individual_details";
DROP POLICY IF EXISTS "Users can view details for their accounts" ON "public"."individual_details";
DROP POLICY IF EXISTS "GP users can manage all investments" ON "public"."investments";
DROP POLICY IF EXISTS "Users can view investments for their accounts" ON "public"."investments";
DROP POLICY IF EXISTS "GP users can view all retirement details" ON "public"."retirement_details";
DROP POLICY IF EXISTS "Users can view details for their accounts" ON "public"."retirement_details";
DROP POLICY IF EXISTS "Users can view roles for their accounts" ON "public"."roles";
DROP POLICY IF EXISTS "GP users can view all trust details" ON "public"."trust_details";
DROP POLICY IF EXISTS "Users can view details for their accounts" ON "public"."trust_details";
DROP POLICY IF EXISTS "GP admins can view all profiles" ON "public"."user_profiles";
DROP POLICY IF EXISTS "Users can update their own profile" ON "public"."user_profiles";
DROP POLICY IF EXISTS "Users can view their own profile" ON "public"."user_profiles";

-- Create Account Policies
CREATE POLICY "GP users can view all accounts" ON "public"."accounts"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM user_profiles 
        WHERE is_gp_user = true 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Users can view accounts they have roles in" ON "public"."accounts"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = accounts.account_id 
        AND deleted_at IS NULL
    )
);

-- Create Accreditation Policies
CREATE POLICY "Account team members can view accreditation" ON "public"."accreditation"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = accreditation.account_id 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "GP users can manage all accreditation" ON "public"."accreditation"
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

-- Create Activity Policies
CREATE POLICY "GP users can view all activities" ON "public"."activities"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM user_profiles 
        WHERE is_gp_user = true 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Users can view activities for their accounts" ON "public"."activities"
AS PERMISSIVE FOR SELECT
TO public
USING (
    CASE 
        WHEN entity_type = 'account' THEN
            auth.uid() IN (
                SELECT user_id 
                FROM roles 
                WHERE account_id = activities.entity_id::uuid 
                AND deleted_at IS NULL
            )
        WHEN entity_type = 'investment' THEN
            auth.uid() IN (
                SELECT r.user_id 
                FROM roles r
                JOIN investments i ON r.account_id = i.account_id
                WHERE i.investment_id = activities.entity_id::uuid
                AND r.deleted_at IS NULL
            )
        WHEN entity_type = 'company' THEN
            auth.uid() IN (
                SELECT r.user_id 
                FROM roles r
                JOIN investments i ON r.account_id = i.account_id
                WHERE i.company_id = activities.entity_id::uuid
                AND r.deleted_at IS NULL
            )
        WHEN entity_type = 'file' THEN
            auth.uid() IN (
                SELECT r.user_id 
                FROM roles r
                JOIN files f ON r.account_id = f.account_id
                WHERE f.file_id = activities.entity_id::uuid
                AND r.deleted_at IS NULL
            )
        ELSE false
    END
);

-- Create AML Verification Policies
CREATE POLICY "Account team members can view AML verification" ON "public"."aml_verification"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = aml_verification.account_id 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "GP users can manage all AML verification" ON "public"."aml_verification"
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

-- Create Bank Info Policies
CREATE POLICY "Account signers and admins can manage bank info" ON "public"."bank_info"
AS PERMISSIVE FOR ALL
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = bank_info.account_id 
        AND role_type IN ('signer', 'admin')
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Account team members can view bank info" ON "public"."bank_info"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = bank_info.account_id 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "GP users can view all bank info" ON "public"."bank_info"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM user_profiles 
        WHERE is_gp_user = true 
        AND deleted_at IS NULL
    )
);

-- Create Beneficial Owner Policies
CREATE POLICY "GP users can manage all beneficial owners" ON "public"."beneficial_owners"
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

CREATE POLICY "Users can view beneficial owners for their accounts" ON "public"."beneficial_owners"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT r.user_id 
        FROM roles r
        JOIN entity_details e ON e.account_id = r.account_id
        WHERE e.id = beneficial_owners.parent_id 
        AND r.deleted_at IS NULL
        UNION
        SELECT r.user_id 
        FROM roles r
        JOIN trust_details t ON t.account_id = r.account_id
        WHERE t.id = beneficial_owners.parent_id 
        AND r.deleted_at IS NULL
        UNION
        SELECT r.user_id 
        FROM roles r
        JOIN retirement_details rd ON rd.account_id = r.account_id
        WHERE rd.id = beneficial_owners.parent_id 
        AND r.deleted_at IS NULL
    )
);

-- Create Company Policies
CREATE POLICY "GP users can manage companies" ON "public"."companies"
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

CREATE POLICY "LP users can view active companies" ON "public"."companies"
AS PERMISSIVE FOR SELECT
TO public
USING (
    status = 'active' 
    AND deleted_at IS NULL 
    AND auth.uid() IN (
        SELECT user_id 
        FROM user_profiles 
        WHERE is_lp_user = true 
        AND deleted_at IS NULL
    )
);

-- Create Contact Designation Policies
CREATE POLICY "GP users can manage all contact designations" ON "public"."contact_designations"
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

CREATE POLICY "Users can view contact designations for their accounts" ON "public"."contact_designations"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT r2.user_id 
        FROM roles r2
        WHERE r2.account_id = (
            SELECT r1.account_id 
            FROM roles r1
            WHERE r1.id = contact_designations.role_id
        )
        AND r2.deleted_at IS NULL
    )
);

-- Create Entity Details Policies
CREATE POLICY "GP users can view all entity details" ON "public"."entity_details"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM user_profiles 
        WHERE is_gp_user = true 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Users can view details for their accounts" ON "public"."entity_details"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = entity_details.account_id 
        AND deleted_at IS NULL
    )
);

-- Create ERISA Status Policies
CREATE POLICY "GP users can manage all ERISA status" ON "public"."erisa_status"
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

CREATE POLICY "Users can view ERISA status for their accounts" ON "public"."erisa_status"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT r.user_id 
        FROM roles r
        JOIN entity_details e ON e.account_id = r.account_id
        WHERE e.id = erisa_status.parent_id 
        AND r.deleted_at IS NULL
        UNION
        SELECT r.user_id 
        FROM roles r
        JOIN retirement_details rd ON rd.account_id = r.account_id
        WHERE rd.id = erisa_status.parent_id 
        AND r.deleted_at IS NULL
    )
);

-- Create File Access Log Policies
CREATE POLICY "GP users can view all access logs" ON "public"."file_access_logs"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM user_profiles 
        WHERE is_gp_user = true 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Users can view their own access logs" ON "public"."file_access_logs"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id);

-- Create File Policies
CREATE POLICY "Account-specific document access" ON "public"."files"
AS PERMISSIVE FOR SELECT
TO public
USING (
    visibility_scope = 'account_specific' 
    AND auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = files.account_id 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Company-wide document access" ON "public"."files"
AS PERMISSIVE FOR SELECT
TO public
USING (
    visibility_scope = 'company_wide' 
    AND auth.uid() IN (
        SELECT r.user_id 
        FROM roles r
        JOIN investments i ON r.account_id = i.account_id
        WHERE i.company_id = files.company_id 
        AND r.deleted_at IS NULL
    )
);

CREATE POLICY "GP users can manage all files" ON "public"."files"
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

CREATE POLICY "Investment-specific document access" ON "public"."files"
AS PERMISSIVE FOR SELECT
TO public
USING (
    visibility_scope = 'investment_specific' 
    AND auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id IN (
            SELECT account_id 
            FROM investments 
            WHERE investment_id = files.investment_id
        )
        AND deleted_at IS NULL
    )
);

-- Create GP Role Policies
CREATE POLICY "GP admins can manage GP roles" ON "public"."gp_roles"
AS PERMISSIVE FOR ALL
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM gp_roles 
        WHERE role_type = 'admin' 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Users can view their own GP role" ON "public"."gp_roles"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id);

-- Create Individual Details Policies
CREATE POLICY "GP users can view all individual details" ON "public"."individual_details"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM user_profiles 
        WHERE is_gp_user = true 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Users can view details for their accounts" ON "public"."individual_details"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = individual_details.account_id 
        AND deleted_at IS NULL
    )
);

-- Create Investment Policies
CREATE POLICY "GP users can manage all investments" ON "public"."investments"
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

CREATE POLICY "Users can view investments for their accounts" ON "public"."investments"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = investments.account_id 
        AND deleted_at IS NULL
    )
);

-- Create Retirement Details Policies
CREATE POLICY "GP users can view all retirement details" ON "public"."retirement_details"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM user_profiles 
        WHERE is_gp_user = true 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Users can view details for their accounts" ON "public"."retirement_details"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = retirement_details.account_id 
        AND deleted_at IS NULL
    )
);

-- Create Role Policies
CREATE POLICY "Users can view roles for their accounts" ON "public"."roles"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles roles_1
        WHERE roles_1.account_id = roles_1.account_id 
        AND roles_1.deleted_at IS NULL
    )
);

-- Create Trust Details Policies
CREATE POLICY "GP users can view all trust details" ON "public"."trust_details"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM user_profiles 
        WHERE is_gp_user = true 
        AND deleted_at IS NULL
    )
);

CREATE POLICY "Users can view details for their accounts" ON "public"."trust_details"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM roles 
        WHERE account_id = trust_details.account_id 
        AND deleted_at IS NULL
    )
);

-- Create User Profile Policies
CREATE POLICY "GP admins can view all profiles" ON "public"."user_profiles"
AS PERMISSIVE FOR SELECT
TO public
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM user_profiles user_profiles_1
        WHERE user_profiles_1.is_gp_user = true 
        AND user_profiles_1.deleted_at IS NULL
    )
);

CREATE POLICY "Users can update their own profile" ON "public"."user_profiles"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" ON "public"."user_profiles"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id);
