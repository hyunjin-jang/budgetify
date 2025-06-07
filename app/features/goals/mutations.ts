import { z } from "zod";
import type { formSchema } from "./components/GoalSetting";
import type { SupabaseClient } from "@supabase/supabase-js";

export const createGoal = async (
  client: SupabaseClient, data: z.infer<typeof formSchema> & { userId: string }
) => {
  const { error } = await client
    .from('goals')
    .insert({
      title: data.title,
      amount: data.amount,
      start_date: data.startDate,
      end_date: data.endDate,
      user_id: data.userId,
    })

  if (error) {
    throw error;
  }

  return true;
};

export const updateGoalStatus = async (
  client: SupabaseClient, id: string, status: "completed" | "failed"
) => {
  const { error } = await client
    .from('goals')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw error;
  }

  return true;
};

export const deleteGoal = async (
  client: SupabaseClient, id: string
) => {
  const { error } = await client
    .from('goals')
    .delete()
    .eq('id', id)

  if (error) {
    throw error;
  }

  return true;
};