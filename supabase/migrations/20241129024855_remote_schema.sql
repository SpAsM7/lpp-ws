

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






CREATE EXTENSION IF NOT EXISTS "plv8" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."accounts" (
    "account_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "account_name" character varying(255) NOT NULL,
    "account_type" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "kyc_status" "text" DEFAULT 'not_started'::"text" NOT NULL,
    "accreditation_status" "text" DEFAULT 'pending_verification'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "accounts_account_type_check" CHECK (("account_type" = ANY (ARRAY['individual'::"text", 'entity'::"text", 'trust'::"text", 'retirement'::"text"]))),
    CONSTRAINT "accounts_accreditation_status_check" CHECK (("accreditation_status" = ANY (ARRAY['accredited'::"text", 'not_accredited'::"text", 'pending_verification'::"text"]))),
    CONSTRAINT "accounts_kyc_status_check" CHECK (("kyc_status" = ANY (ARRAY['not_started'::"text", 'in_progress'::"text", 'completed'::"text", 'expired'::"text"]))),
    CONSTRAINT "accounts_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'active'::"text", 'suspended'::"text", 'closed'::"text"])))
);


ALTER TABLE "public"."accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."accreditation" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "qualification_type" "text" NOT NULL,
    "qualification_details" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "verified_at" timestamp with time zone,
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "accreditation_qualification_type_check" CHECK (("qualification_type" = ANY (ARRAY['income'::"text", 'net_worth'::"text", 'professional'::"text", 'entity'::"text"])))
);


ALTER TABLE "public"."accreditation" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."activities" (
    "activity_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "activity_type" "text" NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "entity_type" "text" NOT NULL,
    "entity_id" "uuid" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "importance" "text" NOT NULL,
    "read_status" "jsonb" DEFAULT '{"read_by": {}}'::"jsonb",
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "activities_activity_type_check" CHECK (("activity_type" = ANY (ARRAY['document'::"text", 'investment'::"text", 'company'::"text", 'account'::"text", 'administrative'::"text"]))),
    CONSTRAINT "activities_entity_type_check" CHECK (("entity_type" = ANY (ARRAY['company'::"text", 'investment'::"text", 'account'::"text", 'file'::"text"]))),
    CONSTRAINT "activities_importance_check" CHECK (("importance" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text"])))
);


ALTER TABLE "public"."activities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."aml_verification" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "verification_type" "text" NOT NULL,
    "verification_details" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "pep_status" boolean DEFAULT false NOT NULL,
    "sanctions_check" boolean DEFAULT false NOT NULL,
    "verified_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "aml_verification_type_check" CHECK (("verification_type" = ANY (ARRAY['manual'::"text", 'automated'::"text", 'third_party'::"text"])))
);


ALTER TABLE "public"."aml_verification" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bank_info" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "bank_name" character varying(255) NOT NULL,
    "account_name" character varying(255) NOT NULL,
    "account_number" character varying(255) NOT NULL,
    "routing_number" character varying(50) NOT NULL,
    "swift_code" character varying(50),
    "bank_address" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "bank_country" character varying(100) NOT NULL,
    "primary_account" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid"
);


ALTER TABLE "public"."bank_info" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."beneficial_owners" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "parent_id" "uuid" NOT NULL,
    "parent_type" "text" NOT NULL,
    "owner_type" "text" NOT NULL,
    "name" character varying(255) NOT NULL,
    "ownership_percent" numeric(5,2) NOT NULL,
    "relationship_type" "text" NOT NULL,
    "control_person" boolean DEFAULT false NOT NULL,
    "tax_id" character varying(50) NOT NULL,
    "citizenship" character varying(100) NOT NULL,
    "employment_info" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "beneficial_owners_owner_type_check" CHECK (("owner_type" = ANY (ARRAY['individual'::"text", 'entity'::"text"]))),
    CONSTRAINT "beneficial_owners_ownership_percent_check" CHECK ((("ownership_percent" >= (0)::numeric) AND ("ownership_percent" <= (100)::numeric))),
    CONSTRAINT "beneficial_owners_parent_type_check" CHECK (("parent_type" = ANY (ARRAY['entity_details'::"text", 'trust_details'::"text", 'retirement_details'::"text"]))),
    CONSTRAINT "beneficial_owners_relationship_type_check" CHECK (("relationship_type" = ANY (ARRAY['shareholder'::"text", 'partner'::"text", 'member'::"text", 'trustee'::"text", 'beneficiary'::"text"])))
);


ALTER TABLE "public"."beneficial_owners" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."companies" (
    "company_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "company_name" character varying(255) NOT NULL,
    "status" "text" NOT NULL,
    "description" "text",
    "industry" "text" NOT NULL,
    "founded_date" "date",
    "website" character varying(255),
    "logo_url" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "companies_industry_check" CHECK (("industry" = ANY (ARRAY['technology'::"text", 'healthcare'::"text", 'finance'::"text", 'real_estate'::"text", 'consumer'::"text", 'industrial'::"text"]))),
    CONSTRAINT "companies_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'pending'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."companies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contact_designations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "role_id" "uuid" NOT NULL,
    "designation_type" "text" NOT NULL,
    "contact_preferences" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "contact_designations_type_check" CHECK (("designation_type" = ANY (ARRAY['primary'::"text", 'tax'::"text", 'legal'::"text", 'operations'::"text"])))
);


