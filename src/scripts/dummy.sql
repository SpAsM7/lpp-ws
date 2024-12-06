-- Generated Test Data

BEGIN;

-- Create new admin user
INSERT INTO auth.users (id, email, raw_user_meta_data) 
VALUES (
    'd71fa313-7950-4cb8-8239-5927d48a5f3a'::uuid,  
    'admin.1733516322604@example.com',
    jsonb_build_object(
        'name', 'Admin User',
        'avatar_url', 'https://example.com/avatar.png'
    )
);

-- Set audit trail user
SET LOCAL "request.jwt.claim.sub" = 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d';

-- Temporarily disable validation triggers
ALTER TABLE individual_details DISABLE TRIGGER validate_individual_tax_id;
ALTER TABLE entity_details DISABLE TRIGGER validate_entity_tax_id;
ALTER TABLE trust_details DISABLE TRIGGER validate_trust_tax_id;
ALTER TABLE retirement_details DISABLE TRIGGER validate_retirement_tax_id;

-- Temporarily disable activity logging triggers
ALTER TABLE accounts DISABLE TRIGGER log_account_activity;
ALTER TABLE accreditation DISABLE TRIGGER log_accreditation_activity;
ALTER TABLE aml_verification DISABLE TRIGGER log_aml_verification_activity;
ALTER TABLE bank_info DISABLE TRIGGER log_bank_info_activity;
ALTER TABLE beneficial_owners DISABLE TRIGGER log_beneficial_owners_activity;
ALTER TABLE companies DISABLE TRIGGER log_company_activity;
ALTER TABLE investments DISABLE TRIGGER log_investment_activity;
ALTER TABLE files DISABLE TRIGGER log_file_activity;

    -- Create admin user profile
    INSERT INTO user_profiles (
      user_id, first_name, last_name, is_gp_user, is_lp_user,
      created_at, created_by, updated_at, updated_by
    )
    VALUES (
      'd71fa313-7950-4cb8-8239-5927d48a5f3a'::uuid, 'Admin', 'User',
      TRUE, FALSE,
      NOW(), 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid, NOW(), 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid
    );

    INSERT INTO gp_roles (
      id, user_id, role_type,
      created_at, created_by, updated_at, updated_by
    )
    VALUES (
      '2f0045fa-e652-4ece-ab6b-1ab32faaa1cf'::uuid, 'd71fa313-7950-4cb8-8239-5927d48a5f3a'::uuid, 'admin',
      NOW(), 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid, NOW(), 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid
    );

      -- Create LP user 1
      INSERT INTO auth.users (id, email, raw_user_meta_data)
      VALUES (
        'acdb835e-1678-4589-8d30-5ee406117e44'::uuid,
        'lp1.1733516322604@example.com',
        jsonb_build_object(
          'name', 'LP User 1',
          'avatar_url', 'https://example.com/avatar.png'
        )
      );

      INSERT INTO user_profiles (
        user_id, first_name, last_name, is_gp_user, is_lp_user,
        created_at, created_by, updated_at, updated_by
      )
      VALUES (
        'acdb835e-1678-4589-8d30-5ee406117e44'::uuid, 'LP', 'User 1',
        FALSE, TRUE,
        NOW(), 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid, NOW(), 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid
      );
    
      INSERT INTO companies (
        id, company_name, status, description, industry, 
        founded_date, website, created_at, created_by, updated_at, updated_by
      )
      VALUES (
        '610caac5-b53b-4d36-998a-4a3a1900b744'::uuid,
        'Company 650',
        'pending',
        'Company 650 is a leading provider of innovative solutions.',
        'energy',
        '2000-09-13T04:00:00.000Z',
        'https://www.company650.com',
        '2024-12-06T20:18:42.604Z',
        'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid,
        '2024-12-06T20:18:42.604Z',
        'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid
      );
    
      INSERT INTO accounts (
        account_id, account_name, account_type, status, kyc_status, accreditation_status,
        created_at, created_by, updated_at, updated_by
      )
      VALUES (
        'bbb0bab8-530e-494d-b92d-cb81cc87ae08'::uuid,
        'Jane Garcia',
        'individual',
        'closed',
        'expired',
        'accredited',
        NOW(),
        'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid,
        NOW(),
        'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid
      );
    INSERT INTO individual_details (
        id, account_id, tax_id, tax_id_type, us_person, tax_year_end,
        joint_account, joint_holder_info, professional_title, employer,
        acting_as_nominee, mailing_address,
        created_at, created_by, updated_at, updated_by
      ) VALUES (
        'ec02278e-796c-4fd4-9476-97facdafa8dc', 'bbb0bab8-530e-494d-b92d-cb81cc87ae08'::uuid,
        '842-71-6294', 'ssn',
        true, '12/31',
        false, '{}',
        'Manager', 'Global Industries',
        false, '{"street":"1903 Park Rd","city":"Los Angeles","state":"CA","postal_code":"52625","country":"USA"}',
        '2024-12-06', 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid,
        '2024-12-06', 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid
      );

        INSERT INTO investments (
          id, account_id, company_id, investment_status, investment_type,
          initial_investment_date, total_committed_capital, total_called_capital,
          total_distributions, current_nav, last_valuation_date, investment_metrics,
          created_at, created_by, updated_at, updated_by
        )
        VALUES (
          '36ded9aa-e71b-40c0-9a53-67c12ea5a5e3'::uuid,
          'bbb0bab8-530e-494d-b92d-cb81cc87ae08'::uuid,
          '610caac5-b53b-4d36-998a-4a3a1900b744'::uuid,
          'closed',
          'spv',
          '2021-05-27T04:00:00.000Z',
          775788,
          354728,
          164486,
          492980,
          '2022-02-14T05:00:00.000Z',
          '{"irr":8.053583570678665,"moic":1.604350726558788,"tvpi":2.337262119026737}',
          '2024-12-06T20:18:42.605Z',
          'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid,
          '2024-12-06T20:18:42.605Z',
          'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid
        );
      
        INSERT INTO investments (
          id, account_id, company_id, investment_status, investment_type,
          initial_investment_date, total_committed_capital, total_called_capital,
          total_distributions, current_nav, last_valuation_date, investment_metrics,
          created_at, created_by, updated_at, updated_by
        )
        VALUES (
          'd3f7f4df-4e40-45d9-a773-3766b5d680e7'::uuid,
          'bbb0bab8-530e-494d-b92d-cb81cc87ae08'::uuid,
          '610caac5-b53b-4d36-998a-4a3a1900b744'::uuid,
          'active',
          'spv',
          '2021-04-22T04:00:00.000Z',
          526275,
          297423,
          29884,
          814250,
          '2023-07-25T04:00:00.000Z',
          '{"irr":16.045483665918884,"moic":2.9733445296349226,"tvpi":1.6202725191852405}',
          '2024-12-06T20:18:42.605Z',
          'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid,
          '2024-12-06T20:18:42.605Z',
          'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid
        );
      
        INSERT INTO investments (
          id, account_id, company_id, investment_status, investment_type,
          initial_investment_date, total_committed_capital, total_called_capital,
          total_distributions, current_nav, last_valuation_date, investment_metrics,
          created_at, created_by, updated_at, updated_by
        )
        VALUES (
          'a70f856b-28fa-4c14-a8c3-fadda37fe3a4'::uuid,
          'bbb0bab8-530e-494d-b92d-cb81cc87ae08'::uuid,
          '610caac5-b53b-4d36-998a-4a3a1900b744'::uuid,
          'active',
          'direct',
          '2021-02-12T05:00:00.000Z',
          1098416,
          275349,
          99099,
          133350,
          '2022-09-13T04:00:00.000Z',
          '{"irr":9.230613089619673,"moic":1.8961318693713465,"tvpi":2.151824906471976}',
          '2024-12-06T20:18:42.605Z',
          'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid,
          '2024-12-06T20:18:42.605Z',
          'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid
        );
      INSERT INTO roles (id, user_id, account_id, role_type, created_at, created_by, updated_at, updated_by)
      VALUES ('a6019cd2-397a-4253-ac92-99ede5191438'::uuid, 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid, 'bbb0bab8-530e-494d-b92d-cb81cc87ae08'::uuid, 'admin',
      NOW(), 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid, NOW(), 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'::uuid);

-- Re-enable validation triggers
ALTER TABLE individual_details ENABLE TRIGGER validate_individual_tax_id;
ALTER TABLE entity_details ENABLE TRIGGER validate_entity_tax_id;
ALTER TABLE trust_details ENABLE TRIGGER validate_trust_tax_id;
ALTER TABLE retirement_details ENABLE TRIGGER validate_retirement_tax_id;

-- Re-enable activity logging triggers
ALTER TABLE accounts ENABLE TRIGGER log_account_activity;
ALTER TABLE accreditation ENABLE TRIGGER log_accreditation_activity;
ALTER TABLE aml_verification ENABLE TRIGGER log_aml_verification_activity;
ALTER TABLE bank_info ENABLE TRIGGER log_bank_info_activity;
ALTER TABLE beneficial_owners ENABLE TRIGGER log_beneficial_owners_activity;
ALTER TABLE companies ENABLE TRIGGER log_company_activity;
ALTER TABLE investments ENABLE TRIGGER log_investment_activity;
ALTER TABLE files ENABLE TRIGGER log_file_activity;

COMMIT;
