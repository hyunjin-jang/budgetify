import { useState } from "react";
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
import z from "zod";

export const formSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  amount: z.number().min(1, "금액을 입력해주세요"),
  startDate: z.date(),
  endDate: z.date(),
});

export function GoalSetting({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>목표 설정</DialogTitle>
          <DialogDescription>
            목표 제목, 금액 및 기간을 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <Form
          className="flex flex-col gap-4"
          method="post"
          onSubmit={() => onClose()}
        >
          <input type="hidden" name="action" value="create" />
          <Input id="title" name="title" required placeholder="예: 일본 여행" />

          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="금액 (예: 100000)"
            required
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
            <input
              type="hidden"
              name="startDate"
              value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
            />

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
            <input
              type="hidden"
              name="endDate"
              value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
            />

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
