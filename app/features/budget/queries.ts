import type { Database } from "database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

export const getBudget = async (client: SupabaseClient<Database>, userId: string) => {
  const { data, error } = await client
    .from("budgets")
    .select("*")
    .eq("user_id", userId)

  if (error) {
    throw error;
  }
  return data;
};

export const getFixedExpenses = async (client: SupabaseClient<Database>, budgetId: string) => {
  const { data, error } = await client
    .from("budget_fixed_expenses")
    .select("*")
    .eq("budget_id", budgetId)

  if (error) {
    throw error;
  }
  return data;
};

export const getBudgetAllocations = async (client: SupabaseClient<Database>, budgetId: string) => {
  const { data, error } = await client
    .from("budget_allocations")
    .select("*")
    .eq("budget_id", budgetId)

  if (error) {
    throw error;
  }
  return data;
};