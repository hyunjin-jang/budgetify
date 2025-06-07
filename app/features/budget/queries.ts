import type { Database } from "database.types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from "date-fns";

export const getBudget = async (
  client: SupabaseClient<Database>,
  userId: string,
  date: Date,
) => {
  const startDate = startOfMonth(date).toISOString();
  const endDate = endOfMonth(date).toISOString();

  const { data, error } = await client
    .from("budgets")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .maybeSingle()

  if (error) {
    throw error;
  }
  return data;
};

export const getFixedExpenses = async (
  client: SupabaseClient<Database>,
  budgetId: string,
) => {
  const { data, error } = await client
    .from("budget_fixed_expenses")
    .select("*")
    .eq("budget_id", budgetId)

  if (error) {
    throw error;
  }
  return data;
};

export const getIncomes = async (
  client: SupabaseClient<Database>,
  budgetId: string,
) => {
  const { data, error } = await client
    .from("budget_incomes")
    .select("*")
    .eq("budget_id", budgetId)

  if (error) {
    throw error;
  }
  return data;
};

export const getBudgetAllocations = async (
  client: SupabaseClient<Database>,
  budgetId: string,
) => {
  const { data, error } = await client
    .from("budget_allocations")
    .select("*")
    .eq("budget_id", budgetId)

  if (error) {
    throw error;
  }
  return data;
};

export const getBudgetYearlyTotal = async (
  client: SupabaseClient<Database>,
  userId: string,
  date: Date,
) => {
  const startDate = startOfYear(date).toISOString();
  const endDate = endOfYear(date).toISOString();

  const { data, error } = await client
    .from("budgets")
    .select("total_amount, date")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false })

  if (error) {
    throw error;
  }
  return data;
};

export const getBudgetMonthlyTotal = async (
  client: SupabaseClient<Database>,
  userId: string,
  date: Date,
) => {
  const startDate = startOfMonth(date).toISOString();
  const endDate = endOfMonth(date).toISOString();

  const { data, error } = await client
    .from("budgets")
    .select("total_amount, date")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false })

  if (error) {
    throw error;
  }
  return data;
};