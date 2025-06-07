import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
import type z from "zod";
import type { formSchema } from "./components/BudgetSetting";

export const createBudget = async (
  client: SupabaseClient<Database>,
  budget: z.infer<typeof formSchema> & { userId: string },
) => {
  const { data, error } = await client
    .from("budgets")
    .insert({
      user_id: budget.userId,
      total_amount: budget.totalAmount,
      level: budget.level,
      setting_method: budget.settingMethod,
    })
    .select('id')
    .single();

  if (budget.fixedCost) {
    await client
      .from("budget_fixed_expenses")
      .insert(budget.fixedCost.map((expense) => ({
        budget_id: data?.id,
        amount: expense.amount,
        title: expense.source,
      })));
  }

  if (budget.income) {
    await client
      .from("budget_incomes")
      .insert(budget.income.map((income) => ({
        budget_id: data?.id,
        amount: income.amount,
        title: income.source,
      })));
  }

  if (error) {
    throw error;
  }

  return true;
};

export const updateBudget = async (
  client: SupabaseClient<Database>,
  budget: z.infer<typeof formSchema> & { id: string },
) => {
  const { data, error } = await client
    .from("budgets")
    .update({
      level: budget.level,
      setting_method: budget.settingMethod,
      total_amount: budget.totalAmount,
    })
    .eq("id", budget.id);

  await client.from("budget_fixed_expenses").delete().eq("budget_id", budget.id);
  await client.from("budget_incomes").delete().eq("budget_id", budget.id);

  if (budget.fixedCost) {
    await client
      .from("budget_fixed_expenses")
      .insert(budget.fixedCost.map((expense) => ({
        budget_id: budget.id,
        amount: expense.amount,
        title: expense.source,
      })));
  }

  if (budget.income) {
    await client
      .from("budget_incomes")
      .insert(budget.income.map((income) => ({
        budget_id: budget.id,
        amount: income.amount,
        title: income.source,
      })));
  }

  if (error) {
    throw error;
  }

  return true;
};