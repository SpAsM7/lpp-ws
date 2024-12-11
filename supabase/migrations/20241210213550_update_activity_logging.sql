-- Update activity logging to handle service role properly
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
DECLARE
    activity_user uuid;
BEGIN
    -- If running as service role (during migrations), use special system user
    -- Otherwise use the authenticated user's ID
    IF auth.role() = 'service_role' THEN
        activity_user := '00000000-0000-0000-0000-000000000000'::uuid;
    ELSE
        activity_user := auth.uid();
    END IF;

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
        CASE TG_OP
            WHEN 'DELETE' THEN OLD.account_id
            ELSE NEW.account_id
        END,
        jsonb_build_object(
            'operation', TG_OP,
            'table', TG_TABLE_NAME,
            'timestamp', CURRENT_TIMESTAMP
        ),
        'medium',
        activity_user,
        activity_user
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
