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
      users: {
        Row: {
          id: string
          farcaster_id: string
          user_address: string | null
          paid_credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farcaster_id: string
          user_address?: string | null
          paid_credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farcaster_id?: string
          user_address?: string | null
          paid_credits?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      rights: {
        Row: {
          id: string
          title: string
          complex_description: string
          simplified_description: string
          category: string
          keywords: string[]
          next_steps: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          complex_description: string
          simplified_description: string
          category: string
          keywords: string[]
          next_steps: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          complex_description?: string
          simplified_description?: string
          category?: string
          keywords?: string[]
          next_steps?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lookup_history: {
        Row: {
          id: string
          user_id: string
          right_id: string | null
          query: string
          result: Json
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          right_id?: string | null
          query: string
          result: Json
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          right_id?: string | null
          query?: string
          result?: Json
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "lookup_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lookup_history_right_id_fkey"
            columns: ["right_id"]
            isOneToOne: false
            referencedRelation: "rights"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          user_id: string
          stripe_payment_intent_id: string
          amount: number
          currency: string
          credits_purchased: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_intent_id: string
          amount: number
          currency: string
          credits_purchased: number
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_intent_id?: string
          amount?: number
          currency?: string
          credits_purchased?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
