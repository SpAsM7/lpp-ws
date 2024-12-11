# **Database Policies**

## **1. Account Access Policies**

### **1.1 Base Account Access**
```sql
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- View policy for account team members
CREATE POLICY account_view_policy ON accounts
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = accounts.id 
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
            WHERE account_id = accounts.id 
            AND role_type IN ('signer', 'admin')
            AND deleted_at IS NULL
        )
    );
```

### **1.2 Account Details Access**
```sql
-- No separate policies needed for account details since they are now JSONB fields in the accounts table
-- Access is controlled through the base account policies above
```

### **1.3 Role Access**
```sql
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Only GP admins and account signers/admins can manage roles
CREATE POLICY roles_manage_policy ON roles
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = roles.account_id 
            AND role_type IN ('signer', 'admin')
            AND deleted_at IS NULL
        )
        OR 
        EXISTS (
            SELECT 1 
            FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND is_gp_user = true
        )
    );
```

## **2. Document Access Policies**

### **2.1 Base Document Access**
```sql
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY files_view_policy ON files
    FOR SELECT
    USING (
        (
            -- Account-specific documents
            (account_id IS NOT NULL AND
            auth.uid() IN (
                SELECT user_id 
                FROM roles 
                WHERE account_id = files.account_id 
                AND deleted_at IS NULL
            ))
            OR
            -- Investment-specific documents
            (investment_id IS NOT NULL AND
            auth.uid() IN (
                SELECT user_id 
                FROM roles 
                WHERE account_id IN (
                    SELECT account_id 
                    FROM investments 
                    WHERE investment_id = files.investment_id
                )
                AND deleted_at IS NULL
            ))
            OR
            -- Company-wide documents
            (company_id IS NOT NULL AND visibility_scope = 'company_wide')
        )
    );
```

### **2.2 Document Modification Rights**
```sql
-- GP admin override
CREATE POLICY gp_admin_modify_policy ON files
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE is_gp_admin = true));

-- LP full access for account documents
CREATE POLICY lp_full_modify_policy ON files
    FOR UPDATE
    USING (
        modification_access = 'lp_full'
        AND auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = files.account_id
            AND role_type IN ('signer', 'admin', 'editor')
            AND deleted_at IS NULL
        )
    );
```

## **3. Role Management Policies**

### **3.1 Role Access**
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

## **4. Investment Access Policies**

### **4.1 Investment Data Access**
```sql
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- View policy for account team members
CREATE POLICY investment_view_policy ON investments
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = investments.account_id 
            AND deleted_at IS NULL
        )
    );

-- Modification policy for GP admins only
CREATE POLICY investment_modify_policy ON investments
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE is_gp_admin = true));
```

## **5. Beneficial Owner Access Policies**

### **5.1 Beneficial Owner Data Access**
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

## **6. Activity Log Policies**

### **6.1 Activity Access**
```sql
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- View policy based on entity access
CREATE POLICY activity_view_policy ON activities
    FOR SELECT
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
                    SELECT user_id 
                    FROM roles r
                    JOIN investments i ON r.account_id = i.account_id
                    WHERE i.investment_id = activities.entity_id::uuid
                    AND r.deleted_at IS NULL
                )
            WHEN entity_type = 'company' THEN
                auth.uid() IN (
                    SELECT user_id 
                    FROM roles r
                    JOIN investments i ON r.account_id = i.account_id
                    WHERE i.company_id = activities.entity_id::uuid
                    AND r.deleted_at IS NULL
                )
            ELSE false
        END
    );
```

## **7. Banking Information Policies**

### **7.1 Bank Information Access**
```sql
ALTER TABLE bank_info ENABLE ROW LEVEL SECURITY;

-- View policy for account team members
CREATE POLICY bank_info_view_policy ON bank_info
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = bank_info.account_id 
            AND deleted_at IS NULL
        )
    );

-- Modification policy for signers and admins
CREATE POLICY bank_info_modify_policy ON bank_info
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = bank_info.account_id 
            AND role_type IN ('signer', 'admin')
            AND deleted_at IS NULL
        )
    );
```

## **8. Compliance Data Policies**

### **8.1 Accreditation Access**
```sql
ALTER TABLE accreditation ENABLE ROW LEVEL SECURITY;

-- View policy for account team members and GP admins
CREATE POLICY accreditation_view_policy ON accreditation
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = accreditation.account_id 
            AND deleted_at IS NULL
        )
        OR 
        auth.uid() IN (SELECT user_id FROM user_profiles WHERE is_gp_admin = true)
    );

-- Modification policy for GP admins only
CREATE POLICY accreditation_modify_policy ON accreditation
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE is_gp_admin = true));
```

### **8.2 AML Verification Access**
```sql
ALTER TABLE aml_verification ENABLE ROW LEVEL SECURITY;

-- View policy for account team members and GP admins
CREATE POLICY aml_verification_view_policy ON aml_verification
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id 
            FROM roles 
            WHERE account_id = aml_verification.account_id 
            AND deleted_at IS NULL
        )
        OR 
        auth.uid() IN (SELECT user_id FROM user_profiles WHERE is_gp_admin = true)
    );

-- Modification policy for GP admins only
CREATE POLICY aml_verification_modify_policy ON aml_verification
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE is_gp_admin = true));
```

## **9. Policy Application Notes**

1. All policies assume the existence of a valid auth.uid() function
2. Soft deletion is respected in all policies through deleted_at checks
3. GP admin override is provided where appropriate
4. Policies are designed to be restrictive by default
5. All modifications are tracked through audit fields
6. Nested ownership relationships are properly handled
7. Role-based access is consistently enforced
8. Time-based restrictions can be added through valid_until fields
9. Policies prevent unauthorized data access and modification
10. Complex relationships are handled through appropriate joins
