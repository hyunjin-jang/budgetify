import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const getGoals = async (client: SupabaseClient<Database>, userId: string) => {
  const { data, error } = await client
    .from("goals")
    .select("id, title, amount, start_date, end_date, status")
    .eq("user_id", userId)
    .order("start_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};