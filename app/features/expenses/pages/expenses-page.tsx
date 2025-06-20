import { useState, Suspense } from "react";
import { ExpenseSetting, formSchema } from "../components/ExpenseSetting";
import { Button } from "~/common/components/ui/button";
import type { MetaFunction } from "react-router";
import { format, addMonths, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { getExpenseCategories, getExpenses } from "../queries";
import type { Route } from "./+types/expenses-page";
import { ExpenseCard } from "../components/ExpenseCard";
import { makeSSRClient } from "~/supa-client";
import { getLoggedIsUserId } from "~/features/settings/queries";
import { createExpense, deleteExpense } from "../mutations";
import { toast } from "sonner";
import { Await, useLoaderData } from "react-router";
import type { Database } from "database.types";

// 타입 정의
type Expense = Database["public"]["Tables"]["expenses"]["Row"] & {
  category: Database["public"]["Tables"]["expense_categories"]["Row"] | null;
};

type ExpenseCategory =
  Database["public"]["Tables"]["expense_categories"]["Row"];

export const meta: MetaFunction = () => {
  return [{ title: "머니도비 지출 설정" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedIsUserId(client);
  const expensesPromise = getExpenses(client, userId);
  const categoriesPromise = getExpenseCategories(client, userId);
  return {
    expenses: expensesPromise,
    categories: categoriesPromise,
  };
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

// 로딩 상태 컴포넌트
function ExpensesLoading() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-muted-foreground">지출 내역을 불러오는 중...</div>
    </div>
  );
}

// 에러 상태 컴포넌트
function ExpensesError({ error }: { error: Error }) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-destructive">
        지출 내역을 불러오는데 실패했습니다: {error.message}
      </div>
    </div>
  );
}

// 지출 목록을 렌더링하는 컴포넌트
function ExpensesList({
  expenses,
  categories,
}: {
  expenses: Expense[];
  categories: ExpenseCategory[];
}) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const groupedByMonth = expenses.reduce((acc, expense) => {
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
    <div className="flex flex-col gap-6">
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
                      const realIdx = expenses.findIndex(
                        (e) =>
                          e.date === expense.date &&
                          e.amount === expense.amount &&
                          e.category?.id === expense.category?.id &&
                          e.description === expense.description &&
                          expenses.indexOf(e) >= offset
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
  );
}

export default function ExpensesPage() {
  const { expenses, categories } = useLoaderData() as {
    expenses: Promise<Expense[]>;
    categories: Promise<ExpenseCategory[]>;
  };
  const [isExpenseSetting, setIsExpenseSetting] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">오늘의 지출</h2>
        <Button onClick={() => setIsExpenseSetting(true)}>지출 추가</Button>
      </div>

      <Suspense fallback={<ExpensesLoading />}>
        <Await
          resolve={Promise.all([expenses, categories])}
          errorElement={<ExpensesError error={new Error("지출 로딩 실패")} />}
        >
          {([resolvedExpenses, resolvedCategories]) => (
            <>
              <ExpensesList
                expenses={resolvedExpenses}
                categories={resolvedCategories}
              />

              <ExpenseSetting
                categories={resolvedCategories.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
                isExpenseSetting={isExpenseSetting}
                onOpenChange={() => setIsExpenseSetting(false)}
              />
            </>
          )}
        </Await>
      </Suspense>
    </>
  );
}
