import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  subMonths,
  addMonths,
} from "date-fns";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InboxIcon,
  TagIcon,
} from "lucide-react";
import IconButton from "./iconButton";
import { useState } from "react";
import { cn } from "~/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/common/components/ui/dialog";

type Expense = {
  category: string;
  amount: number;
};

type Props = {
  currentDate: Date;
  expensesByDate: Record<string, Expense[]>;
};

export default function Calendar({ expensesByDate, currentDate }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // const [date, setDate] = useState<Date>(currentDate);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const firstDayOfWeek = getDay(days[0]);
  const paddedDays = Array(firstDayOfWeek).fill(null).concat(days);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7));
  }

  const handleDateClick = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    setSelectedDate(dateStr);
    setModalOpen(true);
  };

  return (
    <div className="w-full">
      {/* 모달 */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm max-h-[75vh] rounded-xl p-6 overflow-hidden">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-lg font-bold text-primary flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5" />
              {selectedDate
                ? format(new Date(selectedDate), "yyyy년 M월 d일 지출 내역")
                : "지출 내역"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
            {selectedDate && (expensesByDate[selectedDate] || []).length > 0 ? (
              <ul className="divide-y divide-muted border border-muted rounded-md overflow-hidden bg-muted/20">
                {expensesByDate[selectedDate]!.map((e, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center px-4 py-3 text-sm"
                  >
                    <div className="text-muted-foreground flex items-center gap-2">
                      <TagIcon className="w-4 h-4 text-muted-foreground" />
                      {e.category}
                    </div>
                    <div className="font-semibold text-right text-foreground">
                      {e.amount.toLocaleString()}원
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center text-sm text-muted-foreground py-10">
                <InboxIcon className="w-8 h-8 mb-2 text-muted" />
                지출 내역이 없습니다.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <table className="w-full table-fixed border-collapse text-sm text-center">
        <thead className="text-gray-500">
          <tr>
            <th>sun</th>
            <th>mon</th>
            <th>tue</th>
            <th>wed</th>
            <th>thu</th>
            <th>fri</th>
            <th>sat</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => (
                <td
                  key={di}
                  className="h-28 align-top p-1 text-left border cursor-pointer"
                  onClick={() => day && handleDateClick(day)}
                >
                  {day && (
                    <div className="h-full flex flex-col text-xs">
                      {/* 날짜 */}
                      <div className="text-center text-gray-100 font-semibold ">
                        {format(day, "d")}
                      </div>

                      {/* ✅ 고정 높이 + 내부 스크롤 */}
                      <div className="flex-1 overflow-y-auto max-h-[4.6rem] space-y-1 mt-1 pr-1 scrollbar-thin">
                        {(expensesByDate[format(day, "yyyy-MM-dd")] || []).map(
                          (e, i) => (
                            <div
                              key={i}
                              className="text-[10px] text-gray-400 truncate"
                            >
                              • {e.category}: {e.amount.toLocaleString()}원
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
