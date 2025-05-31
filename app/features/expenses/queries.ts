import client from "~/supa-client";

export const getExpenses = async (userId: string) => {
  const { data, error } = await client
    .from("expenses")
    .select("title, amount, date, category(id, name)")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error) {
    throw error;
  }
  return data;
};

export const getExpenseCategories = async (userId: string) => {
  const { data, error } = await client
    .from("expense_categories")
    .select("id, name")
    .eq("user_id", userId);
  if (error) {
    throw error;
  }
  return data;
};