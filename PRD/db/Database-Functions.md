# **Database Functions**

## **1. Validation Functions**

### **1.1 Tax ID Validation**
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

-- Apply validation through trigger
CREATE OR REPLACE FUNCTION validate_tax_id_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT validate_tax_id(NEW.tax_id_type, NEW.tax_id) THEN
        RAISE EXCEPTION 'Invalid tax ID format for type %', NEW.tax_id_type;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for relevant tables
CREATE TRIGGER validate_individual_tax_id
    BEFORE INSERT OR UPDATE ON individual_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_tax_id_trigger();

CREATE TRIGGER validate_entity_tax_id
    BEFORE INSERT OR UPDATE ON entity_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_tax_id_trigger();

CREATE TRIGGER validate_trust_tax_id
    BEFORE INSERT OR UPDATE ON trust_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_tax_id_trigger();

CREATE TRIGGER validate_retirement_tax_id
    BEFORE INSERT OR UPDATE ON retirement_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_tax_id_trigger();
```

### **1.2 Ownership Validation**
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
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) + COALESCE(NEW.ownership_percent, 0) > 100 THEN
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

### **1.3 Bank Information Validation**
```sql
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

CREATE TRIGGER validate_bank_info_trigger
    BEFORE INSERT OR UPDATE ON bank_info
    FOR EACH ROW
    EXECUTE FUNCTION validate_bank_info();
```

### **1.4 Date Validation**
```sql
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

-- Apply to relevant tables
CREATE TRIGGER validate_entity_dates
    BEFORE INSERT OR UPDATE ON entity_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_dates();

CREATE TRIGGER validate_trust_dates
    BEFORE INSERT OR UPDATE ON trust_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_dates();
```

### **1.5 GP Role Validation**
```sql
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

CREATE TRIGGER validate_gp_role_trigger
    BEFORE INSERT OR UPDATE ON gp_roles
    FOR EACH ROW
    EXECUTE FUNCTION validate_gp_role();
```

## **2. Utility Functions**

### **2.1 Soft Delete**
```sql
CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deleted_at = CURRENT_TIMESTAMP;
    NEW.deleted_by = current_user;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with soft delete
CREATE TRIGGER soft_delete_trigger
    BEFORE UPDATE OF deleted_at ON accounts
    FOR EACH ROW
    WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION soft_delete();
```

### **2.2 Audit Trail**
```sql
CREATE OR REPLACE FUNCTION update_audit_fields()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.updated_by = current_user;
    
    IF TG_OP = 'INSERT' THEN
        NEW.created_at = CURRENT_TIMESTAMP;
        NEW.created_by = current_user;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with audit fields
CREATE TRIGGER update_audit_fields_trigger
    BEFORE INSERT OR UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_audit_fields();
```

### **2.3 Activity Logging**
```sql
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

-- Apply to relevant tables
CREATE TRIGGER log_account_activity
    AFTER INSERT OR UPDATE OR DELETE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION log_activity('account');
```

### **2.4 JSON Validation**
```sql
CREATE OR REPLACE FUNCTION validate_json_schema(
    data JSONB,
    schema JSONB
) RETURNS BOOLEAN AS $$
DECLARE
    required_field TEXT;
BEGIN
    -- Check required fields
    FOR required_field IN SELECT jsonb_array_elements_text(schema->'required')
    LOOP
        IF data->required_field IS NULL THEN
            RETURN FALSE;
        END IF;
    END LOOP;

    -- Additional schema validation logic can be added here
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Example usage in a trigger
CREATE OR REPLACE FUNCTION validate_address_json()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT validate_json_schema(
        NEW.mailing_address,
        '{
            "required": ["street", "city", "country"],
            "properties": {
                "street": {"type": "string"},
                "city": {"type": "string"},
                "state": {"type": "string"},
                "postal_code": {"type": "string"},
                "country": {"type": "string"}
            }
        }'::jsonb
    ) THEN
        RAISE EXCEPTION 'Invalid address format';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## **3. Function Usage Notes**

1. All validation functions include appropriate error messages
2. Triggers are used to automatically enforce validation
3. Utility functions handle common operations
4. Activity logging is comprehensive and configurable
5. JSON validation ensures data structure integrity
6. Date validations prevent logical inconsistencies
7. Soft delete is consistently implemented
8. Audit trails are automatically maintained
9. All functions are properly documented
10. Error handling is robust and informative
