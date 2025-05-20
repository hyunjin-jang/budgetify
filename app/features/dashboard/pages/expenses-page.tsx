import { useEffect, useState } from "react";
import { ExpenseSetting } from "../components/ExpenseSetting";
import { Button } from "~/common/components/ui/button";

export default function ExpensePage() {
  const [isExpenseSetting, setIsExpenseSetting] = useState<boolean>(false);
  const [expenseList, setExpenseList] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    const expenseList = localStorage.getItem("expenseList");

    if (expenseList) {
      setExpenseList(
        JSON.parse(expenseList).sort(
          (a: Record<string, string>, b: Record<string, string>) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold">오늘의 지출</h2>
          <Button variant="outline" onClick={() => setIsExpenseSetting(true)}>
            오늘의 지출 추가
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {expenseList.map((expense) => (
            <div
              key={expense.date}
              className="flex flex-col gap-2 border-2 border-gray-300 p-4 rounded-lg"
            >
              <div className="flex flex-col gap-2">
                <p
                  className="border-b-2 p-2"
                  style={{ borderColor: expense.color }}
                >
                  {expense.description}
                </p>
                <p>{expense.amount} 원</p>
              </div>
              <p className="text-sm text-gray-500">{expense.date}</p>
            </div>
          ))}
        </div>
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
