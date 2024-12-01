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
  escapeSQL,
  SQLUUIDValue
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
  const companyName = generateCompanyName();
  const status: CompanyStatus = randomChoice(['active', 'inactive', 'pending', 'archived']);
  const now = new Date().toISOString();
  
  return {
    company_id: new SQLUUIDValue(uuidv4()),
    company_name: companyName,
    status,
    description: `${companyName} is a leading provider of innovative solutions.`,
    industry: randomChoice(['technology', 'healthcare', 'finance', 'real_estate', 'consumer', 'industrial']),
    founded_date: formatDate(randomDate(new Date(2000, 0, 1), new Date())),
    website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
    created_at: now,
    created_by: new SQLUUIDValue(userId),
    updated_at: now,
    updated_by: new SQLUUIDValue(userId)
  };
}

// Updated investment generator with explicit validation checks
function generateInvestment(accountId: string, companyId: string, userId: string): any {
  const initialDate = randomDate(new Date(2015, 0, 1), new Date());
  
  // Ensure all monetary amounts are non-negative
  const committedCapital = Math.max(0, Math.floor(Math.random() * 10000000) + 1000000);
  const calledCapital = Math.min(committedCapital, Math.max(0, Math.floor(committedCapital * (Math.random() * 0.8 + 0.1))));
  const distributions = Math.max(0, Math.floor(calledCapital * (Math.random() * 0.5)));
  const nav = Math.max(0, Math.floor(calledCapital * (1 + Math.random())));

  const status: InvestmentStatus = randomChoice(['active', 'pending', 'fully_exited', 'partially_exited']);
  const type: InvestmentType = randomChoice(['direct', 'fund', 'spv']);

  return {
    investment_id: new SQLUUIDValue(uuidv4()),
    account_id: new SQLUUIDValue(accountId),
    company_id: new SQLUUIDValue(companyId),
    investment_status: status,
    investment_type: type,
    initial_investment_date: formatDate(initialDate),
    total_committed_capital: committedCapital,
    total_called_capital: calledCapital,
    total_distributions: distributions,
    current_nav: nav,
    last_valuation_date: formatDate(new Date()),
    investment_metrics: JSON.stringify({
      irr: Math.random() * 30,
      moic: 1 + Math.random() * 2,
      dpi: Math.random(),
      tvpi: 1 + Math.random()
    }),
    created_at: formatDate(new Date()),
    created_by: new SQLUUIDValue(userId),
    updated_at: formatDate(new Date()),
    updated_by: new SQLUUIDValue(userId)
  };
}

