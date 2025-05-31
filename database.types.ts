export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      budget_allocations: {
        Row: {
          amount: number
          budget_id: string | null
          category: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          amount: number
          budget_id?: string | null
          category: string
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          budget_id?: string | null
          category?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_allocations_budget_id_budgets_id_fk"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_fixed_expenses: {
        Row: {
          amount: number
          budget_id: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          amount: number
          budget_id?: string | null
          created_at?: string
          id: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          budget_id?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_fixed_expenses_budget_id_budgets_id_fk"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_incomes: {
        Row: {
          amount: number
          budget_id: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          amount: number
          budget_id?: string | null
          created_at?: string
          id: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          budget_id?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_incomes_budget_id_budgets_id_fk"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          created_at: string
          id: string
          level: Database["public"]["Enums"]["budget_level"]
          month: number
          setting_method: Database["public"]["Enums"]["setting_method"]
          total_amount: number
          updated_at: string
          user_id: string | null
          year: number
        }
        Insert: {
          created_at?: string
          id: string
          level: Database["public"]["Enums"]["budget_level"]
          month: number
          setting_method: Database["public"]["Enums"]["setting_method"]
          total_amount: number
          updated_at?: string
          user_id?: string | null
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["budget_level"]
          month?: number
          setting_method?: Database["public"]["Enums"]["setting_method"]
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "budgets_user_id_profiles_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_categories_user_id_profiles_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          date: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          date: string
          id: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          date?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_expense_categories_id_fk"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_user_id_profiles_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          amount: number
          created_at: string
          end_date: string
          id: string
          start_date: string
          status: Database["public"]["Enums"]["goal_status"]
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          end_date: string
          id: string
          start_date: string
          status?: Database["public"]["Enums"]["goal_status"]
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          end_date?: string
          id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["goal_status"]
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_profiles_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          id: string
          name: string
          role: Database["public"]["Enums"]["role"]
          updated_at: string
          username: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string
          username: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      budget_level: "basic" | "intermediate" | "advanced"
      goal_status: "scheduled" | "in_progress" | "completed" | "failed"
      role: "admin" | "user"
      setting_method: "amount" | "income_based"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      budget_level: ["basic", "intermediate", "advanced"],
      goal_status: ["scheduled", "in_progress", "completed", "failed"],
      role: ["admin", "user"],
      setting_method: ["amount", "income_based"],
    },
  },
} as const
