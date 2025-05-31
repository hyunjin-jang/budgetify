import client from "~/supa-client";

export const getGoals = async (userId: string) => {
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