ALTER TABLE "public"."contact_designations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."entity_details" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "entity_type" "text" NOT NULL,
    "tax_id" character varying(50) NOT NULL,
    "jurisdiction" character varying(100) NOT NULL,
    "formation_date" "date" NOT NULL,
    "us_person" boolean NOT NULL,
    "tax_year_end" character varying(10),
    "tax_exempt" boolean DEFAULT false NOT NULL,
    "investment_company_status" boolean DEFAULT false NOT NULL,
    "bank_entity_status" boolean DEFAULT false NOT NULL,
    "formed_to_invest" boolean DEFAULT false NOT NULL,
    "public_reporting_entity" boolean DEFAULT false NOT NULL,
    "fatf_jurisdiction" boolean DEFAULT true NOT NULL,
    "mailing_address" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "principal_place_business" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "entity_details_entity_type_check" CHECK (("entity_type" = ANY (ARRAY['corporation'::"text", 'partnership'::"text", 'llc'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."entity_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."erisa_status" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "parent_id" "uuid" NOT NULL,
    "parent_type" "text" NOT NULL,
    "subject_to_erisa" boolean DEFAULT false NOT NULL,
    "benefit_plan_percentage" numeric(5,2),
    "fiduciary_name" character varying(255),
    "governmental_plan" boolean DEFAULT false NOT NULL,
    "church_plan" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "erisa_status_benefit_plan_percentage_check" CHECK ((("benefit_plan_percentage" IS NULL) OR (("benefit_plan_percentage" >= (0)::numeric) AND ("benefit_plan_percentage" <= (100)::numeric)))),
    CONSTRAINT "erisa_status_parent_type_check" CHECK (("parent_type" = ANY (ARRAY['entity_details'::"text", 'retirement_details'::"text"])))
);


ALTER TABLE "public"."erisa_status" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."file_access_logs" (
    "log_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "file_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "access_type" "text" NOT NULL,
    "access_timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "file_access_logs_access_type_check" CHECK (("access_type" = ANY (ARRAY['view'::"text", 'download'::"text"])))
);


ALTER TABLE "public"."file_access_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."files" (
    "file_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "file_name" character varying(255) NOT NULL,
    "file_type" "text" NOT NULL,
    "storage_path" character varying(255) NOT NULL,
    "company_id" "uuid",
    "investment_id" "uuid",
    "account_id" "uuid",
    "visibility_scope" "text" NOT NULL,
    "modification_access" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "files_file_type_check" CHECK (("file_type" = ANY (ARRAY['k1'::"text", 'tax_document'::"text", 'report'::"text", 'statement'::"text", 'legal'::"text", 'correspondence'::"text"]))),
    CONSTRAINT "files_modification_access_check" CHECK (("modification_access" = ANY (ARRAY['gp_only'::"text", 'lp_full'::"text", 'read_only'::"text"]))),
    CONSTRAINT "files_visibility_scope_check" CHECK (("visibility_scope" = ANY (ARRAY['company_wide'::"text", 'investment_specific'::"text", 'account_specific'::"text"])))
);


ALTER TABLE "public"."files" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."gp_roles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "gp_roles_role_type_check" CHECK (("role_type" = ANY (ARRAY['admin'::"text", 'editor'::"text", 'viewer'::"text"])))
);


ALTER TABLE "public"."gp_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."individual_details" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "tax_id_type" "text" NOT NULL,
    "tax_id" character varying(50) NOT NULL,
    "us_person" boolean NOT NULL,
    "tax_year_end" character varying(10),
    "joint_account" boolean DEFAULT false NOT NULL,
    "joint_holder_info" "jsonb" DEFAULT '{}'::"jsonb",
    "professional_title" character varying(255),
    "employer" character varying(255),
    "acting_as_nominee" boolean DEFAULT false NOT NULL,
    "mailing_address" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "individual_details_tax_id_type_check" CHECK (("tax_id_type" = ANY (ARRAY['ssn'::"text", 'itin'::"text", 'foreign'::"text"])))
);


ALTER TABLE "public"."individual_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."investments" (
    "investment_id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "company_id" "uuid" NOT NULL,
    "investment_status" "text" NOT NULL,
    "investment_type" "text" NOT NULL,
    "initial_investment_date" "date" NOT NULL,
    "total_committed_capital" bigint NOT NULL,
    "total_called_capital" bigint NOT NULL,
    "total_distributions" bigint NOT NULL,
    "current_nav" bigint NOT NULL,
    "last_valuation_date" timestamp with time zone,
    "investment_metrics" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "investments_called_capital_check" CHECK (("total_called_capital" >= 0)),
    CONSTRAINT "investments_committed_capital_check" CHECK (("total_committed_capital" >= 0)),
    CONSTRAINT "investments_distributions_check" CHECK (("total_distributions" >= 0)),
    CONSTRAINT "investments_investment_status_check" CHECK (("investment_status" = ANY (ARRAY['active'::"text", 'pending'::"text", 'fully_exited'::"text", 'partially_exited'::"text"]))),
    CONSTRAINT "investments_investment_type_check" CHECK (("investment_type" = ANY (ARRAY['direct'::"text", 'fund'::"text", 'spv'::"text"]))),
    CONSTRAINT "investments_nav_check" CHECK (("current_nav" >= 0))
);


