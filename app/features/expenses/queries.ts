import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const getExpenses = async (client: SupabaseClient<Database>, userId: string) => {
  const { data, error } = await client
    .from("expenses")
    .select("title, amount, date, category(id, name)")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error) {
    throw error;
  }
  return data;
};

export const getExpenseCategories = async (client: SupabaseClient<Database>, userId: string) => {
  const { data, error } = await client
    .from("expense_categories")
    .select("id, name")
    .eq("user_id", userId);
  if (error) {
    throw error;
  }
  return data;
};