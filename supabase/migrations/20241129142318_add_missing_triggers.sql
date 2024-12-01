-- Migration file: 20241129142318_add_missing_triggers.sql

-- Create triggers for tax ID validation
CREATE TRIGGER validate_tax_id
    BEFORE INSERT OR UPDATE ON individual_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_tax_id();

CREATE TRIGGER validate_tax_id
    BEFORE INSERT OR UPDATE ON entity_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_tax_id();

CREATE TRIGGER validate_tax_id
    BEFORE INSERT OR UPDATE ON trust_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_tax_id();

CREATE TRIGGER validate_tax_id
    BEFORE INSERT OR UPDATE ON retirement_details
    FOR EACH ROW
    EXECUTE FUNCTION validate_tax_id();

-- Rollback SQL
-- DROP TRIGGER IF EXISTS validate_tax_id ON individual_details;
-- DROP TRIGGER IF EXISTS validate_tax_id ON entity_details;
-- DROP TRIGGER IF EXISTS validate_tax_id ON trust_details;
-- DROP TRIGGER IF EXISTS validate_tax_id ON retirement_details;
