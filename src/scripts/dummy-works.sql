-- Generated Test Data
BEGIN;

-- Create admin user first
INSERT INTO auth.users (id, email, raw_user_meta_data) 
VALUES (
    'df4a4e5b-0307-461b-a2e1-3e94a5f3656d',  
    'admin@example.com',
    jsonb_build_object(
        'name', 'Admin User',
        'avatar_url', 'https://example.com/avatar.png'
    )
) ON CONFLICT (id) DO NOTHING;

-- Set this admin user for audit trails
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

    -- Create admin user for test data
    INSERT INTO user_profiles (
      user_id, first_name, last_name, is_gp_user, is_lp_user,
      created_at, created_by, updated_at, updated_by
    )
    VALUES (
      'df4a4e5b-0307-461b-a2e1-3e94a5f3656d', 'Admin', 'User',
      TRUE, FALSE,
      NOW(), 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d', NOW(), 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'
    );

    INSERT INTO gp_roles (
      id, user_id, role_type,
      created_at, created_by, updated_at, updated_by
    )
    VALUES (
      '07d0050f-3beb-4404-afda-97f89b00ede9'::uuid, 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d', 'admin',
      NOW(), 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d', NOW(), 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'
    );
  


      -- Create LP user 1
      INSERT INTO auth.users (id, email, raw_user_meta_data)
      VALUES (
        '95172a1b-847f-4d6a-b422-c2121a37a00d'::uuid,
        'lp1@example.com',
        '{"first_name":"LP","last_name":"User 1"}'
      );

      INSERT INTO user_profiles (
        user_id, first_name, last_name, is_gp_user, is_lp_user,
        created_at, created_by, updated_at, updated_by
      )
      VALUES (
        '95172a1b-847f-4d6a-b422-c2121a37a00d'::uuid, 'LP', 'User 1',
        FALSE, TRUE,
        NOW(), '95172a1b-847f-4d6a-b422-c2121a37a00d'::uuid, NOW(), '95172a1b-847f-4d6a-b422-c2121a37a00d'::uuid
      );
    


      INSERT INTO companies (
        company_id, company_name, status, description, industry, 
        founded_date, website, created_at, created_by, updated_at, updated_by
      )
      VALUES (
        '11e92763-1e72-4c6f-b85e-072fe66a1968'::uuid,
        'Elite Partners Group',
        'archived',
        'Elite Partners Group is a leading provider of innovative solutions.',
        'finance',
        '2003-05-20',
        'https://www.elitepartnersgroup.com',
        '2024-12-06T03:39:02.326Z',
        'df4a4e5b-0307-461b-a2e1-3e94a5f3656d',
        '2024-12-06T03:39:02.326Z',
        'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'
      );
    


      INSERT INTO accounts (
        account_id, account_name, account_type, status, kyc_status, accreditation_status,
        created_at, created_by, updated_at, updated_by
      )
      VALUES (
        'e96adf2d-1872-410b-a555-2cd019cebece'::uuid,
        'James Jones',
        'individual',
        'pending',
        'in_progress',
        'accredited',
        NOW(),
        'df4a4e5b-0307-461b-a2e1-3e94a5f3656d',
        NOW(),
        'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'
      );
    


      INSERT INTO individual_details (id, account_id, created_at, created_by, updated_at, updated_by, tax_id, tax_id_type, us_person, tax_year_end, joint_account, joint_holder_info, professional_title, employer, acting_as_nominee, mailing_address)
      VALUES ('d011f44d-d1ef-403b-9cf7-8c3df175839e'::uuid, 'e96adf2d-1872-410b-a555-2cd019cebece'::uuid, '2024-12-06', 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d', '2024-12-06', 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d', '366-74-6422', 'ssn', TRUE, '12/31', FALSE, '{}', 'Executive', 'Strategic Systems LLC', FALSE, '{"street":"5650 Washington Blvd","city":"Los Angeles","state":"CA","postal_code":"85277","country":"USA"}');
    


        INSERT INTO investments (
          investment_id, account_id, company_id, investment_status, investment_type,
          initial_investment_date, total_committed_capital, total_called_capital,
          total_distributions, current_nav, last_valuation_date, investment_metrics,
          created_at, created_by, updated_at, updated_by
        )
        VALUES (
          'f4792f43-e474-4668-b28b-12dd0db5fca9'::uuid,
          'e96adf2d-1872-410b-a555-2cd019cebece'::uuid,
          '11e92763-1e72-4c6f-b85e-072fe66a1968'::uuid,
          'fully_exited',
          'spv',
          '2016-01-04',
          8004904,
          3807583,
          1804681,
          4607462,
          '2024-12-06',
          '{"irr":9.315485217779528,"moic":2.8096885724920266,"dpi":0.3325823536039627,"tvpi":1.6640671605853936}',
          '2024-12-06',
          'df4a4e5b-0307-461b-a2e1-3e94a5f3656d',
          '2024-12-06',
          'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'
        );
      


        INSERT INTO investments (
          investment_id, account_id, company_id, investment_status, investment_type,
          initial_investment_date, total_committed_capital, total_called_capital,
          total_distributions, current_nav, last_valuation_date, investment_metrics,
          created_at, created_by, updated_at, updated_by
        )
        VALUES (
          '78f1edbf-ceb6-4c47-9584-35c96ec60fd0'::uuid,
          'e96adf2d-1872-410b-a555-2cd019cebece'::uuid,
          '11e92763-1e72-4c6f-b85e-072fe66a1968'::uuid,
          'pending',
          'direct',
          '2015-11-01',
          9423707,
          6780416,
          2906210,
          11724728,
          '2024-12-06',
          '{"irr":11.672605488094323,"moic":2.6332618404442436,"dpi":0.9869027501853982,"tvpi":1.5206881355858743}',
          '2024-12-06',
          'df4a4e5b-0307-461b-a2e1-3e94a5f3656d',
          '2024-12-06',
          'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'
        );
      


        INSERT INTO investments (
          investment_id, account_id, company_id, investment_status, investment_type,
          initial_investment_date, total_committed_capital, total_called_capital,
          total_distributions, current_nav, last_valuation_date, investment_metrics,
          created_at, created_by, updated_at, updated_by
        )
        VALUES (
          '951bd394-1d81-4550-9e7c-286f52181582'::uuid,
          'e96adf2d-1872-410b-a555-2cd019cebece'::uuid,
          '11e92763-1e72-4c6f-b85e-072fe66a1968'::uuid,
          'partially_exited',
          'direct',
          '2015-08-26',
          3226313,
          1823832,
          737420,
          1946430,
          '2024-12-06',
          '{"irr":13.087733867731448,"moic":2.097988826966906,"dpi":0.21944044299241194,"tvpi":1.8626189718253903}',
          '2024-12-06',
          'df4a4e5b-0307-461b-a2e1-3e94a5f3656d',
          '2024-12-06',
          'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'
        );
      


          INSERT INTO roles (
            id, account_id, user_id, role_type, can_remove_self,
            created_at, created_by, updated_at, updated_by
          )
          VALUES (
            'bffa5f05-8161-4cf0-9add-7b0ae78256cc'::uuid,
            'e96adf2d-1872-410b-a555-2cd019cebece'::uuid,
            'df4a4e5b-0307-461b-a2e1-3e94a5f3656d',
            'admin',
            true,
            NOW(),
            'df4a4e5b-0307-461b-a2e1-3e94a5f3656d',
            NOW(),
            'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'
          );
        


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
