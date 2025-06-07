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

export const getLoggedIsUserId = async (client: SupabaseClient) => {
  const { data, error } = await client.auth.getUser();
  if (error || data.user === null) {
    throw redirect("/auth/login");
  }
  return data.user.id;
};