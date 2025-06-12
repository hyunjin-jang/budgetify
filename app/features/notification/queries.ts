import type { Database } from "database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

export const getNotifications = async (client: SupabaseClient<Database>, userId: string) => {
  const { data, error } = await client
    .from("notifications")
    .select("*")
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw error;
  }

  return data;
};