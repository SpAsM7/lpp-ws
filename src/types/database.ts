export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_id: string
          account_name: string
          account_type: string
          accreditation_status: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          kyc_status: string
          status: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          account_id?: string
          account_name: string
          account_type: string
          accreditation_status?: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          kyc_status?: string
          status?: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          account_id?: string
          account_name?: string
          account_type?: string
          accreditation_status?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          kyc_status?: string
          status?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: []
      }
      accreditation: {
        Row: {
          account_id: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          expires_at: string | null
          id: string
          qualification_details: Json
          qualification_type: string
          updated_at: string
          updated_by: string
          verified_at: string | null
        }
        Insert: {
          account_id: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          expires_at?: string | null
          id?: string
          qualification_details?: Json
          qualification_type: string
          updated_at?: string
          updated_by: string
          verified_at?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          expires_at?: string | null
          id?: string
          qualification_details?: Json
          qualification_type?: string
          updated_at?: string
          updated_by?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accreditation_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      activities: {
        Row: {
          activity_id: string
          activity_type: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          description: string
          entity_id: string
          entity_type: string
          importance: string
          metadata: Json | null
          read_status: Json | null
          title: string
          updated_at: string
          updated_by: string
          user_id: string
        }
        Insert: {
          activity_id?: string
          activity_type: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          description: string
          entity_id: string
          entity_type: string
          importance: string
          metadata?: Json | null
          read_status?: Json | null
          title: string
          updated_at?: string
          updated_by: string
          user_id: string
        }
        Update: {
          activity_id?: string
          activity_type?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string
          entity_id?: string
          entity_type?: string
          importance?: string
          metadata?: Json | null
          read_status?: Json | null
          title?: string
          updated_at?: string
          updated_by?: string
          user_id?: string
        }
        Relationships: []
      }
      aml_verification: {
        Row: {
          account_id: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          pep_status: boolean
          sanctions_check: boolean
          updated_at: string
          updated_by: string
          verification_details: Json
          verification_type: string
          verified_at: string | null
        }
        Insert: {
          account_id: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          pep_status?: boolean
          sanctions_check?: boolean
          updated_at?: string
          updated_by: string
          verification_details?: Json
          verification_type: string
          verified_at?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          pep_status?: boolean
          sanctions_check?: boolean
          updated_at?: string
          updated_by?: string
          verification_details?: Json
          verification_type?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aml_verification_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      bank_info: {
        Row: {
          account_id: string
          account_name: string
          account_number: string
          bank_address: Json
          bank_country: string
          bank_name: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          primary_account: boolean
          routing_number: string
          swift_code: string | null
          updated_at: string
          updated_by: string
        }
        Insert: {
          account_id: string
          account_name: string
          account_number: string
          bank_address?: Json
          bank_country: string
          bank_name: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          primary_account?: boolean
          routing_number: string
          swift_code?: string | null
          updated_at?: string
          updated_by: string
        }
        Update: {
          account_id?: string
          account_name?: string
          account_number?: string
          bank_address?: Json
          bank_country?: string
          bank_name?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          primary_account?: boolean
          routing_number?: string
          swift_code?: string | null
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_info_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      beneficial_owners: {
        Row: {
          citizenship: string
          control_person: boolean
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          employment_info: Json | null
          id: string
          name: string
          owner_type: string
          ownership_percent: number
          parent_id: string
          parent_type: string
          relationship_type: string
          tax_id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          citizenship: string
          control_person?: boolean
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          employment_info?: Json | null
          id?: string
          name: string
          owner_type: string
          ownership_percent: number
          parent_id: string
          parent_type: string
          relationship_type: string
          tax_id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          citizenship?: string
          control_person?: boolean
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          employment_info?: Json | null
          id?: string
          name?: string
          owner_type?: string
          ownership_percent?: number
          parent_id?: string
          parent_type?: string
          relationship_type?: string
          tax_id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          company_id: string
          company_name: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          founded_date: string | null
          industry: string
          logo_url: string | null
          status: string
          updated_at: string
          updated_by: string
          website: string | null
        }
        Insert: {
          company_id?: string
          company_name: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          founded_date?: string | null
          industry: string
          logo_url?: string | null
          status: string
          updated_at?: string
          updated_by: string
          website?: string | null
        }
        Update: {
          company_id?: string
          company_name?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          founded_date?: string | null
          industry?: string
          logo_url?: string | null
          status?: string
          updated_at?: string
          updated_by?: string
          website?: string | null
        }
        Relationships: []
      }
      contact_designations: {
        Row: {
          contact_preferences: Json
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          designation_type: string
          id: string
          role_id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          contact_preferences?: Json
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          designation_type: string
          id?: string
          role_id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          contact_preferences?: Json
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          designation_type?: string
          id?: string
          role_id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_designations_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_details: {
        Row: {
          account_id: string
          bank_entity_status: boolean
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          entity_type: string
          fatf_jurisdiction: boolean
          formation_date: string
          formed_to_invest: boolean
          id: string
          investment_company_status: boolean
          jurisdiction: string
          mailing_address: Json
          principal_place_business: Json
          public_reporting_entity: boolean
          tax_exempt: boolean
          tax_id: string
          tax_year_end: string | null
          updated_at: string
          updated_by: string
          us_person: boolean
        }
        Insert: {
          account_id: string
          bank_entity_status?: boolean
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          entity_type: string
          fatf_jurisdiction?: boolean
          formation_date: string
          formed_to_invest?: boolean
          id?: string
          investment_company_status?: boolean
          jurisdiction: string
          mailing_address?: Json
          principal_place_business?: Json
          public_reporting_entity?: boolean
          tax_exempt?: boolean
          tax_id: string
          tax_year_end?: string | null
          updated_at?: string
          updated_by: string
          us_person: boolean
        }
        Update: {
          account_id?: string
          bank_entity_status?: boolean
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          entity_type?: string
          fatf_jurisdiction?: boolean
          formation_date?: string
          formed_to_invest?: boolean
          id?: string
          investment_company_status?: boolean
          jurisdiction?: string
          mailing_address?: Json
          principal_place_business?: Json
          public_reporting_entity?: boolean
          tax_exempt?: boolean
          tax_id?: string
          tax_year_end?: string | null
          updated_at?: string
          updated_by?: string
          us_person?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "entity_details_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      erisa_status: {
        Row: {
          benefit_plan_percentage: number | null
          church_plan: boolean
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          fiduciary_name: string | null
          governmental_plan: boolean
          id: string
          parent_id: string
          parent_type: string
          subject_to_erisa: boolean
          updated_at: string
          updated_by: string
        }
        Insert: {
          benefit_plan_percentage?: number | null
          church_plan?: boolean
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          fiduciary_name?: string | null
          governmental_plan?: boolean
          id?: string
          parent_id: string
          parent_type: string
          subject_to_erisa?: boolean
          updated_at?: string
          updated_by: string
        }
        Update: {
          benefit_plan_percentage?: number | null
          church_plan?: boolean
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          fiduciary_name?: string | null
          governmental_plan?: boolean
          id?: string
          parent_id?: string
          parent_type?: string
          subject_to_erisa?: boolean
          updated_at?: string
          updated_by?: string
        }
        Relationships: []
      }
      file_access_logs: {
        Row: {
          access_timestamp: string
          access_type: string
          file_id: string
          log_id: string
          user_id: string
        }
        Insert: {
          access_timestamp?: string
          access_type: string
          file_id: string
          log_id?: string
          user_id: string
        }
        Update: {
          access_timestamp?: string
          access_type?: string
          file_id?: string
          log_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_access_logs_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["file_id"]
          },
        ]
      }
      files: {
        Row: {
          account_id: string | null
          company_id: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          file_id: string
          file_name: string
          file_type: string
          investment_id: string | null
          modification_access: string
          storage_path: string
          updated_at: string
          updated_by: string
          visibility_scope: string
        }
        Insert: {
          account_id?: string | null
          company_id?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          file_id?: string
          file_name: string
          file_type: string
          investment_id?: string | null
          modification_access: string
          storage_path: string
          updated_at?: string
          updated_by: string
          visibility_scope: string
        }
        Update: {
          account_id?: string | null
          company_id?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          file_id?: string
          file_name?: string
          file_type?: string
          investment_id?: string | null
          modification_access?: string
          storage_path?: string
          updated_at?: string
          updated_by?: string
          visibility_scope?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "files_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "files_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["investment_id"]
          },
        ]
      }
      gp_roles: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          role_type: string
          updated_at: string
          updated_by: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          role_type: string
          updated_at?: string
          updated_by: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          role_type?: string
          updated_at?: string
          updated_by?: string
          user_id?: string
        }
        Relationships: []
      }
      individual_details: {
        Row: {
          account_id: string
          acting_as_nominee: boolean
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          employer: string | null
          id: string
          joint_account: boolean
          joint_holder_info: Json | null
          mailing_address: Json
          professional_title: string | null
          tax_id: string
          tax_id_type: string
          tax_year_end: string | null
          updated_at: string
          updated_by: string
          us_person: boolean
        }
        Insert: {
          account_id: string
          acting_as_nominee?: boolean
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          employer?: string | null
          id?: string
          joint_account?: boolean
          joint_holder_info?: Json | null
          mailing_address?: Json
          professional_title?: string | null
          tax_id: string
          tax_id_type: string
          tax_year_end?: string | null
          updated_at?: string
          updated_by: string
          us_person: boolean
        }
        Update: {
          account_id?: string
          acting_as_nominee?: boolean
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          employer?: string | null
          id?: string
          joint_account?: boolean
          joint_holder_info?: Json | null
          mailing_address?: Json
          professional_title?: string | null
          tax_id?: string
          tax_id_type?: string
          tax_year_end?: string | null
          updated_at?: string
          updated_by?: string
          us_person?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "individual_details_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      investments: {
        Row: {
          account_id: string
          company_id: string
          created_at: string
          created_by: string
          current_nav: number
          deleted_at: string | null
          deleted_by: string | null
          initial_investment_date: string
          investment_id: string
          investment_metrics: Json | null
          investment_status: string
          investment_type: string
          last_valuation_date: string | null
          total_called_capital: number
          total_committed_capital: number
          total_distributions: number
          updated_at: string
          updated_by: string
        }
        Insert: {
          account_id: string
          company_id: string
          created_at?: string
          created_by: string
          current_nav: number
          deleted_at?: string | null
          deleted_by?: string | null
          initial_investment_date: string
          investment_id?: string
          investment_metrics?: Json | null
          investment_status: string
          investment_type: string
          last_valuation_date?: string | null
          total_called_capital: number
          total_committed_capital: number
          total_distributions: number
          updated_at?: string
          updated_by: string
        }
        Update: {
          account_id?: string
          company_id?: string
          created_at?: string
          created_by?: string
          current_nav?: number
          deleted_at?: string | null
          deleted_by?: string | null
          initial_investment_date?: string
          investment_id?: string
          investment_metrics?: Json | null
          investment_status?: string
          investment_type?: string
          last_valuation_date?: string | null
          total_called_capital?: number
          total_committed_capital?: number
          total_distributions?: number
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "investments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      retirement_details: {
        Row: {
          account_id: string
          created_at: string
          created_by: string
          custodian_info: Json
          deleted_at: string | null
          deleted_by: string | null
          id: string
          mailing_address: Json
          plan_type: string
          self_directed: boolean
          tax_id: string
          tax_year_end: string | null
          updated_at: string
          updated_by: string
        }
        Insert: {
          account_id: string
          created_at?: string
          created_by: string
          custodian_info?: Json
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          mailing_address?: Json
          plan_type: string
          self_directed?: boolean
          tax_id: string
          tax_year_end?: string | null
          updated_at?: string
          updated_by: string
        }
        Update: {
          account_id?: string
          created_at?: string
          created_by?: string
          custodian_info?: Json
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          mailing_address?: Json
          plan_type?: string
          self_directed?: boolean
          tax_id?: string
          tax_year_end?: string | null
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "retirement_details_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      roles: {
        Row: {
          account_id: string
          can_remove_self: boolean
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          role_type: string
          updated_at: string
          updated_by: string
          user_id: string
        }
        Insert: {
          account_id: string
          can_remove_self?: boolean
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          role_type: string
          updated_at?: string
          updated_by: string
          user_id: string
        }
        Update: {
          account_id?: string
          can_remove_self?: boolean
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          role_type?: string
          updated_at?: string
          updated_by?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_roles_account"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      trust_details: {
        Row: {
          account_id: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          formation_date: string
          formed_to_invest: boolean
          grantor_trust: boolean
          id: string
          mailing_address: Json
          revocable: boolean
          tax_id: string
          tax_year_end: string | null
          trust_type: string
          updated_at: string
          updated_by: string
          us_person: boolean
        }
        Insert: {
          account_id: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          formation_date: string
          formed_to_invest?: boolean
          grantor_trust?: boolean
          id?: string
          mailing_address?: Json
          revocable: boolean
          tax_id: string
          tax_year_end?: string | null
          trust_type: string
          updated_at?: string
          updated_by: string
          us_person: boolean
        }
        Update: {
          account_id?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          formation_date?: string
          formed_to_invest?: boolean
          grantor_trust?: boolean
          id?: string
          mailing_address?: Json
          revocable?: boolean
          tax_id?: string
          tax_year_end?: string | null
          trust_type?: string
          updated_at?: string
          updated_by?: string
          us_person?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "trust_details_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          communication_preferences: Json
          company_name: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          first_name: string
          is_gp_user: boolean
          is_lp_user: boolean
          last_name: string
          linkedin_url: string | null
          phone: string | null
          professional_title: string | null
          profile_image_url: string | null
          timezone: string | null
          updated_at: string
          updated_by: string
          user_id: string
        }
        Insert: {
          communication_preferences?: Json
          company_name?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          first_name: string
          is_gp_user?: boolean
          is_lp_user?: boolean
          last_name: string
          linkedin_url?: string | null
          phone?: string | null
          professional_title?: string | null
          profile_image_url?: string | null
          timezone?: string | null
          updated_at?: string
          updated_by: string
          user_id: string
        }
        Update: {
          communication_preferences?: Json
          company_name?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          first_name?: string
          is_gp_user?: boolean
          is_lp_user?: boolean
          last_name?: string
          linkedin_url?: string | null
          phone?: string | null
          professional_title?: string | null
          profile_image_url?: string | null
          timezone?: string | null
          updated_at?: string
          updated_by?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: {
        Args: {
          data: string
        }
        Returns: string
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      http: {
        Args: {
          request: Database["public"]["CompositeTypes"]["http_request"]
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete:
        | {
            Args: {
              uri: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_get:
        | {
            Args: {
              uri: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_head: {
        Args: {
          uri: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: {
          field: string
          value: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post:
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_put: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: {
          curlopt: string
          value: string
        }
        Returns: boolean
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
      text_to_bytea: {
        Args: {
          data: string
        }
        Returns: string
      }
      urlencode:
        | {
            Args: {
              data: Json
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
