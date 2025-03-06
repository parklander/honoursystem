export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string
          roles: string[]
          membership_status: string
          phone_number: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relationship: string
          notes?: string
          created_at?: string
        }
        Insert: {
          id: string
          full_name: string
          roles?: string[]
          membership_status?: string
          phone_number?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          emergency_contact_relationship?: string
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          roles?: string[]
          membership_status?: string
          phone_number?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          emergency_contact_relationship?: string
          notes?: string
          created_at?: string
        }
      }
      roles: {
        Row: {
          role: string
          description: string
          hierarchy_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          role: string
          description: string
          hierarchy_level: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          role?: string
          description?: string
          hierarchy_level?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 