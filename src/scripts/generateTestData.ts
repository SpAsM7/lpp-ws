import { 
  v4 as uuidv4 
} from 'uuid';
import { 
  randomChoice, 
  randomDate, 
  generateCompanyName, 
  generatePersonName, 
  generateSSN, 
  generateEIN,
  escapeSQL
} from './utils';

// Updated type definitions to match schema constraints
type AccountType = 'individual' | 'entity' | 'trust' | 'retirement';
type AccountStatus = 'pending' | 'active' | 'suspended' | 'closed';
type KYCStatus = 'not_started' | 'in_progress' | 'completed' | 'expired';
type AccreditationStatus = 'accredited' | 'not_accredited' | 'pending_verification';
type EntityType = 'corporation' | 'partnership' | 'llc' | 'other';
type TrustType = 'living' | 'testamentary' | 'charitable' | 'business';
type RetirementPlanType = 'traditional_ira' | 'roth_ira' | '401k' | 'other';
type RoleType = 'signer' | 'admin' | 'editor' | 'viewer';
type CompanyStatus = 'active' | 'inactive' | 'pending' | 'archived';
type InvestmentStatus = 'active' | 'pending' | 'fully_exited' | 'partially_exited';
type InvestmentType = 'direct' | 'fund' | 'spv';

interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

// Updated utility functions
function generateAddress(): Address {
  const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Washington Blvd', 'Park Rd'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
  
  return {
    street: `${Math.floor(Math.random() * 10000)} ${randomChoice(streets)}`,
    city: randomChoice(cities),
    state: randomChoice(states),
    postal_code: String(Math.floor(Math.random() * 90000) + 10000),
    country: 'USA'
  };
}

// Add formatDate helper function
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Updated company generator with schema-compliant status
function generateCompany(userId: string): any {
  const companyName = `Company ${Math.floor(Math.random() * 1000)}`;
  const status: CompanyStatus = randomChoice(['active', 'inactive', 'pending']);
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
    company_name: companyName,
    status,
    description: `${companyName} is a leading provider of innovative solutions.`,
    industry: randomChoice(['technology', 'healthcare', 'finance', 'real_estate', 'energy']),
    founded_date: new Date(2000 + Math.floor(Math.random() * 23), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
    website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
    created_at: now,
    created_by: userId,
    updated_at: now,
    updated_by: userId
  };
}

