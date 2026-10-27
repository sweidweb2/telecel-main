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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      app_errors: {
        Row: {
          actor_id: string | null
          code: string | null
          context: Json | null
          created_at: string
          id: number
          message: string
          request_id: string | null
          severity: string
          source: string
        }
        Insert: {
          actor_id?: string | null
          code?: string | null
          context?: Json | null
          created_at?: string
          id?: number
          message: string
          request_id?: string | null
          severity: string
          source: string
        }
        Update: {
          actor_id?: string | null
          code?: string | null
          context?: Json | null
          created_at?: string
          id?: number
          message?: string
          request_id?: string | null
          severity?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_errors_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: number
          summary: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: number
          summary?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: number
          summary?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_export_settings: {
        Row: {
          created_at: string
          created_by: string | null
          format: string
          id: string
          last_exported_at: string | null
          name: string
          scope: string
          table_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          format: string
          id?: string
          last_exported_at?: string | null
          name: string
          scope: string
          table_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          format?: string
          id?: string
          last_exported_at?: string | null
          name?: string
          scope?: string
          table_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "backup_export_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          author_avatar_url: string | null
          author_name: string
          body_html: string
          categories: string[]
          created_at: string
          id: string
          is_featured: boolean
          published_at: string | null
          reading_time_minutes: number
          slug: string
          status: Database["public"]["Enums"]["blog_status"]
          summary: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_name: string
          body_html?: string
          categories?: string[]
          created_at?: string
          id?: string
          is_featured?: boolean
          published_at?: string | null
          reading_time_minutes?: number
          slug: string
          status?: Database["public"]["Enums"]["blog_status"]
          summary: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string
          body_html?: string
          categories?: string[]
          created_at?: string
          id?: string
          is_featured?: boolean
          published_at?: string | null
          reading_time_minutes?: number
          slug?: string
          status?: Database["public"]["Enums"]["blog_status"]
          summary?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          area_of_interest: string
          business_need: string
          company: string
          consent: boolean
          consent_text_version: string
          country_code: string
          created_at: string
          delivery_attempts: number
          delivery_status: Database["public"]["Enums"]["delivery_status"]
          email: string
          full_name: string
          id: string
          intent: Database["public"]["Enums"]["inquiry_intent"]
          job_role: string
          last_delivery_error: string | null
          preferred_contact_method: Database["public"]["Enums"]["contact_method"]
          source_path: string | null
          status: Database["public"]["Enums"]["inquiry_status"]
          updated_at: string
          utm: Json | null
        }
        Insert: {
          area_of_interest: string
          business_need: string
          company: string
          consent: boolean
          consent_text_version: string
          country_code: string
          created_at?: string
          delivery_attempts?: number
          delivery_status?: Database["public"]["Enums"]["delivery_status"]
          email: string
          full_name: string
          id?: string
          intent: Database["public"]["Enums"]["inquiry_intent"]
          job_role: string
          last_delivery_error?: string | null
          preferred_contact_method: Database["public"]["Enums"]["contact_method"]
          source_path?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
          utm?: Json | null
        }
        Update: {
          area_of_interest?: string
          business_need?: string
          company?: string
          consent?: boolean
          consent_text_version?: string
          country_code?: string
          created_at?: string
          delivery_attempts?: number
          delivery_status?: Database["public"]["Enums"]["delivery_status"]
          email?: string
          full_name?: string
          id?: string
          intent?: Database["public"]["Enums"]["inquiry_intent"]
          job_role?: string
          last_delivery_error?: string | null
          preferred_contact_method?: Database["public"]["Enums"]["contact_method"]
          source_path?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
          utm?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_app_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"] | null
      }
      current_session_is_fresh: { Args: never; Returns: boolean }
      get_session_context: {
        Args: never
        Returns: {
          user_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          is_active: boolean
          session_fresh: boolean
        }[]
      }
      get_user_stats: {
        Args: never
        Returns: {
          total: number
          admins: number
          editors: number
          no_access: number
          new_this_week: number
          new_this_month: number
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      blog_status: "draft" | "published"
      contact_method: "email" | "phone" | "video_call"
      delivery_status: "pending" | "sent" | "failed"
      inquiry_intent: "sales" | "demo" | "general"
      inquiry_status: "new" | "contacted" | "qualified" | "closed" | "spam"
      user_role: "admin" | "editor"
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
      blog_status: ["draft", "published"],
      contact_method: ["email", "phone", "video_call"],
      delivery_status: ["pending", "sent", "failed"],
      inquiry_intent: ["sales", "demo", "general"],
      inquiry_status: ["new", "contacted", "qualified", "closed", "spam"],
      user_role: ["admin", "editor"],
    },
  },
} as const
