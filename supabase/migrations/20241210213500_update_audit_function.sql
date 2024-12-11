-- Update audit function to handle both authenticated users and service role
CREATE OR REPLACE FUNCTION update_audit_fields()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    -- If running as service role (during migrations), use special system user
    -- Otherwise use the authenticated user's ID
    IF auth.role() = 'service_role' THEN
        NEW.updated_by = '00000000-0000-0000-0000-000000000000'::uuid;
    ELSE
        NEW.updated_by = auth.uid();
    END IF;
    
    IF TG_OP = 'INSERT' THEN
        NEW.created_at = CURRENT_TIMESTAMP;
        -- Same logic for created_by
        IF auth.role() = 'service_role' THEN
            NEW.created_by = '00000000-0000-0000-0000-000000000000'::uuid;
        ELSE
            NEW.created_by = auth.uid();
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
