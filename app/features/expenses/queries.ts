import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns";

export const getExpenses = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  const { data, error } = await client
    .from("expenses")
    .select("id, description, amount, date, category(id, name)")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) {
    throw error;
  }
  return data;
};

export const getExpenseCategories = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  const { data, error } = await client
    .from("expense_categories")
    .select("id, name")
    .or(`user_id.eq.${userId},user_id.is.null`);

  if (error) {
    console.log("🚀 ~ error:", error)
    throw error;
  }
  console.log("🚀 ~ data:", data)

  return data;
};

export const getExpensesByYear = async (
  client: SupabaseClient<Database>,
  userId: string,
  year: Date,
) => {
  const { data, error } = await client
    .from("expenses")
    .select("id, description, amount, date, category(id, name)")
    .eq("user_id", userId)
    .gte("date", startOfYear(year).toISOString())
    .lte("date", endOfYear(year).toISOString())
    .order("date", { ascending: false });

  if (error) {
    throw error;
  }
  return data;
};

export const getExpensesByMonth = async (
  client: SupabaseClient<Database>,
  userId: string,
  month: Date,
) => {
  const { data, error } = await client
    .from("expenses")
    .select("id, description, amount, date, category(id, name)")
    .eq("user_id", userId)
    .gte("date", startOfMonth(month).toISOString())
    .lte("date", endOfMonth(month).toISOString())
    .order("date", { ascending: false });

  if (error) {
    throw error;
  }
  return data;
};