export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      candidate_certificates: {
        Row: {
          candidate_id: string
          cert_number: string | null
          created_at: string
          date_of_issue: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          institution: string | null
          place: string | null
          type_certificate: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          cert_number?: string | null
          created_at?: string
          date_of_issue?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          institution?: string | null
          place?: string | null
          type_certificate: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          cert_number?: string | null
          created_at?: string
          date_of_issue?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          institution?: string | null
          place?: string | null
          type_certificate?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_certificates_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_cvs: {
        Row: {
          candidate_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          is_default: boolean | null
        }
        Insert: {
          candidate_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_default?: boolean | null
        }
        Update: {
          candidate_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_default?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_cvs_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_documents: {
        Row: {
          candidate_id: string
          created_at: string
          description: string | null
          document_type: string
          expiry_date: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          issue_date: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          description?: string | null
          document_type: string
          expiry_date?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          issue_date?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          description?: string | null
          document_type?: string
          expiry_date?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          issue_date?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_documents_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_education: {
        Row: {
          candidate_id: string
          created_at: string
          degree: string
          description: string | null
          end_date: string | null
          field_of_study: string | null
          id: string
          institution: string
          is_current: boolean | null
          start_date: string | null
        }
        Insert: {
          candidate_id: string
          created_at?: string
          degree: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution: string
          is_current?: boolean | null
          start_date?: string | null
        }
        Update: {
          candidate_id?: string
          created_at?: string
          degree?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution?: string
          is_current?: boolean | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_education_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_emergency_contacts: {
        Row: {
          address: string | null
          alternative_phone: string | null
          candidate_id: string
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_primary: boolean | null
          phone: string
          relationship: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          alternative_phone?: string | null
          candidate_id: string
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_primary?: boolean | null
          phone: string
          relationship: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          alternative_phone?: string | null
          candidate_id?: string
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_primary?: boolean | null
          phone?: string
          relationship?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_emergency_contacts_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_experience: {
        Row: {
          candidate_id: string
          company: string | null
          created_at: string
          description: string | null
          end_date: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          gt_loa: string | null
          id: string
          is_current: boolean | null
          job_description: string | null
          location: string | null
          position: string
          reason: string | null
          route: string | null
          start_date: string | null
          vessel_name_type: string | null
        }
        Insert: {
          candidate_id: string
          company?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          gt_loa?: string | null
          id?: string
          is_current?: boolean | null
          job_description?: string | null
          location?: string | null
          position: string
          reason?: string | null
          route?: string | null
          start_date?: string | null
          vessel_name_type?: string | null
        }
        Update: {
          candidate_id?: string
          company?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          gt_loa?: string | null
          id?: string
          is_current?: boolean | null
          job_description?: string | null
          location?: string | null
          position?: string
          reason?: string | null
          route?: string | null
          start_date?: string | null
          vessel_name_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_experience_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_medical_tests: {
        Row: {
          candidate_id: string
          created_at: string
          file_name: string | null
          file_path: string | null
          id: string
          score: number | null
          test_name: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          score?: number | null
          test_name: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          score?: number | null
          test_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_medical_tests_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_next_of_kin: {
        Row: {
          candidate_id: string
          created_at: string
          date_of_birth: string | null
          full_name: string
          id: string
          place_of_birth: string | null
          relationship: string
          signature: string | null
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          date_of_birth?: string | null
          full_name: string
          id?: string
          place_of_birth?: string | null
          relationship: string
          signature?: string | null
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          id?: string
          place_of_birth?: string | null
          relationship?: string
          signature?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_next_of_kin_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          covid_vaccinated: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          expected_salary_max: number | null
          expected_salary_min: number | null
          facebook_url: string | null
          full_name: string
          gender: string | null
          height_cm: number | null
          how_found_us: string | null
          id: string
          is_profile_public: boolean | null
          ktp_number: string | null
          linkedin_url: string | null
          phone: string | null
          place_of_birth: string | null
          professional_title: string | null
          referral_name: string | null
          registration_city: string | null
          salary_currency: string | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          website: string | null
          weight_kg: number | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          covid_vaccinated?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          expected_salary_max?: number | null
          expected_salary_min?: number | null
          facebook_url?: string | null
          full_name: string
          gender?: string | null
          height_cm?: number | null
          how_found_us?: string | null
          id?: string
          is_profile_public?: boolean | null
          ktp_number?: string | null
          linkedin_url?: string | null
          phone?: string | null
          place_of_birth?: string | null
          professional_title?: string | null
          referral_name?: string | null
          registration_city?: string | null
          salary_currency?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          weight_kg?: number | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          covid_vaccinated?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          expected_salary_max?: number | null
          expected_salary_min?: number | null
          facebook_url?: string | null
          full_name?: string
          gender?: string | null
          height_cm?: number | null
          how_found_us?: string | null
          id?: string
          is_profile_public?: boolean | null
          ktp_number?: string | null
          linkedin_url?: string | null
          phone?: string | null
          place_of_birth?: string | null
          professional_title?: string | null
          referral_name?: string | null
          registration_city?: string | null
          salary_currency?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      candidate_references: {
        Row: {
          address: string | null
          candidate_id: string
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string
          position: string | null
          relationship: string | null
          updated_at: string
          years_known: number | null
        }
        Insert: {
          address?: string | null
          candidate_id: string
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone: string
          position?: string | null
          relationship?: string | null
          updated_at?: string
          years_known?: number | null
        }
        Update: {
          address?: string | null
          candidate_id?: string
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
          position?: string | null
          relationship?: string | null
          updated_at?: string
          years_known?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_references_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_skills: {
        Row: {
          candidate_id: string
          proficiency_level: string | null
          skill_id: string
        }
        Insert: {
          candidate_id: string
          proficiency_level?: string | null
          skill_id: string
        }
        Update: {
          candidate_id?: string
          proficiency_level?: string | null
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_skills_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_travel_documents: {
        Row: {
          candidate_id: string
          created_at: string
          document_number: string | null
          document_type: string
          expiry_date: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          issue_date: string | null
          issuing_authority: string | null
          issuing_country: string | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          document_number?: string | null
          document_type: string
          expiry_date?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          issuing_country?: string | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          document_number?: string | null
          document_type?: string
          expiry_date?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          issuing_country?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_travel_documents_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applied_at: string
          approved_as: string | null
          approved_position: string | null
          bst_cc: string | null
          c1d_expiry_date: string | null
          candidate_id: string
          contact_no: string | null
          cover_letter: string | null
          crew_code: string | null
          cv_id: string | null
          cv_url: string | null
          date_of_entry: string | null
          education_background: string | null
          emergency_contact: string | null
          employment_offer: string | null
          eo_acceptance: string | null
          id: string
          interview_by: string | null
          interview_date: string | null
          interview_result: string | null
          interview_result_notes: string | null
          job_id: string
          letter_form_url: string | null
          marlin_english_score: string | null
          neha_ces_test: string | null
          notes: string | null
          office_registered: string | null
          photo_url: string | null
          previous_experience: string | null
          principal_interview_by: string | null
          principal_interview_date: string | null
          principal_interview_result: string | null
          remarks: string | null
          second_position: string | null
          ship_experience: string | null
          source: string | null
          status: string | null
          suitable: string | null
          test_result: string | null
          updated_at: string
          vaccin_covid_booster: boolean | null
        }
        Insert: {
          applied_at?: string
          approved_as?: string | null
          approved_position?: string | null
          bst_cc?: string | null
          c1d_expiry_date?: string | null
          candidate_id: string
          contact_no?: string | null
          cover_letter?: string | null
          crew_code?: string | null
          cv_id?: string | null
          cv_url?: string | null
          date_of_entry?: string | null
          education_background?: string | null
          emergency_contact?: string | null
          employment_offer?: string | null
          eo_acceptance?: string | null
          id?: string
          interview_by?: string | null
          interview_date?: string | null
          interview_result?: string | null
          interview_result_notes?: string | null
          job_id: string
          letter_form_url?: string | null
          marlin_english_score?: string | null
          neha_ces_test?: string | null
          notes?: string | null
          office_registered?: string | null
          photo_url?: string | null
          previous_experience?: string | null
          principal_interview_by?: string | null
          principal_interview_date?: string | null
          principal_interview_result?: string | null
          remarks?: string | null
          second_position?: string | null
          ship_experience?: string | null
          source?: string | null
          status?: string | null
          suitable?: string | null
          test_result?: string | null
          updated_at?: string
          vaccin_covid_booster?: boolean | null
        }
        Update: {
          applied_at?: string
          approved_as?: string | null
          approved_position?: string | null
          bst_cc?: string | null
          c1d_expiry_date?: string | null
          candidate_id?: string
          contact_no?: string | null
          cover_letter?: string | null
          crew_code?: string | null
          cv_id?: string | null
          cv_url?: string | null
          date_of_entry?: string | null
          education_background?: string | null
          emergency_contact?: string | null
          employment_offer?: string | null
          eo_acceptance?: string | null
          id?: string
          interview_by?: string | null
          interview_date?: string | null
          interview_result?: string | null
          interview_result_notes?: string | null
          job_id?: string
          letter_form_url?: string | null
          marlin_english_score?: string | null
          neha_ces_test?: string | null
          notes?: string | null
          office_registered?: string | null
          photo_url?: string | null
          previous_experience?: string | null
          principal_interview_by?: string | null
          principal_interview_date?: string | null
          principal_interview_result?: string | null
          remarks?: string | null
          second_position?: string | null
          ship_experience?: string | null
          source?: string | null
          status?: string | null
          suitable?: string | null
          test_result?: string | null
          updated_at?: string
          vaccin_covid_booster?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: false
            referencedRelation: "candidate_cvs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          benefits: string | null
          category_id: string | null
          company_name: string
          created_at: string
          department: string | null
          description: string
          education_level: string | null
          employer_id: string
          experience_level: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_urgent: boolean | null
          job_type: string
          location: string
          positions_available: number | null
          principal: string | null
          requirements: string | null
          responsibilities: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: string | null
          category_id?: string | null
          company_name: string
          created_at?: string
          department?: string | null
          description: string
          education_level?: string | null
          employer_id: string
          experience_level?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_urgent?: boolean | null
          job_type: string
          location: string
          positions_available?: number | null
          principal?: string | null
          requirements?: string | null
          responsibilities?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string | null
          category_id?: string | null
          company_name?: string
          created_at?: string
          department?: string | null
          description?: string
          education_level?: string | null
          employer_id?: string
          experience_level?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_urgent?: boolean | null
          job_type?: string
          location?: string
          positions_available?: number | null
          principal?: string | null
          requirements?: string | null
          responsibilities?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "job_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          receiver_id: string
          sender_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          receiver_id: string
          sender_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          receiver_id?: string
          sender_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          candidate_id: string
          job_id: string
          saved_at: string
        }
        Insert: {
          candidate_id: string
          job_id: string
          saved_at?: string
        }
        Update: {
          candidate_id?: string
          job_id?: string
          saved_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          is_approved: boolean
          rating: number
          testimonial: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          is_approved?: boolean
          rating: number
          testimonial: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          rating?: number
          testimonial?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_admin_role: { Args: { user_email: string }; Returns: boolean }
      has_permission: {
        Args: { _permission_name: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      insert_admin_role: {
        Args: { target_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "employer"
        | "candidate"
        | "manajer"
        | "staff"
        | "interviewer"
        | "interviewer_principal"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "employer",
        "candidate",
        "manajer",
        "staff",
        "interviewer",
        "interviewer_principal",
      ],
    },
  },
} as const
