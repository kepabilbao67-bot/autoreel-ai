import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Tipos de la base de datos
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan: 'starter' | 'creator' | 'business'
          videos_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'starter' | 'creator' | 'business'
          videos_count?: number
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'starter' | 'creator' | 'business'
          videos_count?: number
        }
        Relationships: []
      }
      videos: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          script: string | null
          status: 'draft' | 'processing' | 'completed' | 'failed'
          platform: 'tiktok' | 'reels' | 'shorts'
          duration: number
          language: string
          style: string
          video_url: string | null
          thumbnail_url: string | null
          views: number
          likes: number
          shares: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          description?: string | null
          script?: string | null
          status?: 'draft' | 'processing' | 'completed' | 'failed'
          platform?: 'tiktok' | 'reels' | 'shorts'
          duration?: number
          language?: string
          style?: string
        }
        Update: {
          title?: string
          description?: string | null
          script?: string | null
          status?: 'draft' | 'processing' | 'completed' | 'failed'
          video_url?: string | null
          thumbnail_url?: string | null
          views?: number
          likes?: number
          shares?: number
        }
        Relationships: [
          {
            foreignKeyName: "videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: 'starter' | 'creator' | 'business'
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'starter' | 'creator' | 'business'
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
        }
        Update: {
          stripe_subscription_id?: string | null
          plan?: 'starter' | 'creator' | 'business'
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start?: string | null
          current_period_end?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      assets: {
        Row: {
          id: string
          user_id: string
          video_id: string | null
          type: 'image' | 'audio' | 'video' | 'subtitle'
          url: string
          filename: string
          size: number
          created_at: string
        }
        Insert: {
          user_id: string
          video_id?: string | null
          type: 'image' | 'audio' | 'video' | 'subtitle'
          url: string
          filename: string
          size: number
        }
        Update: {
          video_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          thumbnail_url: string | null
          config: Record<string, unknown>
          is_premium: boolean
          usage_count: number
          created_at: string
        }
        Insert: {
          name: string
          description: string
          category: string
          thumbnail_url?: string | null
          config?: Record<string, unknown>
          is_premium?: boolean
        }
        Update: {
          name?: string
          description?: string
          usage_count?: number
        }
        Relationships: []
      }
      analytics: {
        Row: {
          id: string
          user_id: string
          video_id: string
          event: string
          value: number
          metadata: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          user_id: string
          video_id: string
          event: string
          value?: number
          metadata?: Record<string, unknown> | null
        }
        Update: {
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          template_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          template_id: string
        }
        Update: Record<string, never>
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      scheduled_posts: {
        Row: {
          id: string
          user_id: string
          video_id: string
          platform: string
          scheduled_at: string
          status: 'pending' | 'published' | 'failed'
          created_at: string
        }
        Insert: {
          user_id: string
          video_id: string
          platform: string
          scheduled_at: string
          status?: 'pending' | 'published' | 'failed'
        }
        Update: {
          status?: 'pending' | 'published' | 'failed'
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_user_id_fkey"
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

// Cliente del navegador
export function createSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Cliente admin (solo servidor)
export function createSupabaseAdmin() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
