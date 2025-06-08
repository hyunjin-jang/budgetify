import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
import type z from "zod";
import type { formSchema } from "./components/ExpenseSetting";

export const createExpense = async (
  client: SupabaseClient<Database>,
  expense: z.infer<typeof formSchema> & { userId: string }
) => {
  const { error } = await client
    .from("expenses")
    .insert({
      user_id: expense.userId,
      amount: expense.amount,
      date: expense.date.toISOString(),
      category: expense.category,
      description: expense.description,
    });

  if (error) {
    throw error;
  }

  return true;
};

export const deleteExpense = async (
  client: SupabaseClient<Database>,
  expenseId: string
) => {
  const { error } = await client
    .from("expenses")
    .delete()
    .eq("id", expenseId);

  if (error) {
    throw error;
  }

  return true;
};