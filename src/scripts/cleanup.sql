
    -- Delete test data created by admin@example.com
    DELETE FROM roles WHERE created_by IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');
    DELETE FROM beneficial_owners WHERE created_by IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');
    DELETE FROM investments WHERE created_by IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');
    DELETE FROM individual_details WHERE created_by IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');
    DELETE FROM entity_details WHERE created_by IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');
    DELETE FROM trust_details WHERE created_by IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');
    DELETE FROM retirement_details WHERE created_by IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');
    DELETE FROM accounts WHERE created_by IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');
    DELETE FROM companies WHERE created_by IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');
    DELETE FROM gp_roles WHERE created_by IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');
    DELETE FROM user_profiles WHERE created_by IN (SELECT id FROM auth.users WHERE email = 'admin@example.com');
    DELETE FROM auth.users WHERE email = 'admin@example.com';
  