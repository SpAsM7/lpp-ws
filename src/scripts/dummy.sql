-- Generated Test Data
BEGIN;


    -- Create admin user for test data
    INSERT INTO auth.users (id, email, raw_user_meta_data) 
    VALUES (
      '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid, 
      'admin@example.com',
      '{"first_name":"Admin","last_name":"User"}'
    );

    INSERT INTO user_profiles (
      user_id, first_name, last_name, is_gp_user, is_lp_user,
      created_at, created_by, updated_at, updated_by
    )
    VALUES (
      '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid, 'Admin', 'User',
      TRUE, FALSE,
      NOW(), '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid, NOW(), '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid
    );

    INSERT INTO gp_roles (
      id, user_id, role_type,
      created_at, created_by, updated_at, updated_by
    )
    VALUES (
      '568eb234-5f55-4f07-bf71-19a2b1108ac4'::uuid, '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid, 'admin',
      NOW(), '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid, NOW(), '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid
    );
  


      -- Create LP user 1
      INSERT INTO auth.users (id, email, raw_user_meta_data)
      VALUES (
        'a50a6a9d-17f6-492c-bda1-a3f25c5270ac'::uuid,
        'lp1@example.com',
        '{"first_name":"LP","last_name":"User 1"}'
      );

      INSERT INTO user_profiles (
        user_id, first_name, last_name, is_gp_user, is_lp_user,
        created_at, created_by, updated_at, updated_by
      )
      VALUES (
        'a50a6a9d-17f6-492c-bda1-a3f25c5270ac'::uuid, 'LP', 'User 1',
        FALSE, TRUE,
        NOW(), 'a50a6a9d-17f6-492c-bda1-a3f25c5270ac'::uuid, NOW(), 'a50a6a9d-17f6-492c-bda1-a3f25c5270ac'::uuid
      );
    


      INSERT INTO companies (
        company_id, company_name, status, description, industry, 
        founded_date, website, created_at, created_by, updated_at, updated_by
      )
      VALUES (
        'b6c0b8c6-b6ae-426c-9b23-2126ef6c16b4'::uuid,
        'Advanced Tech Holdings',
        'active',
        'Advanced Tech Holdings is a leading provider of innovative solutions.',
        'technology',
        '2019-12-15',
        'https://www.advancedtechholdings.com',
        '2024-11-29T20:22:04.005Z',
        '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid,
        '2024-11-29T20:22:04.005Z',
        '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid
      );
    


      INSERT INTO accounts (
        account_id, account_name, account_type, status, kyc_status, accreditation_status,
        created_at, created_by, updated_at, updated_by
      )
      VALUES (
        '73c3884a-a3ff-4b37-bbf1-a1a092df7d97'::uuid,
        'James Miller',
        'individual',
        'active',
        'completed',
        'pending_verification',
        NOW(),
        '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid,
        NOW(),
        '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid
      );
    


      INSERT INTO individual_details (id, account_id, created_at, created_by, updated_at, updated_by, tax_id, us_person, tax_year_end, joint_account, joint_holder_info, professional_title, employer, acting_as_nominee, mailing_address)
      VALUES ('58a12f50-735e-4e83-8e64-d84445fe5670'::uuid, '73c3884a-a3ff-4b37-bbf1-a1a092df7d97'::uuid, '2024-11-29', '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid, '2024-11-29', '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid, '376-24-7353', TRUE, '12/31', FALSE, '{}', 'Executive', 'Advanced Partners Holdings', FALSE, '{"street":"839 Maple Dr","city":"Chicago","state":"AZ","postal_code":"70274","country":"USA"}');
    


        INSERT INTO investments (
          investment_id, account_id, company_id, investment_status, investment_type,
          initial_investment_date, total_committed_capital, total_called_capital,
          total_distributions, current_nav, last_valuation_date, investment_metrics,
          created_at, created_by, updated_at, updated_by
        )
        VALUES (
          '33c4d238-66bf-4fe3-a3bc-761b8108d80e'::uuid,
          '73c3884a-a3ff-4b37-bbf1-a1a092df7d97'::uuid,
          'b6c0b8c6-b6ae-426c-9b23-2126ef6c16b4'::uuid,
          'fully_exited',
          'spv',
          '2016-06-12',
          4265030,
          789090,
          223013,
          1008202,
          '2024-11-29',
          '{"irr":2.216829318347544,"moic":1.8168212685720402,"dpi":0.7750789802749689,"tvpi":1.3632639581783272}',
          '2024-11-29',
          '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid,
          '2024-11-29',
          '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid
        );
      


        INSERT INTO investments (
          investment_id, account_id, company_id, investment_status, investment_type,
          initial_investment_date, total_committed_capital, total_called_capital,
          total_distributions, current_nav, last_valuation_date, investment_metrics,
          created_at, created_by, updated_at, updated_by
        )
        VALUES (
          '23f5f208-2c3f-417f-a4f0-07ea541780f1'::uuid,
          '73c3884a-a3ff-4b37-bbf1-a1a092df7d97'::uuid,
          'b6c0b8c6-b6ae-426c-9b23-2126ef6c16b4'::uuid,
          'active',
          'spv',
          '2016-08-14',
          9146520,
          6976412,
          619335,
          10505943,
          '2024-11-29',
          '{"irr":16.96523469854168,"moic":2.757476228325783,"dpi":0.0831423278305945,"tvpi":1.4215973160782769}',
          '2024-11-29',
          '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid,
          '2024-11-29',
          '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid
        );
      


          INSERT INTO roles (
            id, account_id, user_id, role_type, can_remove_self,
            created_at, created_by, updated_at, updated_by
          )
          VALUES (
            'df36b4b4-afa5-427b-9b0a-d1993341ff30'::uuid,
            '73c3884a-a3ff-4b37-bbf1-a1a092df7d97'::uuid,
            '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid,
            'signer',
            false,
            NOW(),
            '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid,
            NOW(),
            '39c211a0-0aa6-4fba-a7de-81e3f3af277b'::uuid
          );
        

