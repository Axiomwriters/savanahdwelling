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
      agent_listings: {
        Row: {
          agent_id: string
          amenities: Json | null
          bathrooms: number | null
          bedrooms: number | null
          category: Database["public"]["Enums"]["property_category"]
          city: string | null
          county: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          land_size: string | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          location: string
          price: number
          published_at: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          agent_id: string
          amenities?: Json | null
          bathrooms?: number | null
          bedrooms?: number | null
          category: Database["public"]["Enums"]["property_category"]
          city?: string | null
          county?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          land_size?: string | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          location: string
          price: number
          published_at?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          agent_id?: string
          amenities?: Json | null
          bathrooms?: number | null
          bedrooms?: number | null
          category?: Database["public"]["Enums"]["property_category"]
          city?: string | null
          county?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          land_size?: string | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location?: string
          price?: number
          published_at?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      agent_verifications: {
        Row: {
          id: string
          id_back_url: string | null
          id_front_url: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["verification_status"] | null
          submitted_at: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          id?: string
          id_back_url?: string | null
          id_front_url?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          submitted_at?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          id?: string
          id_back_url?: string | null
          id_front_url?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          submitted_at?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          read: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          county: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          notification_preferences: Json | null
          phone: string | null
          town: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          county?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          notification_preferences?: Json | null
          phone?: string | null
          town?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          county?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          notification_preferences?: Json | null
          phone?: string | null
          town?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_sessions: {
        Row: {
          id: string
          user_id: string
          role: "agent" | "host"
          token: string
          status: "pending" | "completed" | "expired" | "cancelled"
          id_front_url: string | null
          id_back_url: string | null
          selfie_url: string | null
          phone_number: string | null
          phone_verified: boolean | null
          otp_code: string | null
          otp_expires_at: string | null
          otp_attempts: number | null
          expires_at: string
          created_at: string | null
          updated_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          role: "agent" | "host"
          token: string
          status?: "pending" | "completed" | "expired" | "cancelled"
          id_front_url?: string | null
          id_back_url?: string | null
          selfie_url?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          otp_code?: string | null
          otp_expires_at?: string | null
          otp_attempts?: number | null
          expires_at: string
          created_at?: string | null
          updated_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          role?: "agent" | "host"
          token?: string
          status?: "pending" | "completed" | "expired" | "cancelled"
          id_front_url?: string | null
          id_back_url?: string | null
          selfie_url?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          otp_code?: string | null
          otp_expires_at?: string | null
          otp_attempts?: number | null
          expires_at?: string
          created_at?: string | null
          updated_at?: string | null
          completed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_approve_agent_verification: {
        Args: { _verification_id: string }
        Returns: undefined
      }
      admin_approve_listing: {
        Args: { _listing_id: string }
        Returns: undefined
      }
      admin_assign_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      admin_reject_agent_verification: {
        Args: { _reason: string; _verification_id: string }
        Returns: undefined
      }
      admin_reject_listing: {
        Args: { _listing_id: string; _reason: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "agent" | "admin"
      listing_status: "draft" | "pending" | "approved" | "rejected"
      listing_type: "sale" | "rent"
      notification_type:
        | "listing_approved"
        | "listing_rejected"
        | "verification_approved"
        | "verification_rejected"
        | "new_message"
        | "system_announcement"
      property_category:
        | "house"
        | "apartment"
        | "land"
        | "commercial"
        | "villa"
        | "bungalow"
      verification_status: "pending" | "approved" | "rejected"
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
      app_role: ["user", "agent", "admin"],
      listing_status: ["draft", "pending", "approved", "rejected"],
      listing_type: ["sale", "rent"],
      notification_type: [
        "listing_approved",
        "listing_rejected",
        "verification_approved",
        "verification_rejected",
        "new_message",
        "system_announcement",
      ],
      property_category: [
        "house",
        "apartment",
        "land",
        "commercial",
        "villa",
        "bungalow",
      ],
      verification_status: ["pending", "approved", "rejected"],
    },
  },
} as const