// Updated account details generator with schema-compliant fields
function generateAccountDetails(accountId: string, accountType: AccountType, userId: string): any {
  const baseDetails = {
    id: new SQLUUIDValue(uuidv4()),
    account_id: new SQLUUIDValue(accountId),
    created_at: formatDate(new Date()),
    created_by: new SQLUUIDValue(userId),
    updated_at: formatDate(new Date()),
    updated_by: new SQLUUIDValue(userId)
  };

  switch (accountType) {
    case 'individual':
      return {
        ...baseDetails,
        tax_id: generateSSN(),
        us_person: true,
        tax_year_end: '12/31',
        joint_account: Math.random() > 0.7,
        joint_holder_info: JSON.stringify(Math.random() > 0.7 ? {
          name: generatePersonName(),
          tax_id: generateSSN()
        } : {}),
        professional_title: 'Executive',
        employer: generateCompanyName(),
        acting_as_nominee: false,
        mailing_address: JSON.stringify(generateAddress())
      };

    case 'entity':
      return {
        ...baseDetails,
        entity_type: randomChoice(['corporation', 'partnership', 'llc', 'other'] as EntityType[]),
        tax_id: generateEIN(),
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

    case 'trust':
      return {
        ...baseDetails,
        trust_type: randomChoice(['living', 'testamentary', 'charitable', 'business'] as TrustType[]),
        tax_id: generateEIN(),
        us_person: true,
        tax_year_end: '12/31',
        revocable: Math.random() > 0.5,
        formation_date: formatDate(randomDate(new Date(2000, 0, 1), new Date())),
        formed_to_invest: false,
        grantor_trust: Math.random() > 0.5,
        mailing_address: JSON.stringify(generateAddress())
      };

    case 'retirement':
      return {
        ...baseDetails,
        plan_type: randomChoice(['traditional_ira', 'roth_ira', '401k', 'other'] as RetirementPlanType[]),
        tax_id: generateEIN(),
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
    id: new SQLUUIDValue(uuidv4()),
    parent_id: new SQLUUIDValue(parentId),
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
    created_by: new SQLUUIDValue(userId),
    updated_at: formatDate(new Date()),
    updated_by: new SQLUUIDValue(userId)
  };
}

// Main function to generate test data
export async function generateTestData(numAccounts: number = 3): Promise<string> {
  const sqlStatements: string[] = [];
  
  // Start transaction and disable ALL triggers
  sqlStatements.push(`BEGIN;

-- Disable ALL triggers first
ALTER TABLE user_profiles DISABLE TRIGGER ALL;
ALTER TABLE gp_roles DISABLE TRIGGER ALL;
ALTER TABLE accounts DISABLE TRIGGER ALL;
ALTER TABLE individual_details DISABLE TRIGGER ALL;
ALTER TABLE entity_details DISABLE TRIGGER ALL;
ALTER TABLE trust_details DISABLE TRIGGER ALL;
ALTER TABLE retirement_details DISABLE TRIGGER ALL;
ALTER TABLE investments DISABLE TRIGGER ALL;
ALTER TABLE beneficial_owners DISABLE TRIGGER ALL;
ALTER TABLE roles DISABLE TRIGGER ALL;
ALTER TABLE companies DISABLE TRIGGER ALL;`);

  // Create test GP user
  const adminUserId = uuidv4();
  sqlStatements.push(`
    -- Create admin user for test data
    INSERT INTO auth.users (id, email, raw_user_meta_data) 
    VALUES (
      '${adminUserId}'::uuid, 
      ${escapeSQL('admin@example.com')},
      '{"first_name":"Admin","last_name":"User"}'
    );

    INSERT INTO user_profiles (
      user_id, first_name, last_name, is_gp_user, is_lp_user,
      created_at, created_by, updated_at, updated_by
    )
    VALUES (
      '${adminUserId}'::uuid, ${escapeSQL('Admin')}, ${escapeSQL('User')},
      TRUE, FALSE,
      NOW(), '${adminUserId}'::uuid, NOW(), '${adminUserId}'::uuid
    );

    INSERT INTO gp_roles (
      id, user_id, role_type,
      created_at, created_by, updated_at, updated_by
    )
    VALUES (
      '${uuidv4()}'::uuid, '${adminUserId}'::uuid, ${escapeSQL('admin')},
      NOW(), '${adminUserId}'::uuid, NOW(), '${adminUserId}'::uuid
    );
  `);

  // Create test LP users
  for (let i = 0; i < numAccounts; i++) {
    const lpUserId = uuidv4();
    sqlStatements.push(`
      -- Create LP user ${i + 1}
      INSERT INTO auth.users (id, email, raw_user_meta_data)
      VALUES (
        '${lpUserId}'::uuid,
        ${escapeSQL(`lp${i + 1}@example.com`)},
        '{"first_name":"LP","last_name":"User ${i + 1}"}'
      );

      INSERT INTO user_profiles (
        user_id, first_name, last_name, is_gp_user, is_lp_user,
        created_at, created_by, updated_at, updated_by
      )
      VALUES (
        '${lpUserId}'::uuid, ${escapeSQL('LP')}, ${escapeSQL(`User ${i + 1}`)},
        FALSE, TRUE,
        NOW(), '${lpUserId}'::uuid, NOW(), '${lpUserId}'::uuid
      );
    `);
  }

  // Generate companies first
  const companies = Array(Math.ceil(numAccounts / 3)).fill(null).map(() => generateCompany(adminUserId));
  companies.forEach(company => {
    sqlStatements.push(`
      INSERT INTO companies (
        company_id, company_name, status, description, industry, 
        founded_date, website, created_at, created_by, updated_at, updated_by
      )
      VALUES (
        '${company.company_id.value}'::uuid,
        ${escapeSQL(company.company_name)},
        ${escapeSQL(company.status)},
        ${escapeSQL(company.description)},
        ${escapeSQL(company.industry)},
        ${escapeSQL(company.founded_date)},
        ${escapeSQL(company.website)},
        ${escapeSQL(company.created_at)},
        '${company.created_by.value}'::uuid,
        ${escapeSQL(company.updated_at)},
        '${company.updated_by.value}'::uuid
      );
    `);
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
    sqlStatements.push(`
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
        '${adminUserId}'::uuid,
        NOW(),
        '${adminUserId}'::uuid
      );
    `);

    // Create account details
    const details = generateAccountDetails(accountId, accountType, adminUserId);
    const tableName = `${accountType}_details`;
    const detailColumns = Object.keys(details);
    const detailValues = Object.values(details).map(v => 
      v instanceof SQLUUIDValue ? `'${v.value}'::uuid` : 
      v instanceof Date ? `'${v.toISOString()}'` : 
      escapeSQL(v)
    );
    sqlStatements.push(`
      INSERT INTO ${tableName} (${detailColumns.join(', ')})
      VALUES (${detailValues.join(', ')});
    `);

    // Generate 1-3 investments for each account
    const numInvestments = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numInvestments; j++) {
      const company = randomChoice(companies);
      const investment = generateInvestment(accountId, company.company_id.value, adminUserId);
      sqlStatements.push(`
        INSERT INTO investments (
          investment_id, account_id, company_id, investment_status, investment_type,
          initial_investment_date, total_committed_capital, total_called_capital,
          total_distributions, current_nav, last_valuation_date, investment_metrics,
          created_at, created_by, updated_at, updated_by
        )
        VALUES (
          '${investment.investment_id.value}'::uuid,
          '${investment.account_id.value}'::uuid,
          '${investment.company_id.value}'::uuid,
          ${escapeSQL(investment.investment_status)},
          ${escapeSQL(investment.investment_type)},
          ${escapeSQL(investment.initial_investment_date)},
          ${investment.total_committed_capital},
          ${investment.total_called_capital},
          ${investment.total_distributions},
          ${investment.current_nav},
          ${escapeSQL(investment.last_valuation_date)},
          ${escapeSQL(investment.investment_metrics)},
          '${investment.created_at}',
          '${investment.created_by.value}'::uuid,
          '${investment.updated_at}',
          '${investment.updated_by.value}'::uuid
        );
      `);
    }

    // Generate beneficial owners for entity and trust accounts
    if (accountType === 'entity' || accountType === 'trust') {
      const numOwners = Math.floor(Math.random() * 3) + 1;
      for (let k = 0; k < numOwners; k++) {
        const owner = generateBeneficialOwner(details.id.value, `${accountType}_details`, adminUserId);
        sqlStatements.push(`
          INSERT INTO beneficial_owners (
            id, parent_id, parent_type, owner_type, name, tax_id,
            ownership_percent, relationship_type, control_person, citizenship,
            mailing_address, employment_info,
            created_at, created_by, updated_at, updated_by
          )
          VALUES (
            '${owner.id.value}'::uuid,
            '${owner.parent_id.value}'::uuid,
            ${escapeSQL(owner.parent_type)},
            ${escapeSQL(owner.owner_type)},
            ${escapeSQL(owner.name)},
            ${escapeSQL(owner.tax_id)},
            ${owner.ownership_percent},
            ${escapeSQL(owner.relationship_type)},
            ${owner.control_person},
            ${escapeSQL(owner.citizenship)},
            ${escapeSQL(owner.mailing_address)},
            ${escapeSQL(owner.employment_info)},
            '${owner.created_at}',
            '${owner.created_by.value}'::uuid,
            '${owner.updated_at}',
            '${owner.updated_by.value}'::uuid
          );
        `);
      }
    }

    // Create roles for the account
    const roles: RoleType[] = ['signer', 'admin', 'editor', 'viewer'];
    roles.forEach(roleType => {
      if (Math.random() > 0.5) {
        sqlStatements.push(`
          INSERT INTO roles (
            id, account_id, user_id, role_type, can_remove_self,
            created_at, created_by, updated_at, updated_by
          )
          VALUES (
            '${uuidv4()}'::uuid,
            '${accountId}'::uuid,
            '${adminUserId}'::uuid,
            ${escapeSQL(roleType)},
            ${roleType !== 'signer'},
            NOW(),
            '${adminUserId}'::uuid,
            NOW(),
            '${adminUserId}'::uuid
          );
        `);
      }
    });
  }

  // Add re-enable triggers and commit
  sqlStatements.push(`-- Re-enable triggers
ALTER TABLE user_profiles ENABLE TRIGGER ALL;
ALTER TABLE gp_roles ENABLE TRIGGER ALL;
ALTER TABLE accounts ENABLE TRIGGER ALL;
ALTER TABLE individual_details ENABLE TRIGGER ALL;
ALTER TABLE entity_details ENABLE TRIGGER ALL;
ALTER TABLE trust_details ENABLE TRIGGER ALL;
ALTER TABLE retirement_details ENABLE TRIGGER ALL;
ALTER TABLE investments ENABLE TRIGGER ALL;
ALTER TABLE beneficial_owners ENABLE TRIGGER ALL;
ALTER TABLE roles ENABLE TRIGGER ALL;
ALTER TABLE companies ENABLE TRIGGER ALL;

COMMIT;`);
  
  return sqlStatements.join('\n\n') + '\n\n';
}