// Updated investment generator with explicit validation checks
function generateInvestment(accountId: string, companyId: string, userId: string): any {
  const status: InvestmentStatus = randomChoice(['active', 'pending', 'fully_exited', 'partially_exited']);
  const type: InvestmentType = randomChoice(['direct', 'fund', 'spv']);

  return {
    id: uuidv4(),
    account_id: accountId,
    company_id: companyId,
    investment_status: status,
    investment_type: type,
    initial_investment_date: new Date(2020 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
    total_committed_capital: Math.floor(Math.random() * 1000000) + 100000,
    total_called_capital: Math.floor(Math.random() * 500000) + 50000,
    total_distributions: Math.floor(Math.random() * 200000),
    current_nav: Math.floor(Math.random() * 800000) + 100000,
    last_valuation_date: new Date(2022 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
    investment_metrics: JSON.stringify({
      irr: Math.random() * 20,
      moic: 1 + Math.random() * 2,
      tvpi: 1 + Math.random() * 1.5
    }),
    created_at: new Date().toISOString(),
    created_by: userId,
    updated_at: new Date().toISOString(),
    updated_by: userId
  };
}

// Updated account details generator with schema-compliant fields
function generateAccountDetails(accountId: string, accountType: AccountType, userId: string): any {
  const baseDetails = {
    id: uuidv4(),
    created_at: formatDate(new Date()),
    updated_at: formatDate(new Date()),
    created_by: userId,
    updated_by: userId,
  };

  if (accountType === 'individual') {
    return {
      ...baseDetails,
      tax_id: generateSSN(),
      tax_id_type: 'ssn',
      us_person: true,
      tax_year_end: '12/31',
      joint_account: false,
      joint_holder_info: '{}',
      professional_title: randomChoice(['CEO', 'CFO', 'Executive', 'Manager', 'Director']),
      employer: randomChoice(['Tech Corp', 'Finance LLC', 'Strategic Systems LLC', 'Global Industries']),
      acting_as_nominee: false,
      mailing_address: JSON.stringify(generateAddress()),
    };
  } else if (accountType === 'entity') {
    return {
      ...baseDetails,
      entity_type: randomChoice(['corporation', 'partnership', 'llc', 'other'] as EntityType[]),
      tax_id: generateEIN(),
      tax_id_type: 'ein',
      jurisdiction: 'Delaware',
      formation_date: formatDate(randomDate(new Date(2000, 0, 1), new Date())),
      us_person: true,
      tax_year_end: '12/31',
      tax_exempt: false,
      investment_company_status: false,
      bank_entity_status: false,
      formed_to_invest: false,
      public_reporting_entity: false,
      fatf_jurisdiction: true,
      mailing_address: JSON.stringify(generateAddress()),
      principal_place_business: JSON.stringify(generateAddress())
    };
  } else if (accountType === 'trust') {
    return {
      ...baseDetails,
      trust_type: randomChoice(['living', 'testamentary', 'charitable', 'business'] as TrustType[]),
      tax_id: generateEIN(),
      tax_id_type: 'ein',
      us_person: true,
      tax_year_end: '12/31',
      revocable: Math.random() > 0.5,
      formation_date: formatDate(randomDate(new Date(2000, 0, 1), new Date())),
      formed_to_invest: false,
      grantor_trust: Math.random() > 0.5,
      mailing_address: JSON.stringify(generateAddress())
    };
  } else if (accountType === 'retirement') {
    return {
      ...baseDetails,
      plan_type: randomChoice(['traditional_ira', 'roth_ira', '401k', 'other'] as RetirementPlanType[]),
      tax_id: generateEIN(),
      tax_id_type: 'ein',
      tax_year_end: '12/31',
      self_directed: Math.random() > 0.5,
      custodian_info: JSON.stringify({
        name: generateCompanyName(),
        contact: generatePersonName(),
        phone: '555-555-5555'
      }),
      mailing_address: JSON.stringify(generateAddress())
    };
  }
}

// Updated beneficial owner generator with correct tax ID format based on owner type
function generateBeneficialOwner(parentId: string, parentType: string, userId: string): any {
  // Ensure ownership_percent is between 0 and 100
  const ownershipPercent = Math.min(100, Math.max(0, Math.floor(Math.random() * 50) + 1));
  const ownerType = randomChoice(['individual', 'entity']);
  
  return {
    id: uuidv4(),
    parent_id: parentId,
    parent_type: parentType,
    owner_type: ownerType,
    name: ownerType === 'individual' ? generatePersonName() : generateCompanyName(),
    tax_id: ownerType === 'individual' ? generateSSN() : generateEIN(),
    ownership_percent: ownershipPercent,
    relationship_type: randomChoice(['shareholder', 'partner', 'member', 'trustee', 'beneficiary']),
    control_person: Math.random() > 0.7,
    citizenship: 'US',
    mailing_address: JSON.stringify(generateAddress()),
    employment_info: JSON.stringify({
      employer: generateCompanyName(),
      title: 'Executive',
      years: Math.floor(Math.random() * 20) + 1
    }),
    created_at: formatDate(new Date()),
    created_by: userId,
    updated_at: formatDate(new Date()),
    updated_by: userId
  };
}

// Main function to generate test data
export async function generateTestData(numAccounts: number = 3): Promise<string> {
  const auditUserId = 'df4a4e5b-0307-461b-a2e1-3e94a5f3656d'; // Used for audit trails only
  const newAdminUserId = uuidv4(); // Generate new UUID for the admin user
  const timestamp = new Date().getTime(); // Get current timestamp for unique email
  let sql = '';

  // Start transaction and create admin user first
  sql += `
BEGIN;

-- Create new admin user
INSERT INTO auth.users (id, email, raw_user_meta_data) 
VALUES (
    '${newAdminUserId}'::uuid,  
    ${escapeSQL(`admin.${timestamp}@example.com`)},
    jsonb_build_object(
        'name', 'Admin User',
        'avatar_url', 'https://example.com/avatar.png'
    )
);

-- Set audit trail user
SET LOCAL "request.jwt.claim.sub" = '${auditUserId}';

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
      '${newAdminUserId}'::uuid, 'Admin', 'User',
      TRUE, FALSE,
      NOW(), '${auditUserId}'::uuid, NOW(), '${auditUserId}'::uuid
    );

    INSERT INTO gp_roles (
      id, user_id, role_type,
      created_at, created_by, updated_at, updated_by
    )
    VALUES (
      '${uuidv4()}'::uuid, '${newAdminUserId}'::uuid, 'admin',
      NOW(), '${auditUserId}'::uuid, NOW(), '${auditUserId}'::uuid
    );
`;

  // Create test LP users
  for (let i = 0; i < numAccounts; i++) {
    const lpUserId = uuidv4();
    const lpTimestamp = new Date().getTime() + i; // Add i to ensure unique timestamps even when created in the same millisecond
    sql += `
      -- Create LP user ${i + 1}
      INSERT INTO auth.users (id, email, raw_user_meta_data)
      VALUES (
        '${lpUserId}'::uuid,
        ${escapeSQL(`lp${i + 1}.${lpTimestamp}@example.com`)},
        jsonb_build_object(
          'name', ${escapeSQL(`LP User ${i + 1}`)},
          'avatar_url', 'https://example.com/avatar.png'
        )
      );

      INSERT INTO user_profiles (
        user_id, first_name, last_name, is_gp_user, is_lp_user,
        created_at, created_by, updated_at, updated_by
      )
      VALUES (
        '${lpUserId}'::uuid, ${escapeSQL('LP')}, ${escapeSQL(`User ${i + 1}`)},
        FALSE, TRUE,
        NOW(), '${auditUserId}'::uuid, NOW(), '${auditUserId}'::uuid
      );
    `;
  }

  // Generate companies first
  const companies = Array(Math.ceil(numAccounts / 3)).fill(null).map(() => generateCompany(auditUserId));
  companies.forEach(company => {
    sql += `
      INSERT INTO companies (
        id, company_name, status, description, industry, 
        founded_date, website, created_at, created_by, updated_at, updated_by
      )
      VALUES (
        '${company.id}'::uuid,
        ${escapeSQL(company.company_name)},
        ${escapeSQL(company.status)},
        ${escapeSQL(company.description)},
        ${escapeSQL(company.industry)},
        ${escapeSQL(company.founded_date)},
        ${escapeSQL(company.website)},
        ${escapeSQL(company.created_at)},
        '${company.created_by}'::uuid,
        ${escapeSQL(company.updated_at)},
        '${company.updated_by}'::uuid
      );
    `;
  });

  // Generate accounts and related data
  for (let i = 0; i < numAccounts; i++) {
    const accountId = uuidv4();
    const accountType = randomChoice(['individual', 'entity', 'trust', 'retirement'] as AccountType[]);
    const accountName = accountType === 'individual' ? generatePersonName() : generateCompanyName();
    const status: AccountStatus = randomChoice(['pending', 'active', 'suspended', 'closed']);
    const kycStatus: KYCStatus = randomChoice(['not_started', 'in_progress', 'completed', 'expired']);
    const accreditationStatus: AccreditationStatus = randomChoice(['accredited', 'not_accredited', 'pending_verification']);
    
    // Create account
    sql += `
      INSERT INTO accounts (
        account_id, account_name, account_type, status, kyc_status, accreditation_status,
        created_at, created_by, updated_at, updated_by
      )
      VALUES (
        '${accountId}'::uuid,
        ${escapeSQL(accountName)},
        ${escapeSQL(accountType)},
        ${escapeSQL(status)},
        ${escapeSQL(kycStatus)},
        ${escapeSQL(accreditationStatus)},
        NOW(),
        '${auditUserId}'::uuid,
        NOW(),
        '${auditUserId}'::uuid
      );
    `;

    // Create account details
    const accountDetails = generateAccountDetails(accountId, accountType, auditUserId);
    if (accountType === 'individual') {
      sql += `INSERT INTO individual_details (
        id, account_id, tax_id, tax_id_type, us_person, tax_year_end,
        joint_account, joint_holder_info, professional_title, employer,
        acting_as_nominee, mailing_address,
        created_at, created_by, updated_at, updated_by
      ) VALUES (
        '${accountDetails.id}', '${accountId}'::uuid,
        ${escapeSQL(accountDetails.tax_id)}, ${escapeSQL(accountDetails.tax_id_type)},
        ${accountDetails.us_person}, ${escapeSQL(accountDetails.tax_year_end)},
        ${accountDetails.joint_account}, ${escapeSQL(accountDetails.joint_holder_info)},
        ${escapeSQL(accountDetails.professional_title)}, ${escapeSQL(accountDetails.employer)},
        ${accountDetails.acting_as_nominee}, ${escapeSQL(accountDetails.mailing_address)},
        ${escapeSQL(accountDetails.created_at)}, '${auditUserId}'::uuid,
        ${escapeSQL(accountDetails.updated_at)}, '${auditUserId}'::uuid
      );\n`;
    } else if (accountType === 'entity') {
      sql += `INSERT INTO entity_details (
        id, account_id, entity_type, tax_id, tax_id_type, jurisdiction,
        formation_date, us_person, tax_year_end, tax_exempt,
        investment_company_status, bank_entity_status, formed_to_invest,
        public_reporting_entity, fatf_jurisdiction, mailing_address,
        principal_place_business, created_at, created_by, updated_at, updated_by
      ) VALUES (
        '${accountDetails.id}', '${accountId}'::uuid, ${escapeSQL(accountDetails.entity_type)},
        ${escapeSQL(accountDetails.tax_id)}, ${escapeSQL(accountDetails.tax_id_type)},
        ${escapeSQL(accountDetails.jurisdiction)},
        ${escapeSQL(accountDetails.formation_date)}, ${accountDetails.us_person},
        ${escapeSQL(accountDetails.tax_year_end)}, ${accountDetails.tax_exempt},
        ${accountDetails.investment_company_status}, ${accountDetails.bank_entity_status},
        ${accountDetails.formed_to_invest}, ${accountDetails.public_reporting_entity},
        ${accountDetails.fatf_jurisdiction}, ${escapeSQL(accountDetails.mailing_address)},
        ${escapeSQL(accountDetails.principal_place_business)},
        ${escapeSQL(accountDetails.created_at)}, '${auditUserId}'::uuid,
        ${escapeSQL(accountDetails.updated_at)}, '${auditUserId}'::uuid
      );\n`;
    } else if (accountType === 'trust') {
      sql += `INSERT INTO trust_details (
        id, account_id, trust_type, tax_id, tax_id_type, us_person,
        tax_year_end, revocable, formation_date, formed_to_invest,
        grantor_trust, mailing_address, created_at, created_by, updated_at, updated_by
      ) VALUES (
        '${accountDetails.id}', '${accountId}'::uuid, ${escapeSQL(accountDetails.trust_type)},
        ${escapeSQL(accountDetails.tax_id)}, ${escapeSQL(accountDetails.tax_id_type)},
        ${accountDetails.us_person},
        ${escapeSQL(accountDetails.tax_year_end)}, ${accountDetails.revocable},
        ${escapeSQL(accountDetails.formation_date)}, ${accountDetails.formed_to_invest},
        ${accountDetails.grantor_trust}, ${escapeSQL(accountDetails.mailing_address)},
        ${escapeSQL(accountDetails.created_at)}, '${auditUserId}'::uuid,
        ${escapeSQL(accountDetails.updated_at)}, '${auditUserId}'::uuid
      );\n`;
    } else if (accountType === 'retirement') {
      sql += `INSERT INTO retirement_details (
        id, account_id, plan_type, tax_id, tax_id_type, tax_year_end,
        self_directed, custodian_info, mailing_address
      ) VALUES (
        '${accountDetails.id}', '${accountId}'::uuid, ${escapeSQL(accountDetails.plan_type)},
        ${escapeSQL(accountDetails.tax_id)}, ${escapeSQL(accountDetails.tax_id_type)},
        ${escapeSQL(accountDetails.tax_year_end)},
        ${accountDetails.self_directed}, ${escapeSQL(accountDetails.custodian_info)},
        ${escapeSQL(accountDetails.mailing_address)}
      );\n`;
    }

    // Generate 1-3 investments for each account
    const numInvestments = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numInvestments; j++) {
      const company = randomChoice(companies);
      const investment = generateInvestment(accountId, company.id, auditUserId);
      sql += `
        INSERT INTO investments (
          id, account_id, company_id, investment_status, investment_type,
          initial_investment_date, total_committed_capital, total_called_capital,
          total_distributions, current_nav, last_valuation_date, investment_metrics,
          created_at, created_by, updated_at, updated_by
        )
        VALUES (
          '${investment.id}'::uuid,
          '${accountId}'::uuid,
          '${company.id}'::uuid,
          ${escapeSQL(investment.investment_status)},
          ${escapeSQL(investment.investment_type)},
          ${escapeSQL(investment.initial_investment_date)},
          ${investment.total_committed_capital},
          ${investment.total_called_capital},
          ${investment.total_distributions},
          ${investment.current_nav},
          ${escapeSQL(investment.last_valuation_date)},
          ${escapeSQL(investment.investment_metrics)},
          ${escapeSQL(investment.created_at)},
          '${auditUserId}'::uuid,
          ${escapeSQL(investment.updated_at)},
          '${auditUserId}'::uuid
        );
      `;
    }

    // Generate beneficial owners for entity and trust accounts
    if (accountType === 'entity' || accountType === 'trust') {
      const numOwners = Math.floor(Math.random() * 3) + 1;
      for (let k = 0; k < numOwners; k++) {
        const owner = generateBeneficialOwner(accountDetails.id, `${accountType}_details`, auditUserId);
        sql += `
          INSERT INTO beneficial_owners (
            id, parent_id, parent_type, owner_type, name, tax_id,
            ownership_percent, relationship_type, control_person, citizenship,
            mailing_address, employment_info,
            created_at, created_by, updated_at, updated_by
          )
          VALUES (
            '${owner.id}', '${owner.parent_id}', ${escapeSQL(owner.parent_type)},
            ${escapeSQL(owner.owner_type)},
            ${escapeSQL(owner.name)},
            ${escapeSQL(owner.tax_id)},
            ${owner.ownership_percent},
            ${escapeSQL(owner.relationship_type)},
            ${owner.control_person},
            ${escapeSQL(owner.citizenship)},
            ${escapeSQL(owner.mailing_address)},
            ${escapeSQL(owner.employment_info)},
            ${escapeSQL(owner.created_at)},
            '${auditUserId}'::uuid,
            ${escapeSQL(owner.updated_at)},
            '${auditUserId}'::uuid
          );
        `;
      }
    }

    // Create roles for the account
    sql += `INSERT INTO roles (id, user_id, account_id, role_type, created_at, created_by, updated_at, updated_by)
      VALUES ('${uuidv4()}'::uuid, '${auditUserId}'::uuid, '${accountId}'::uuid, 'admin',
      NOW(), '${auditUserId}'::uuid, NOW(), '${auditUserId}'::uuid);\n`;
  }

  // Re-enable all triggers and commit transaction
  sql += `
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
`;

  return sql;
}
