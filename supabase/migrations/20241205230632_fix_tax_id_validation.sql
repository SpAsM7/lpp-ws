-- Fix tax ID validation function to handle all cases
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
        ELSE
            RAISE EXCEPTION 'Invalid tax ID type: %. Must be one of: ssn, itin, ein', NEW.tax_id_type;
    END CASE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
