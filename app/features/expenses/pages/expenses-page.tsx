import { useState } from "react";
import { ExpenseSetting, formSchema } from "../components/ExpenseSetting";
import { Button } from "~/common/components/ui/button";
import type { MetaFunction } from "react-router";
import { format, addMonths, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { getExpenseCategories, getExpenses } from "../queries";
import type { Route } from "../../../.react-router/types/app/+types/expenses-page";
import { ExpenseCard } from "../components/ExpenseCard";
import { makeSSRClient } from "~/supa-client";
import { getLoggedIsUserId } from "~/features/settings/queries";
import { createExpense, deleteExpense } from "../mutations";
import { toast } from "sonner";

export const meta: MetaFunction = () => {
  return [{ title: "머니도비 지출 설정" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const userId = await getLoggedIsUserId(client);
  const expenses = await getExpenses(client, userId);
  const categories = await getExpenseCategories(client, userId);
  return { expenses, categories };
};

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: Record<string, string> | null;
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedIsUserId(client);
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "create") {
    const { success, data, error } = formSchema.safeParse({
      ...Object.fromEntries(formData),
      amount: Number(formData.get("amount")),
      date: new Date(formData.get("date") as string),
    });

    if (!success) {
      return {
        expenseError: null,
        formErrors: error.flatten().fieldErrors,
      };
    }

    try {
      await createExpense(client, { ...data, userId });
      toast.success("지출이 추가되었습니다.");
    } catch (error) {
      toast.error("지출 추가에 실패했습니다.");
      console.log(error);
    }
  } else if (action === "delete") {
    const expenseId = formData.get("expenseId");
    try {
      await deleteExpense(client, expenseId as string);
      toast.success("지출이 삭제되었습니다.");
    } catch (error) {
      toast.error("지출 삭제에 실패했습니다.");
    }
  }
};

export default function ExpensesPage({ loaderData }: Route.ComponentProps) {
  const [isExpenseSetting, setIsExpenseSetting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const categories = loaderData.categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const groupedByMonth = loaderData.expenses.reduce((acc, expense) => {
    const monthKey = format(new Date(expense.date), "yyyy년 M월");
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  const selectedMonthKey = format(selectedMonth, "yyyy년 M월");
  const selectedExpenses = groupedByMonth[selectedMonthKey] || [];

  const groupedByDate = selectedExpenses.reduce((acc, expense) => {
    const dateKey = format(new Date(expense.date), "yyyy-MM-dd (eee)", {
      locale: ko,
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  const total = selectedExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">오늘의 지출</h2>
          <Button onClick={() => setIsExpenseSetting(true)}>지출 추가</Button>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedMonth((prev) => subMonths(prev, 1))}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">
            {format(selectedMonth, "yyyy년 M월")} 지출현황
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedMonth((prev) => addMonths(prev, 1))}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>

        {selectedExpenses.length === 0 ? (
          <p className="text-muted-foreground text-sm">지출 내역이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-full space-y-6">
              <h2 className="text-lg font-bold mt-4 mb-2">
                {selectedMonthKey} 총 지출: {total.toLocaleString()}원
              </h2>
              {Object.entries(groupedByDate)
                .sort((a, b) => {
                  const dateA = new Date(a[1][0].date).getTime();
                  const dateB = new Date(b[1][0].date).getTime();
                  return dateB - dateA;
                })
                .map(([date, expenses]) => {
                  let offset = 0;
                  return (
                    <div
                      key={date}
                      className="grid grid-cols-1 md:grid-cols-2 gap-2"
                    >
                      <h3 className="col-span-full text-sm font-semibold text-muted-foreground border-b pb-1 mb-2">
                        {date}
                      </h3>
                      {expenses.map((expense, idx) => {
                        const realIdx = loaderData.expenses.findIndex(
                          (e) =>
                            e.date === expense.date &&
                            e.amount === expense.amount &&
                            e.category === expense.category &&
                            e.description === expense.description &&
                            loaderData.expenses.indexOf(e) >= offset
                        );
                        offset = realIdx + 1;

                        return (
                          <ExpenseCard key={idx} idx={idx} expense={expense} />
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      <ExpenseSetting
        categories={categories}
        isExpenseSetting={isExpenseSetting}
        onOpenChange={() => setIsExpenseSetting(false)}
      />
    </>
  );
}
