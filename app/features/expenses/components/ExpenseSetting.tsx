import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/common/components/ui/select";
import { Calendar } from "~/common/components/ui/calendar";
import { cn } from "~/lib/utils";

type Props = {
  isExpenseSetting: boolean;
  onOpenChange: () => void;
  expenseList: Record<string, string>[];
  setExpenseList: (expenseList: Record<string, string>[]) => void;
};

const defaultCategories = [
  { label: "식비", value: "식비" },
  { label: "교통", value: "교통" },
  { label: "카페", value: "카페" },
  { label: "쇼핑", value: "쇼핑" },
  { label: "기타", value: "기타" },
];

export function ExpenseSetting({
  isExpenseSetting,
  onOpenChange,
  expenseList,
  setExpenseList,
}: Props) {
  const [categories, setCategories] = useState(defaultCategories);
  const [category, setCategory] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [description, setDescription] = useState<string>("");

  const handleSave = () => {
    if (!date || !category) return;

    const expense = {
      category,
      amount,
      date: format(date, "yyyy-MM-dd"),
      description,
    };

    setExpenseList([expense, ...expenseList]);

    const storageExpenseList = localStorage.getItem("expenseList");
    const newList = storageExpenseList
      ? [...JSON.parse(storageExpenseList), expense]
      : [expense];

    localStorage.setItem("expenseList", JSON.stringify(newList));

    onOpenChange();
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const newCat = { label: newCategory, value: newCategory };
    setCategories((prev) => [...prev, newCat]);
    setCategory(newCategory);
    setNewCategory("");
  };

  const handleRemoveCategory = (value: string) => {
    setCategories((prev) => prev.filter((cat) => cat.value !== value));
    if (category === value) setCategory("");
  };

  return (
    <Dialog open={isExpenseSetting} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>지출금액을 입력해주세요</DialogTitle>
          <DialogDescription>지출의 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <div
                    key={cat.value}
                    className="flex items-center justify-between px-2"
                  >
                    <SelectItem value={cat.value} className="flex-1">
                      {cat.label}
                    </SelectItem>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCategory(cat.value)}
                    >
                      <Trash2Icon className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={newCategory}
              placeholder="새 카테고리 추가"
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button type="button" size="icon" onClick={handleAddCategory}>
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>

          <Input
            type="text"
            placeholder="지출금액"
            onChange={(e) => setAmount(e.target.value)}
          />

          <div>
            <label className="text-sm mb-1 text-muted-foreground">
              지출날짜
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCalendarOpen(true)}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "yyyy-MM-dd") : "날짜 선택"}
            </Button>

            <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
              <DialogContent className="w-auto p-0 [&>button]:hidden">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                    setCalendarOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Input
            type="text"
            placeholder="지출내용"
            multiple
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={handleSave}>저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
