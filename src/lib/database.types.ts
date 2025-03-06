export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ConsumableCategory = 
  | 'filament'
  | 'resin'
  | 'vinyl'
  | 'blanks'
  | 'wood'
  | 'metal'
  | 'plastic'
  | 'electronics'
  | 'fasteners'
  | 'adhesives'
  | 'finishing'
  | 'other'

export type OrderStatus = 'unpaid' | 'paid';

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
      consumables: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          unit: string
          category: ConsumableCategory
          stock_quantity: number
          reorder_point: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          unit: string
          category: ConsumableCategory
          stock_quantity?: number
          reorder_point?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          unit?: string
          category?: ConsumableCategory
          stock_quantity?: number
          reorder_point?: number
          created_at?: string
          updated_at?: string
        }
      }
      consumable_purchases: {
        Row: {
          id: string
          user_id: string
          consumable_id: string
          quantity: number
          total_price: number
          purchase_date: string
          notes: string | null
          status: OrderStatus
        }
        Insert: {
          id?: string
          user_id: string
          consumable_id: string
          quantity: number
          total_price: number
          purchase_date?: string
          notes?: string | null
          status?: OrderStatus
        }
        Update: {
          id?: string
          user_id?: string
          consumable_id?: string
          quantity?: number
          total_price?: number
          purchase_date?: string
          notes?: string | null
          status?: OrderStatus
        }
      }
      inventory_adjustments: {
        Row: {
          id: string
          consumable_id: string
          quantity_change: number
          adjustment_type: string
          adjusted_by: string
          adjustment_date: string
          notes: string | null
        }
        Insert: {
          id?: string
          consumable_id: string
          quantity_change: number
          adjustment_type: string
          adjusted_by: string
          adjustment_date?: string
          notes?: string | null
        }
        Update: {
          id?: string
          consumable_id?: string
          quantity_change?: number
          adjustment_type?: string
          adjusted_by?: string
          adjustment_date?: string
          notes?: string | null
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