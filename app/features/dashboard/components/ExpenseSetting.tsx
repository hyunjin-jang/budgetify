import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";

export function ExpenseSetting({
  isExpenseSetting,
  onOpenChange,
  expenseList,
  setExpenseList,
}: {
  isExpenseSetting: boolean;
  onOpenChange: () => void;
  expenseList: Record<string, string>[];
  setExpenseList: (expenseList: Record<string, string>[]) => void;
}) {
  const [color, setColor] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSave = () => {
    const expense = {
      color,
      amount,
      date,
      description,
    };
    setExpenseList([expense, ...expenseList]);
    const storageExpenseList = localStorage.getItem("expenseList");
    if (storageExpenseList) {
      localStorage.setItem(
        "expenseList",
        JSON.stringify([...JSON.parse(storageExpenseList), expense])
      );
    } else {
      localStorage.setItem("expenseList", JSON.stringify([expense]));
    }
    onOpenChange();
  };

  return (
    <Dialog open={isExpenseSetting} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>지출금액을 입력해주세요</DialogTitle>
          <DialogDescription>지출의 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="color"
            onChange={(e) => {
              setColor(e.target.value);
            }}
          />
          <Input
            type="text"
            placeholder="지출금액"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
          <Input
            type="date"
            placeholder="지출날짜"
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
          <Input
            type="text"
            placeholder="지출내역"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <Button onClick={handleSave}>저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
