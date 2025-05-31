import client from "~/supa-client";

export const getBudget = async (userId: string) => {
  const { data, error } = await client
    .from("budgets")
    .select("*")
    .eq("user_id", userId)

  if (error) {
    throw error;
  }
  return data;
};

export const getFixedExpenses = async (budgetId: string) => {
  const { data, error } = await client
    .from("budget_fixed_expenses")
    .select("*")
    .eq("budget_id", budgetId)

  if (error) {
    throw error;
  }
  return data;
};

export const getBudgetAllocations = async (budgetId: string) => {
  const { data, error } = await client
    .from("budget_allocations")
    .select("*")
    .eq("budget_id", budgetId)

  if (error) {
    throw error;
  }
  return data;
};