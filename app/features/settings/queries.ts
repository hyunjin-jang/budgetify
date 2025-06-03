import type { SupabaseClient } from "@supabase/supabase-js";

export const getUserById = async (
  client: SupabaseClient,
  { id }: { id: string }
) => {
  const { data, error } =
    await client
      .from("profiles")
      .select("id, name, username, avatar")
      .eq("id", id)
      .single();
  if (error) {
    throw error;
  }
  return data;
};