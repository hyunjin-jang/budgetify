import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "react-router";

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

export const getLoggedIsUserId = async (
  client: SupabaseClient,
  { requireAuth = true }: { requireAuth?: boolean } = {}
) => {
  const { data, error } = await client.auth.getUser();
  if (error || data.user === null) {
    if (requireAuth) {
      throw redirect("/auth/login");
    }
    return null;
  }
  return data.user.id;
};