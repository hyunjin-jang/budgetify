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
import { Form } from "react-router";
import z from "zod";

type Props = {
  categories: Record<string, string>[];
  isExpenseSetting: boolean;
  onOpenChange: () => void;
};

export const formSchema = z.object({
  category: z.string().min(1, "카테고리를 선택해주세요"),
  amount: z.number().min(1, "금액을 입력해주세요"),
  date: z.date(),
  description: z.string().min(1, "지출내용을 입력해주세요"),
});

export function ExpenseSetting({
  categories: initialCategories,
  isExpenseSetting,
  onOpenChange,
}: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  // const handleAddCategory = () => {
  //   if (!newCategory.trim()) return;
  //   const newCat = { label: newCategory, value: newCategory };
  //   setCategories((prev) => [...prev, newCat]);
  //   setCategory(newCategory);
  //   setNewCategory("");
  // };

  // const handleRemoveCategory = (value: string) => {
  //   setCategories((prev) => prev.filter((cat) => cat.value !== value));
  //   if (category === value) setCategory("");
  // };

  return (
    <Dialog open={isExpenseSetting} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>지출금액을 입력해주세요</DialogTitle>
          <DialogDescription>지출의 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        {/* <div className="flex items-center gap-2">
          <Input
            type="text"
            value={newCategory}
            placeholder="새 카테고리 추가"
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button type="button" size="icon" onClick={handleAddCategory}>
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div> */}
        <Form
          className="flex flex-col gap-4"
          method="post"
          onSubmit={onOpenChange}
        >
          <input type="hidden" name="action" value="create" />
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
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCategory(cat.value)}
                    >
                      <Trash2Icon className="w-3 h-3 text-destructive" />
                    </Button> */}
                  </div>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="category" value={category} />
          </div>

          <Input type="number" placeholder="지출금액" name="amount" />

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
            <input
              type="hidden"
              name="date"
              value={date ? format(date, "yyyy-MM-dd") : ""}
            />

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
            name="description"
          />
          <Button type="submit">저장</Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
