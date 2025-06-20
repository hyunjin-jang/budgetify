import { type Route } from "../../.react-router/types/app/api/+types/dashboard-api";
import { makeSSRClient } from "~/supa-client";
import { getLoggedIsUserId } from "~/features/settings/queries";
import {
  getBudgetMonthlyTotal,
  getBudgetYearlyTotal,
} from "~/features/budget/queries";
import { getExpensesByYear } from "~/features/expenses/queries";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedIsUserId(client);

  const url = new URL(request.url);
  const dateParam = url.searchParams.get("date");
  const date = dateParam ? new Date(dateParam) : new Date();

  const [budgetMonthlyTotal, budgetYearlyTotal, expensesByYear] =
    await Promise.all([
      getBudgetMonthlyTotal(client, userId, date),
      getBudgetYearlyTotal(client, userId, date),
      getExpensesByYear(client, userId, date),
    ]);

  return Response.json({
    budgetMonthlyTotal,
    budgetYearlyTotal,
    expensesByYear,
  });
};
