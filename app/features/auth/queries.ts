import { makeSSRClient } from "~/supa-client";

export const checkUsernameExists = async (request: Request, { username }: { username: string }) => {
  const { client } = await makeSSRClient(request);
  const { error } = await client
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();
  if (error) {
    return false;
  }
  return true;
};