ALTER TABLE "public"."investments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."retirement_details" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "plan_type" "text" NOT NULL,
    "tax_id" character varying(50) NOT NULL,
    "tax_year_end" character varying(10),
    "self_directed" boolean DEFAULT false NOT NULL,
    "custodian_info" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "mailing_address" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "retirement_details_plan_type_check" CHECK (("plan_type" = ANY (ARRAY['traditional_ira'::"text", 'roth_ira'::"text", '401k'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."retirement_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role_type" "text" NOT NULL,
    "can_remove_self" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "roles_role_type_check" CHECK (("role_type" = ANY (ARRAY['signer'::"text", 'admin'::"text", 'editor'::"text", 'viewer'::"text"])))
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trust_details" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "account_id" "uuid" NOT NULL,
    "trust_type" "text" NOT NULL,
    "tax_id" character varying(50) NOT NULL,
    "us_person" boolean NOT NULL,
    "tax_year_end" character varying(10),
    "revocable" boolean NOT NULL,
    "formation_date" "date" NOT NULL,
    "formed_to_invest" boolean DEFAULT false NOT NULL,
    "grantor_trust" boolean DEFAULT false NOT NULL,
    "mailing_address" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    CONSTRAINT "trust_details_trust_type_check" CHECK (("trust_type" = ANY (ARRAY['living'::"text", 'testamentary'::"text", 'charitable'::"text", 'business'::"text"])))
);


ALTER TABLE "public"."trust_details" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "user_id" "uuid" NOT NULL,
    "first_name" character varying(255) NOT NULL,
    "last_name" character varying(255) NOT NULL,
    "phone" character varying(50),
    "professional_title" character varying(255),
    "company_name" character varying(255),
    "linkedin_url" character varying(255),
    "profile_image_url" character varying(255),
    "timezone" character varying(100),
    "is_gp_user" boolean DEFAULT false NOT NULL,
    "is_lp_user" boolean DEFAULT false NOT NULL,
    "communication_preferences" "jsonb" DEFAULT '{"email_notifications": {"all": true, "newsletters": true, "announcements": true, "tax_documents": true, "account_updates": true}}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_by" "uuid" NOT NULL,
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid"
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id");



ALTER TABLE ONLY "public"."accreditation"
    ADD CONSTRAINT "accreditation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_pkey" PRIMARY KEY ("activity_id");



ALTER TABLE ONLY "public"."aml_verification"
    ADD CONSTRAINT "aml_verification_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bank_info"
    ADD CONSTRAINT "bank_info_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."beneficial_owners"
    ADD CONSTRAINT "beneficial_owners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("company_id");



ALTER TABLE ONLY "public"."contact_designations"
    ADD CONSTRAINT "contact_designations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."entity_details"
    ADD CONSTRAINT "entity_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."erisa_status"
    ADD CONSTRAINT "erisa_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."file_access_logs"
    ADD CONSTRAINT "file_access_logs_pkey" PRIMARY KEY ("log_id");



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_pkey" PRIMARY KEY ("file_id");



ALTER TABLE ONLY "public"."gp_roles"
    ADD CONSTRAINT "gp_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."gp_roles"
    ADD CONSTRAINT "gp_roles_user_unique" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."individual_details"
    ADD CONSTRAINT "individual_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."investments"
    ADD CONSTRAINT "investments_pkey" PRIMARY KEY ("investment_id");



ALTER TABLE ONLY "public"."retirement_details"
    ADD CONSTRAINT "retirement_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_user_account_unique" UNIQUE ("user_id", "account_id");



ALTER TABLE ONLY "public"."trust_details"
    ADD CONSTRAINT "trust_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id");



CREATE INDEX "idx_accounts_name_trgm" ON "public"."accounts" USING "gin" ("account_name" "public"."gin_trgm_ops");



CREATE INDEX "idx_accounts_status" ON "public"."accounts" USING "btree" ("status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_accounts_type" ON "public"."accounts" USING "btree" ("account_type") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_accreditation_account" ON "public"."accreditation" USING "btree" ("account_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_accreditation_details" ON "public"."accreditation" USING "gin" ("qualification_details");



CREATE INDEX "idx_accreditation_expiry" ON "public"."accreditation" USING "btree" ("expires_at") WHERE (("deleted_at" IS NULL) AND ("expires_at" IS NOT NULL));



CREATE INDEX "idx_accreditation_type" ON "public"."accreditation" USING "btree" ("qualification_type") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_activities_entity" ON "public"."activities" USING "btree" ("entity_type", "entity_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_activities_metadata" ON "public"."activities" USING "gin" ("metadata");



CREATE INDEX "idx_activities_read_status" ON "public"."activities" USING "gin" ("read_status");



CREATE INDEX "idx_activities_type" ON "public"."activities" USING "btree" ("activity_type") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_activities_user" ON "public"."activities" USING "btree" ("user_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_aml_verification_account" ON "public"."aml_verification" USING "btree" ("account_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_aml_verification_details" ON "public"."aml_verification" USING "gin" ("verification_details");



CREATE INDEX "idx_aml_verification_pep" ON "public"."aml_verification" USING "btree" ("pep_status") WHERE (("deleted_at" IS NULL) AND ("pep_status" = true));



CREATE INDEX "idx_aml_verification_type" ON "public"."aml_verification" USING "btree" ("verification_type") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_bank_info_account" ON "public"."bank_info" USING "btree" ("account_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_bank_info_address" ON "public"."bank_info" USING "gin" ("bank_address" "jsonb_path_ops");



CREATE INDEX "idx_bank_info_primary" ON "public"."bank_info" USING "btree" ("account_id", "primary_account") WHERE (("deleted_at" IS NULL) AND ("primary_account" = true));



CREATE INDEX "idx_beneficial_owners_employment" ON "public"."beneficial_owners" USING "gin" ("employment_info");



CREATE INDEX "idx_beneficial_owners_name_trgm" ON "public"."beneficial_owners" USING "gin" ("name" "public"."gin_trgm_ops");



CREATE INDEX "idx_beneficial_owners_parent" ON "public"."beneficial_owners" USING "btree" ("parent_id", "parent_type") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_beneficial_owners_tax_id" ON "public"."beneficial_owners" USING "btree" ("tax_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_companies_name_trgm" ON "public"."companies" USING "gin" ("company_name" "public"."gin_trgm_ops");



CREATE INDEX "idx_companies_status" ON "public"."companies" USING "btree" ("status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_contact_designations_preferences" ON "public"."contact_designations" USING "gin" ("contact_preferences" "jsonb_path_ops");



CREATE INDEX "idx_contact_designations_role" ON "public"."contact_designations" USING "btree" ("role_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_contact_designations_type" ON "public"."contact_designations" USING "btree" ("role_id", "designation_type") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_entity_details_account" ON "public"."entity_details" USING "btree" ("account_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_entity_details_address" ON "public"."entity_details" USING "gin" ("mailing_address" "jsonb_path_ops");



CREATE INDEX "idx_entity_details_business" ON "public"."entity_details" USING "gin" ("principal_place_business" "jsonb_path_ops");



CREATE INDEX "idx_entity_details_tax_id" ON "public"."entity_details" USING "btree" ("tax_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_erisa_status_parent" ON "public"."erisa_status" USING "btree" ("parent_id", "parent_type") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_erisa_status_subject" ON "public"."erisa_status" USING "btree" ("subject_to_erisa") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_file_access_logs_file_id" ON "public"."file_access_logs" USING "btree" ("file_id");



CREATE INDEX "idx_file_access_logs_user_id" ON "public"."file_access_logs" USING "btree" ("user_id");



CREATE INDEX "idx_files_name_trgm" ON "public"."files" USING "gin" ("file_name" "public"."gin_trgm_ops");



CREATE INDEX "idx_files_relationship_ids" ON "public"."files" USING "btree" ("company_id", "investment_id", "account_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_files_type" ON "public"."files" USING "btree" ("file_type") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_gp_roles_type" ON "public"."gp_roles" USING "btree" ("role_type") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_gp_roles_user" ON "public"."gp_roles" USING "btree" ("user_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_individual_details_account" ON "public"."individual_details" USING "btree" ("account_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_individual_details_address" ON "public"."individual_details" USING "gin" ("mailing_address" "jsonb_path_ops");



CREATE INDEX "idx_individual_details_tax_id" ON "public"."individual_details" USING "btree" ("tax_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_investments_account_id" ON "public"."investments" USING "btree" ("account_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_investments_company_id" ON "public"."investments" USING "btree" ("company_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_investments_metrics" ON "public"."investments" USING "gin" ("investment_metrics");



CREATE INDEX "idx_investments_status" ON "public"."investments" USING "btree" ("investment_status") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_retirement_details_account" ON "public"."retirement_details" USING "btree" ("account_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_retirement_details_address" ON "public"."retirement_details" USING "gin" ("mailing_address" "jsonb_path_ops");



CREATE INDEX "idx_retirement_details_custodian" ON "public"."retirement_details" USING "gin" ("custodian_info" "jsonb_path_ops");



CREATE INDEX "idx_retirement_details_tax_id" ON "public"."retirement_details" USING "btree" ("tax_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_roles_account" ON "public"."roles" USING "btree" ("account_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_roles_user" ON "public"."roles" USING "btree" ("user_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_trust_details_account" ON "public"."trust_details" USING "btree" ("account_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_trust_details_address" ON "public"."trust_details" USING "gin" ("mailing_address" "jsonb_path_ops");



CREATE INDEX "idx_trust_details_tax_id" ON "public"."trust_details" USING "btree" ("tax_id") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_user_profiles_deleted" ON "public"."user_profiles" USING "btree" ("deleted_at") WHERE ("deleted_at" IS NOT NULL);



CREATE INDEX "idx_user_profiles_gp" ON "public"."user_profiles" USING "btree" ("user_id") WHERE ("is_gp_user" = true);



CREATE INDEX "idx_user_profiles_lp" ON "public"."user_profiles" USING "btree" ("user_id") WHERE ("is_lp_user" = true);



CREATE OR REPLACE TRIGGER "update_accounts_updated_at" BEFORE UPDATE ON "public"."accounts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_accreditation_updated_at" BEFORE UPDATE ON "public"."accreditation" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_activities_updated_at" BEFORE UPDATE ON "public"."activities" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_aml_verification_updated_at" BEFORE UPDATE ON "public"."aml_verification" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_bank_info_updated_at" BEFORE UPDATE ON "public"."bank_info" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_beneficial_owners_updated_at" BEFORE UPDATE ON "public"."beneficial_owners" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_companies_updated_at" BEFORE UPDATE ON "public"."companies" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_contact_designations_updated_at" BEFORE UPDATE ON "public"."contact_designations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_entity_details_updated_at" BEFORE UPDATE ON "public"."entity_details" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_erisa_status_updated_at" BEFORE UPDATE ON "public"."erisa_status" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_files_updated_at" BEFORE UPDATE ON "public"."files" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_gp_roles_updated_at" BEFORE UPDATE ON "public"."gp_roles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_individual_details_updated_at" BEFORE UPDATE ON "public"."individual_details" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_investments_updated_at" BEFORE UPDATE ON "public"."investments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_retirement_details_updated_at" BEFORE UPDATE ON "public"."retirement_details" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_roles_updated_at" BEFORE UPDATE ON "public"."roles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_trust_details_updated_at" BEFORE UPDATE ON "public"."trust_details" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_user_profiles_updated_at" BEFORE UPDATE ON "public"."user_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."accreditation"
    ADD CONSTRAINT "accreditation_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id");



ALTER TABLE ONLY "public"."accreditation"
    ADD CONSTRAINT "accreditation_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."accreditation"
    ADD CONSTRAINT "accreditation_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."accreditation"
    ADD CONSTRAINT "accreditation_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."aml_verification"
    ADD CONSTRAINT "aml_verification_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id");



ALTER TABLE ONLY "public"."aml_verification"
    ADD CONSTRAINT "aml_verification_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."aml_verification"
    ADD CONSTRAINT "aml_verification_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."aml_verification"
    ADD CONSTRAINT "aml_verification_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."bank_info"
    ADD CONSTRAINT "bank_info_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id");



ALTER TABLE ONLY "public"."bank_info"
    ADD CONSTRAINT "bank_info_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."bank_info"
    ADD CONSTRAINT "bank_info_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."bank_info"
    ADD CONSTRAINT "bank_info_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."beneficial_owners"
    ADD CONSTRAINT "beneficial_owners_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."beneficial_owners"
    ADD CONSTRAINT "beneficial_owners_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."beneficial_owners"
    ADD CONSTRAINT "beneficial_owners_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."contact_designations"
    ADD CONSTRAINT "contact_designations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."contact_designations"
    ADD CONSTRAINT "contact_designations_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."contact_designations"
    ADD CONSTRAINT "contact_designations_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id");



ALTER TABLE ONLY "public"."contact_designations"
    ADD CONSTRAINT "contact_designations_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."entity_details"
    ADD CONSTRAINT "entity_details_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id");



ALTER TABLE ONLY "public"."entity_details"
    ADD CONSTRAINT "entity_details_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."entity_details"
    ADD CONSTRAINT "entity_details_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."entity_details"
    ADD CONSTRAINT "entity_details_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."erisa_status"
    ADD CONSTRAINT "erisa_status_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."erisa_status"
    ADD CONSTRAINT "erisa_status_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."erisa_status"
    ADD CONSTRAINT "erisa_status_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."file_access_logs"
    ADD CONSTRAINT "file_access_logs_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."files"("file_id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."file_access_logs"
    ADD CONSTRAINT "file_access_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("company_id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_investment_id_fkey" FOREIGN KEY ("investment_id") REFERENCES "public"."investments"("investment_id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."files"
    ADD CONSTRAINT "files_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "fk_roles_account" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id");



ALTER TABLE ONLY "public"."gp_roles"
    ADD CONSTRAINT "gp_roles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."gp_roles"
    ADD CONSTRAINT "gp_roles_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."gp_roles"
    ADD CONSTRAINT "gp_roles_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."gp_roles"
    ADD CONSTRAINT "gp_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."individual_details"
    ADD CONSTRAINT "individual_details_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id");



ALTER TABLE ONLY "public"."individual_details"
    ADD CONSTRAINT "individual_details_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."individual_details"
    ADD CONSTRAINT "individual_details_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."individual_details"
    ADD CONSTRAINT "individual_details_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."investments"
    ADD CONSTRAINT "investments_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."investments"
    ADD CONSTRAINT "investments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("company_id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."investments"
    ADD CONSTRAINT "investments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."investments"
    ADD CONSTRAINT "investments_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."investments"
    ADD CONSTRAINT "investments_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."retirement_details"
    ADD CONSTRAINT "retirement_details_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id");



ALTER TABLE ONLY "public"."retirement_details"
    ADD CONSTRAINT "retirement_details_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."retirement_details"
    ADD CONSTRAINT "retirement_details_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."retirement_details"
    ADD CONSTRAINT "retirement_details_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."trust_details"
    ADD CONSTRAINT "trust_details_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id");



ALTER TABLE ONLY "public"."trust_details"
    ADD CONSTRAINT "trust_details_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."trust_details"
    ADD CONSTRAINT "trust_details_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."trust_details"
    ADD CONSTRAINT "trust_details_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Account signers and admins can manage bank info" ON "public"."bank_info" USING (("auth"."uid"() IN ( SELECT "roles"."user_id"
   FROM "public"."roles"
  WHERE (("roles"."account_id" = "bank_info"."account_id") AND ("roles"."role_type" = ANY (ARRAY['signer'::"text", 'admin'::"text"])) AND ("roles"."deleted_at" IS NULL)))));



CREATE POLICY "Account team members can view AML verification" ON "public"."aml_verification" FOR SELECT USING (("auth"."uid"() IN ( SELECT "roles"."user_id"
   FROM "public"."roles"
  WHERE (("roles"."account_id" = "aml_verification"."account_id") AND ("roles"."deleted_at" IS NULL)))));



CREATE POLICY "Account team members can view accreditation" ON "public"."accreditation" FOR SELECT USING (("auth"."uid"() IN ( SELECT "roles"."user_id"
   FROM "public"."roles"
  WHERE (("roles"."account_id" = "accreditation"."account_id") AND ("roles"."deleted_at" IS NULL)))));



CREATE POLICY "Account team members can view bank info" ON "public"."bank_info" FOR SELECT USING (("auth"."uid"() IN ( SELECT "roles"."user_id"
   FROM "public"."roles"
  WHERE (("roles"."account_id" = "bank_info"."account_id") AND ("roles"."deleted_at" IS NULL)))));



CREATE POLICY "Account-specific document access" ON "public"."files" FOR SELECT USING ((("visibility_scope" = 'account_specific'::"text") AND ("auth"."uid"() IN ( SELECT "roles"."user_id"
   FROM "public"."roles"
  WHERE (("roles"."account_id" = "files"."account_id") AND ("roles"."deleted_at" IS NULL))))));



CREATE POLICY "Company-wide document access" ON "public"."files" FOR SELECT USING ((("visibility_scope" = 'company_wide'::"text") AND ("auth"."uid"() IN ( SELECT "r"."user_id"
   FROM ("public"."roles" "r"
     JOIN "public"."investments" "i" ON (("r"."account_id" = "i"."account_id")))
  WHERE (("i"."company_id" = "files"."company_id") AND ("r"."deleted_at" IS NULL))))));



CREATE POLICY "GP admins can manage GP roles" ON "public"."gp_roles" USING (("auth"."uid"() IN ( SELECT "gp_roles_1"."user_id"
   FROM "public"."gp_roles" "gp_roles_1"
  WHERE (("gp_roles_1"."role_type" = 'admin'::"text") AND ("gp_roles_1"."deleted_at" IS NULL)))));



CREATE POLICY "GP admins can view all profiles" ON "public"."user_profiles" FOR SELECT USING (("auth"."uid"() IN ( SELECT "user_profiles_1"."user_id"
   FROM "public"."user_profiles" "user_profiles_1"
  WHERE (("user_profiles_1"."is_gp_user" = true) AND ("user_profiles_1"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can manage all AML verification" ON "public"."aml_verification" USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can manage all ERISA status" ON "public"."erisa_status" USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can manage all accreditation" ON "public"."accreditation" USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can manage all beneficial owners" ON "public"."beneficial_owners" USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can manage all contact designations" ON "public"."contact_designations" USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can manage all files" ON "public"."files" USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can manage all investments" ON "public"."investments" USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can manage companies" ON "public"."companies" USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can view all access logs" ON "public"."file_access_logs" FOR SELECT USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can view all accounts" ON "public"."accounts" FOR SELECT USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can view all activities" ON "public"."activities" FOR SELECT USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can view all bank info" ON "public"."bank_info" FOR SELECT USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can view all entity details" ON "public"."entity_details" FOR SELECT USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can view all individual details" ON "public"."individual_details" FOR SELECT USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can view all retirement details" ON "public"."retirement_details" FOR SELECT USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "GP users can view all trust details" ON "public"."trust_details" FOR SELECT USING (("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_gp_user" = true) AND ("user_profiles"."deleted_at" IS NULL)))));



CREATE POLICY "Investment-specific document access" ON "public"."files" FOR SELECT USING ((("visibility_scope" = 'investment_specific'::"text") AND ("auth"."uid"() IN ( SELECT "roles"."user_id"
   FROM "public"."roles"
  WHERE (("roles"."account_id" IN ( SELECT "investments"."account_id"
           FROM "public"."investments"
          WHERE ("investments"."investment_id" = "files"."investment_id"))) AND ("roles"."deleted_at" IS NULL))))));



CREATE POLICY "LP users can view active companies" ON "public"."companies" FOR SELECT USING ((("status" = 'active'::"text") AND ("deleted_at" IS NULL) AND ("auth"."uid"() IN ( SELECT "user_profiles"."user_id"
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."is_lp_user" = true) AND ("user_profiles"."deleted_at" IS NULL))))));



CREATE POLICY "Users can update their own profile" ON "public"."user_profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view ERISA status for their accounts" ON "public"."erisa_status" FOR SELECT USING (("auth"."uid"() IN ( SELECT "r"."user_id"
   FROM ("public"."roles" "r"
     JOIN "public"."entity_details" "e" ON (("e"."account_id" = "r"."account_id")))
  WHERE (("e"."id" = "erisa_status"."parent_id") AND ("r"."deleted_at" IS NULL))
UNION
 SELECT "r"."user_id"
   FROM ("public"."roles" "r"
     JOIN "public"."retirement_details" "rd" ON (("rd"."account_id" = "r"."account_id")))
  WHERE (("rd"."id" = "erisa_status"."parent_id") AND ("r"."deleted_at" IS NULL)))));



CREATE POLICY "Users can view accounts they have roles in" ON "public"."accounts" FOR SELECT USING (("auth"."uid"() IN ( SELECT "roles"."user_id"
   FROM "public"."roles"
  WHERE (("roles"."account_id" = "accounts"."account_id") AND ("roles"."deleted_at" IS NULL)))));



CREATE POLICY "Users can view activities for their accounts" ON "public"."activities" FOR SELECT USING (
CASE
    WHEN ("entity_type" = 'account'::"text") THEN ("auth"."uid"() IN ( SELECT "roles"."user_id"
       FROM "public"."roles"
      WHERE (("roles"."account_id" = "activities"."entity_id") AND ("roles"."deleted_at" IS NULL))))
    WHEN ("entity_type" = 'investment'::"text") THEN ("auth"."uid"() IN ( SELECT "r"."user_id"
       FROM ("public"."roles" "r"
         JOIN "public"."investments" "i" ON (("r"."account_id" = "i"."account_id")))
      WHERE (("i"."investment_id" = "activities"."entity_id") AND ("r"."deleted_at" IS NULL))))
    WHEN ("entity_type" = 'company'::"text") THEN ("auth"."uid"() IN ( SELECT "r"."user_id"
       FROM ("public"."roles" "r"
         JOIN "public"."investments" "i" ON (("r"."account_id" = "i"."account_id")))
      WHERE (("i"."company_id" = "activities"."entity_id") AND ("r"."deleted_at" IS NULL))))
    WHEN ("entity_type" = 'file'::"text") THEN ("auth"."uid"() IN ( SELECT "r"."user_id"
       FROM ("public"."roles" "r"
         JOIN "public"."files" "f" ON (("r"."account_id" = "f"."account_id")))
      WHERE (("f"."file_id" = "activities"."entity_id") AND ("r"."deleted_at" IS NULL))))
    ELSE false
END);



CREATE POLICY "Users can view beneficial owners for their accounts" ON "public"."beneficial_owners" FOR SELECT USING (("auth"."uid"() IN ( SELECT "r"."user_id"
   FROM ("public"."roles" "r"
     JOIN "public"."entity_details" "e" ON (("e"."account_id" = "r"."account_id")))
  WHERE (("e"."id" = "beneficial_owners"."parent_id") AND ("r"."deleted_at" IS NULL))
UNION
 SELECT "r"."user_id"
   FROM ("public"."roles" "r"
     JOIN "public"."trust_details" "t" ON (("t"."account_id" = "r"."account_id")))
  WHERE (("t"."id" = "beneficial_owners"."parent_id") AND ("r"."deleted_at" IS NULL))
UNION
 SELECT "r"."user_id"
   FROM ("public"."roles" "r"
     JOIN "public"."retirement_details" "rd" ON (("rd"."account_id" = "r"."account_id")))
  WHERE (("rd"."id" = "beneficial_owners"."parent_id") AND ("r"."deleted_at" IS NULL)))));



CREATE POLICY "Users can view contact designations for their accounts" ON "public"."contact_designations" FOR SELECT USING (("auth"."uid"() IN ( SELECT "r2"."user_id"
   FROM "public"."roles" "r2"
  WHERE (("r2"."account_id" = ( SELECT "r1"."account_id"
           FROM "public"."roles" "r1"
          WHERE ("r1"."id" = "contact_designations"."role_id"))) AND ("r2"."deleted_at" IS NULL)))));



CREATE POLICY "Users can view details for their accounts" ON "public"."entity_details" FOR SELECT USING (("auth"."uid"() IN ( SELECT "roles"."user_id"
   FROM "public"."roles"
  WHERE (("roles"."account_id" = "entity_details"."account_id") AND ("roles"."deleted_at" IS NULL)))));



CREATE POLICY "Users can view details for their accounts" ON "public"."individual_details" FOR SELECT USING (("auth"."uid"() IN ( SELECT "roles"."user_id"
   FROM "public"."roles"
  WHERE (("roles"."account_id" = "individual_details"."account_id") AND ("roles"."deleted_at" IS NULL)))));



CREATE POLICY "Users can view details for their accounts" ON "public"."retirement_details" FOR SELECT USING (("auth"."uid"() IN ( SELECT "roles"."user_id"
   FROM "public"."roles"
  WHERE (("roles"."account_id" = "retirement_details"."account_id") AND ("roles"."deleted_at" IS NULL)))));



CREATE POLICY "Users can view details for their accounts" ON "public"."trust_details" FOR SELECT USING (("auth"."uid"() IN ( SELECT "roles"."user_id"
   FROM "public"."roles"
  WHERE (("roles"."account_id" = "trust_details"."account_id") AND ("roles"."deleted_at" IS NULL)))));



CREATE POLICY "Users can view investments for their accounts" ON "public"."investments" FOR SELECT USING (("auth"."uid"() IN ( SELECT "roles"."user_id"
   FROM "public"."roles"
  WHERE (("roles"."account_id" = "investments"."account_id") AND ("roles"."deleted_at" IS NULL)))));



CREATE POLICY "Users can view roles for their accounts" ON "public"."roles" FOR SELECT USING (("auth"."uid"() IN ( SELECT "roles_1"."user_id"
   FROM "public"."roles" "roles_1"
  WHERE (("roles_1"."account_id" = "roles_1"."account_id") AND ("roles_1"."deleted_at" IS NULL)))));



CREATE POLICY "Users can view their own GP role" ON "public"."gp_roles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own access logs" ON "public"."file_access_logs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."user_profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."accreditation" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."activities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."aml_verification" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bank_info" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."beneficial_owners" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."companies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contact_designations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."entity_details" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."erisa_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."file_access_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."files" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gp_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."individual_details" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."investments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."retirement_details" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trust_details" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_in"("cstring") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_out"("public"."gtrgm") TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."bytea_to_text"("data" "bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."bytea_to_text"("data" "bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."bytea_to_text"("data" "bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bytea_to_text"("data" "bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_query_trgm"("text", "internal", smallint, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_extract_value_trgm"("text", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_consistent"("internal", smallint, "text", integer, "internal", "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gin_trgm_triconsistent"("internal", smallint, "text", integer, "internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_compress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_consistent"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_decompress"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_distance"("internal", "text", smallint, "oid", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_options"("internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_penalty"("internal", "internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_picksplit"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_same"("public"."gtrgm", "public"."gtrgm", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "postgres";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "anon";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "authenticated";
GRANT ALL ON FUNCTION "public"."gtrgm_union"("internal", "internal") TO "service_role";



GRANT ALL ON FUNCTION "public"."http"("request" "public"."http_request") TO "postgres";
GRANT ALL ON FUNCTION "public"."http"("request" "public"."http_request") TO "anon";
GRANT ALL ON FUNCTION "public"."http"("request" "public"."http_request") TO "authenticated";
GRANT ALL ON FUNCTION "public"."http"("request" "public"."http_request") TO "service_role";



GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying, "content" character varying, "content_type" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying, "content" character varying, "content_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying, "content" character varying, "content_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying, "content" character varying, "content_type" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying, "data" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying, "data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying, "data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying, "data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."http_head"("uri" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_head"("uri" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_head"("uri" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_head"("uri" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_header"("field" character varying, "value" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_header"("field" character varying, "value" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_header"("field" character varying, "value" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_header"("field" character varying, "value" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_list_curlopt"() TO "postgres";
GRANT ALL ON FUNCTION "public"."http_list_curlopt"() TO "anon";
GRANT ALL ON FUNCTION "public"."http_list_curlopt"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_list_curlopt"() TO "service_role";



GRANT ALL ON FUNCTION "public"."http_patch"("uri" character varying, "content" character varying, "content_type" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_patch"("uri" character varying, "content" character varying, "content_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_patch"("uri" character varying, "content" character varying, "content_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_patch"("uri" character varying, "content" character varying, "content_type" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "data" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "content" character varying, "content_type" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "content" character varying, "content_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "content" character varying, "content_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "content" character varying, "content_type" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_put"("uri" character varying, "content" character varying, "content_type" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_put"("uri" character varying, "content" character varying, "content_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_put"("uri" character varying, "content" character varying, "content_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_put"("uri" character varying, "content" character varying, "content_type" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_reset_curlopt"() TO "postgres";
GRANT ALL ON FUNCTION "public"."http_reset_curlopt"() TO "anon";
GRANT ALL ON FUNCTION "public"."http_reset_curlopt"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_reset_curlopt"() TO "service_role";



GRANT ALL ON FUNCTION "public"."http_set_curlopt"("curlopt" character varying, "value" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_set_curlopt"("curlopt" character varying, "value" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_set_curlopt"("curlopt" character varying, "value" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_set_curlopt"("curlopt" character varying, "value" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "postgres";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "anon";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_limit"(real) TO "service_role";



GRANT ALL ON FUNCTION "public"."show_limit"() TO "postgres";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "anon";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_limit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."show_trgm"("text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_dist"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."strict_word_similarity_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."text_to_bytea"("data" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."text_to_bytea"("data" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."text_to_bytea"("data" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."text_to_bytea"("data" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."urlencode"("string" "bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."urlencode"("string" "bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."urlencode"("string" "bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."urlencode"("string" "bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."urlencode"("data" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."urlencode"("data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."urlencode"("data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."urlencode"("data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."urlencode"("string" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."urlencode"("string" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."urlencode"("string" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."urlencode"("string" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_commutator_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_dist_op"("text", "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_similarity_op"("text", "text") TO "service_role";


















GRANT ALL ON TABLE "public"."accounts" TO "anon";
GRANT ALL ON TABLE "public"."accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."accounts" TO "service_role";



GRANT ALL ON TABLE "public"."accreditation" TO "anon";
GRANT ALL ON TABLE "public"."accreditation" TO "authenticated";
GRANT ALL ON TABLE "public"."accreditation" TO "service_role";



GRANT ALL ON TABLE "public"."activities" TO "anon";
GRANT ALL ON TABLE "public"."activities" TO "authenticated";
GRANT ALL ON TABLE "public"."activities" TO "service_role";



GRANT ALL ON TABLE "public"."aml_verification" TO "anon";
GRANT ALL ON TABLE "public"."aml_verification" TO "authenticated";
GRANT ALL ON TABLE "public"."aml_verification" TO "service_role";



GRANT ALL ON TABLE "public"."bank_info" TO "anon";
GRANT ALL ON TABLE "public"."bank_info" TO "authenticated";
GRANT ALL ON TABLE "public"."bank_info" TO "service_role";



GRANT ALL ON TABLE "public"."beneficial_owners" TO "anon";
GRANT ALL ON TABLE "public"."beneficial_owners" TO "authenticated";
GRANT ALL ON TABLE "public"."beneficial_owners" TO "service_role";



GRANT ALL ON TABLE "public"."companies" TO "anon";
GRANT ALL ON TABLE "public"."companies" TO "authenticated";
GRANT ALL ON TABLE "public"."companies" TO "service_role";



GRANT ALL ON TABLE "public"."contact_designations" TO "anon";
GRANT ALL ON TABLE "public"."contact_designations" TO "authenticated";
GRANT ALL ON TABLE "public"."contact_designations" TO "service_role";



GRANT ALL ON TABLE "public"."entity_details" TO "anon";
GRANT ALL ON TABLE "public"."entity_details" TO "authenticated";
GRANT ALL ON TABLE "public"."entity_details" TO "service_role";



GRANT ALL ON TABLE "public"."erisa_status" TO "anon";
GRANT ALL ON TABLE "public"."erisa_status" TO "authenticated";
GRANT ALL ON TABLE "public"."erisa_status" TO "service_role";



GRANT ALL ON TABLE "public"."file_access_logs" TO "anon";
GRANT ALL ON TABLE "public"."file_access_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."file_access_logs" TO "service_role";



GRANT ALL ON TABLE "public"."files" TO "anon";
GRANT ALL ON TABLE "public"."files" TO "authenticated";
GRANT ALL ON TABLE "public"."files" TO "service_role";



GRANT ALL ON TABLE "public"."gp_roles" TO "anon";
GRANT ALL ON TABLE "public"."gp_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."gp_roles" TO "service_role";



GRANT ALL ON TABLE "public"."individual_details" TO "anon";
GRANT ALL ON TABLE "public"."individual_details" TO "authenticated";
GRANT ALL ON TABLE "public"."individual_details" TO "service_role";



GRANT ALL ON TABLE "public"."investments" TO "anon";
GRANT ALL ON TABLE "public"."investments" TO "authenticated";
GRANT ALL ON TABLE "public"."investments" TO "service_role";



GRANT ALL ON TABLE "public"."retirement_details" TO "anon";
GRANT ALL ON TABLE "public"."retirement_details" TO "authenticated";
GRANT ALL ON TABLE "public"."retirement_details" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON TABLE "public"."trust_details" TO "anon";
GRANT ALL ON TABLE "public"."trust_details" TO "authenticated";
GRANT ALL ON TABLE "public"."trust_details" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
