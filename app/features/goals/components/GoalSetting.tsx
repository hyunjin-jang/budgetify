import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import { Calendar } from "~/common/components/ui/calendar";
import { cn } from "~/lib/utils";
import { Form } from "react-router";

type Goal = {
  id: string;
  title: string;
  amount: number;
  startDate: string;
  endDate: string;
  status?: "completed" | "failed";
};

export function GoalSetting({
  open,
  onClose,
  goals,
  setGoals,
}: {
  open: boolean;
  onClose: () => void;
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
}) {
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 제출 막기
    if (!title || !amount || !startDate || !endDate) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const newGoal: Goal = {
      id: uuidv4(),
      title,
      amount: Number(amount),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: undefined,
    };

    setGoals([...goals, newGoal]);
    onClose();
    setTitle("");
    setAmount("");
    setStartDate(new Date());
    setEndDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>목표 설정</DialogTitle>
          <DialogDescription>
            목표 제목, 금액 및 기간을 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            placeholder="예: 일본 여행"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            type="number"
            placeholder="금액 (예: 100000)"
            required
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          {/* 시작일 */}
          <div>
            <label className="text-sm mb-1 text-muted-foreground">시작일</label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStartCalendarOpen(true)}
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "yyyy-MM-dd") : "날짜 선택"}
            </Button>

            <Dialog
              open={startCalendarOpen}
              onOpenChange={setStartCalendarOpen}
            >
              <DialogContent className="w-auto p-0 [&>button]:hidden">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    setStartCalendarOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* 종료일 */}
          <div>
            <label className="text-sm mb-1 text-muted-foreground">종료일</label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEndCalendarOpen(true)}
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "yyyy-MM-dd") : "날짜 선택"}
            </Button>

            <Dialog open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
              <DialogContent className="w-auto p-0 [&>button]:hidden">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    setEndCalendarOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Button type="submit">저장</Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
