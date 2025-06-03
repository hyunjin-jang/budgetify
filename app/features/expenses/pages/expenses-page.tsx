import { useState } from "react";
import { ExpenseSetting } from "../components/ExpenseSetting";
import { Button } from "~/common/components/ui/button";
import type { MetaFunction } from "react-router";
import { format, addMonths, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import IconButton from "~/common/components/iconButton";
import { getExpenseCategories, getExpenses } from "../queries";
import type { Route } from "./+types/expenses-page";
import { ExpenseCard } from "../components/ExpenseCard";
import { makeSSRClient } from "~/supa-client";

export const meta: MetaFunction = () => {
  return [{ title: "머니도비 지출 설정" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const expenses = await getExpenses(
    client,
    "376adda7-64d1-4eb0-a962-2465dbc9f2cb"
  );
  const categories = await getExpenseCategories(
    client,
    "376adda7-64d1-4eb0-a962-2465dbc9f2cb"
  );
  return { expenses, categories };
};

type Expense = {
  title: string;
  amount: number;
  date: string;
  category: {
    id: string;
    name: string;
  } | null;
};

export default function ExpensesPage({ loaderData }: Route.ComponentProps) {
  const [isExpenseSetting, setIsExpenseSetting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const handleDeleteExpense = () => {};

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
          <IconButton
            onClick={() => setSelectedMonth((prev) => subMonths(prev, 1))}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </IconButton>
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
                            e.title === expense.title &&
                            loaderData.expenses.indexOf(e) >= offset
                        );
                        offset = realIdx + 1;

                        return (
                          <ExpenseCard
                            key={idx}
                            expense={expense}
                            realIdx={realIdx}
                            idx={idx}
                          />
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
        isExpenseSetting={isExpenseSetting}
        onOpenChange={() => setIsExpenseSetting(false)}
      />
    </>
  );
}
