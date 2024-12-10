# Account Table Fields and Relationships

## Relationships
documents (one-to-many): pulls in AML docs, tax forms, banking docs, accreditation docs  
roles (one-to-many): team member associations  
created_by/updated_by (many-to-one to users)

## General Tab
id (UUID, PK)  
account_number (string)  
legal_name (string)  
account_type (string: personal/entity/retirement/special_other)  
account_subtype (string)  // Dynamic dropdown based on account_type. For 'personal': options are 'individual' or 'joint'. For 'entity': options are 'LLC', 'trust', 'partnership', 'corporation', etc. For 'retirement': options are 'IRA', '401k'. Controlled by UX logic to ensure valid subtype selection for each account type.
tax_id (string)  // EIN/SSN/ITIN. Controlled by UX logic to ensure valid tax ID format for each account type.

personal_details (jsonb)  
```json
{
  "owners": [
    {
      "name": "string",
      "ownership_percentage": "number?"  // Required for joint accounts
    }
  ]
}
```

retirement_details (jsonb)  
```json
{
  "custodian_name": "string",
  "plan_name": "string?"  // Applicable for 401k only
}
```


entity_details (jsonb)  
```json
{
  "formation_date": "date",
  "formation_state": "string",
  "formation_country": "string",
  "fiscal_year_end": "date",
  "is_privately_held": "boolean",
  "is_foreign": "boolean",
  "entity_specific_info": {
    "trust": {
      "trust_type": "string", // options: revocable/irrevocable
      "grantor_status": "string", // options: grantor trust/non-grantor trust
      "beneficiary": "string" //
    },
    "corporation": {
      "corp_type": "string"  // options: C-Corp/S-Corp
    },
    "llc": {
      "type": "string",  // options: Single Member, Multi-Member
      "tax_status": "string"  // options: Disregarded, partnership, corporation
    },
    "partnership": {
      "partnership_type": "string",  // options: LP/LLP/GP
      "tax_status": "string"  // options: partnership, corporation
    },
    "non_profit": {
      "tax_exempt_status": "string"  // options: exempt, non-exempt
    }
  }
}
```
status (string: pending/active/closed)  
address (jsonb)  
```json
{
  "street": "string",
  "suite": "string?",
  "city": "string",
  "state": "string",
  "postal_code": "string",
  "country": "string"
}
```
UI Note: When a user selects an account_type, the UI should dynamically update the account_subtype dropdown to only display relevant options. For example, if personal: show individual/joint. If entity: show corporation/llc/trust, etc. If retirement: show ira/401k. If special_other: show custom options.

## Accreditation Tab
qualifications (jsonb)  
```json
{
  "accredited_investor": "boolean",
  "qualified_client": "boolean",
  "qualified_purchaser": "boolean",
  "qualification_notes": "string?", // additional notes about qualifications, such as investment company act matters, etc.
  "verification_date": "timestamp",
  "verification_notes": "string?"
}
```

## Compliance Tab
compliance_info (jsonb)  
```json
{
  "us_person": "boolean",
  "fatca_status": "boolean",
  "common_control": "boolean",
  "tax_residency_country": "string"
}
```
erisa_info (jsonb)  
```json
{
  "subject_to_erisa": "boolean",
  "benefit_plan_investor": "boolean",
  "percentage": "number?",
  "fiduciary_name": "string?"
}
```
beneficial_ownership (jsonb)  
```json
{
  "has_qualifying_owners": "boolean",  // Does any person/entity own 25% or more?
  "individual_owners": [
    {
      "individual_name": "string", // Required
      "address": "string", // Required
      "citizenship": "string", // Required
      "employer_name": "string?",  // Required only for private entity
      "percentage": "number?", // Required: ownership or beneficiary percentage
      "status": "string?"  // Required for trust: Beneficiary/Settlor/Trustee
    }
  ],
  "entity_owners": [
    {
      "entity_name": "string", // Required
      "principal_place_of_business": "string", // Required
      "address": "string?",  // Required
      "percentage": "number?", // Required: ownership or beneficiary percentage
      "status": "string?"  // Required for trust: Beneficiary/Settlor/Trustee
    }
  ]
}
```

## Banking Tab
banking_info (jsonb)  
```json
{
  "bank_name": "string",
  "account_name": "string",
  "account_number": "string",
  "routing_number": "string",
  "swift_code": "string?",
  "additional_instructions": "string?",
  "primary": boolean
}
```

## System Fields
created_at (timestamp)  
updated_at (timestamp)  
created_by (uuid, FK)  
updated_by (uuid, FK)

## UI Notes
Each tab pulls relevant documents from the documents table based on document_type. Compliance: AML docs, W-8/W-9. Banking: Voided checks, wire instructions. Accreditation: Verification forms. Documents: All documents for account.

## Account Descriptions

### Subtypes

**Personal**
- **Single Individual:** A straightforward individual. Requires standard KYC (name, DOB, SSN/TIN, address).
- **Joint Account:** Two or more individuals sharing ownership. Requires:
  - KYC for all owners.
  - Ownership percentages.
  - Signatures from all joint owners.

**Entity**
- Corporation (C-Corp, S-Corp): U.S. or foreign, requires EIN, formation documents.
- LLC: Single or multi-member, formation docs, possible beneficial ownership disclosure.
- Partnership (LP, LLP, GP): Partnership agreement, list of partners and their ownership percentages.
- Trust (Revocable, Irrevocable): Trust agreements, trustee details, beneficiaries.
- Non-Profit/Charitable Entity: Tax-exempt determination letter, principal officers.
- Estate: Court appointment letters, executor identification.
- Other Entity Types: For unusual structures like foundations, family offices, etc., can default to an "Other Entity" subtype with a free-text field.

**Retirement**
- **IRA:** Individual Retirement Account. Requires:
  - Custodian name and EIN.
  - Owner details (name, DOB, SSN/TIN).
  - Confirmation of no prohibited transactions.
- **401(k):** Employer-sponsored retirement plan. Requires:
  - Custodian/employer name and EIN.
  - Plan name (if applicable).

**Special/Other**
- ERISA Plans
- Financial Institutions (Banks, Broker-Dealers, Investment Companies)
- Government / Sovereign Entities
- Other: Can default to a "Other" subtype with a free-text field.
