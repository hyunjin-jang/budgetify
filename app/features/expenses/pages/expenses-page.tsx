import { useEffect, useState } from "react";
import { ExpenseSetting } from "../components/ExpenseSetting";
import { Button } from "~/common/components/ui/button";
import type { MetaFunction } from "react-router";
import { format, addMonths, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { TrashIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import IconButton from "~/common/components/iconButton";

export const meta: MetaFunction = () => {
  return [
    { title: "Budgetify 지출 설정" },
    { name: "description", content: "Budgetify 지출 설정" },
  ];
};

export default function ExpensesPage() {
  const [isExpenseSetting, setIsExpenseSetting] = useState(false);
  const [expenseList, setExpenseList] = useState<Record<string, string>[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    const stored = localStorage.getItem("expenseList");
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.sort(
        (a: Record<string, string>, b: Record<string, string>) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setExpenseList(parsed);
    }
  }, []);

  const handleDeleteExpense = (targetIndex: number) => {
    const newList = expenseList.filter((_, idx) => idx !== targetIndex);
    setExpenseList(newList);
    localStorage.setItem("expenseList", JSON.stringify(newList));
  };

  const groupedByMonth = expenseList.reduce((acc, expense) => {
    const monthKey = format(new Date(expense.date), "yyyy년 M월");
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(expense);
    return acc;
  }, {} as Record<string, Record<string, string>[]>);

  const selectedMonthKey = format(selectedMonth, "yyyy년 M월");
  const selectedExpenses = groupedByMonth[selectedMonthKey] || [];

  const groupedByDate = selectedExpenses.reduce((acc, expense) => {
    const dateKey = format(new Date(expense.date), "yyyy-MM-dd (eee)", {
      locale: ko,
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(expense);
    return acc;
  }, {} as Record<string, Record<string, string>[]>);

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
                        const realIdx = expenseList.findIndex(
                          (e) =>
                            e.date === expense.date &&
                            e.amount === expense.amount &&
                            e.category === expense.category &&
                            e.description === expense.description &&
                            expenseList.indexOf(e) >= offset
                        );
                        offset = realIdx + 1;

                        return (
                          <div
                            key={`${expense.date}-${expense.description}-${idx}`}
                            className="flex justify-between items-start rounded-lg border p-4 bg-card"
                          >
                            <div className="flex flex-col w-full">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium mb-1 text-primary">
                                  {expense.category}
                                </span>
                                <IconButton
                                  onClick={() => handleDeleteExpense(realIdx)}
                                >
                                  <TrashIcon className="w-4 h-4 text-destructive" />
                                </IconButton>
                              </div>
                              <span className="text-sm font-semibold">
                                {Number(expense.amount).toLocaleString()}원
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {expense.description}
                              </span>
                            </div>
                          </div>
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
        expenseList={expenseList}
        setExpenseList={setExpenseList}
      />
    </>
  );
}
