import { TrashIcon } from "lucide-react";
import { Form } from "react-router";
import IconButton from "~/common/components/iconButton";
import type { Database } from "database.types";

type Expense = Database["public"]["Tables"]["expenses"]["Row"] & {
  category: Database["public"]["Tables"]["expense_categories"]["Row"] | null;
};

type Props = {
  expense: Expense;
  idx: number;
};

export function ExpenseCard({ expense, idx }: Props) {
  return (
    <div
      key={`${expense.date}-${expense.description}-${idx}`}
      className="flex justify-between items-start rounded-lg border p-4 bg-card"
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium mb-1 text-primary">
            {expense.category?.name}
          </span>

          <Form method="post">
            <input type="hidden" name="action" value="delete" />
            <input type="hidden" name="expenseId" value={expense.id} />
            <IconButton type="submit">
              <TrashIcon className="w-4 h-4 text-destructive" />
            </IconButton>
          </Form>
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
}
