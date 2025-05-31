import { TrashIcon } from "lucide-react";
import IconButton from "~/common/components/iconButton";

type Expense = {
  title: string;
  amount: number;
  date: string;
  category: {
    id: string;
    name: string;
  } | null;
};

type Props = {
  expense: Expense;
  realIdx: number;
  idx: number;
};

export function ExpenseCard({ expense, realIdx, idx }: Props) {
  const handleDeleteExpense = (targetIndex: number) => {
    // const newList = expenseList.filter((_, idx) => idx !== targetIndex);
    // setExpenseList(newList);
    // localStorage.setItem("expenseList", JSON.stringify(newList));
  };

  return (
    <div
      key={`${expense.date}-${expense.title}-${idx}`}
      className="flex justify-between items-start rounded-lg border p-4 bg-card"
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium mb-1 text-primary">
            {expense.category?.name}
          </span>
          <IconButton onClick={() => handleDeleteExpense(realIdx)}>
            <TrashIcon className="w-4 h-4 text-destructive" />
          </IconButton>
        </div>
        <span className="text-sm font-semibold">
          {Number(expense.amount).toLocaleString()}원
        </span>
        <span className="text-sm text-muted-foreground">{expense.title}</span>
      </div>
    </div>
  );
}
