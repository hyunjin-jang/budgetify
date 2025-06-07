import { format } from "date-fns";
import { TrashIcon } from "lucide-react";
import IconButton from "~/common/components/iconButton";
import { Button } from "~/common/components/ui/button";
import { cn } from "~/lib/utils";
import { Form } from "react-router";

type Props = {
  id: string;
  title: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: "completed" | "failed" | "scheduled" | "in_progress" | null;
};

export function GoalCard({
  id,
  title,
  amount,
  start_date,
  end_date,
  status,
}: Props) {
  const statusKoreanMap: Record<
    "scheduled" | "in_progress" | "completed" | "failed",
    string
  > = {
    scheduled: "예정",
    in_progress: "진행중",
    completed: "완료",
    failed: "실패",
  };

  function getCardStyleByStatus(
    status: "scheduled" | "in_progress" | "completed" | "failed" | null
  ) {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400";
      case "failed":
        return "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400";
      case "in_progress":
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400";
      case "scheduled":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-400";
      default:
        return "";
    }
  }

  return (
    <div
      key={id}
      className={cn(
        "relative rounded-xl border p-6 shadow-sm transition-all",
        getCardStyleByStatus(status)
      )}
    >
      {/* 삭제 버튼 */}
      <Form method="post">
        <input type="hidden" name="action" value="delete" />
        <input type="hidden" name="goalId" value={id} />
        <IconButton className="absolute top-3 right-3" type="submit">
          <TrashIcon className="w-4 h-4 text-destructive" />
        </IconButton>
      </Form>

      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-2xl font-bold mt-1">{amount.toLocaleString()}원</p>
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(start_date), "yyyy.MM.dd")} ~{" "}
          {format(new Date(end_date), "yyyy.MM.dd")}
        </p>
        <p className="text-sm mt-2">
          상태:{" "}
          <span
            className={cn("font-semibold", {
              "text-green-600 dark:text-green-400": status === "completed",
              "text-red-600 dark:text-red-400": status === "failed",
              "text-blue-600 dark:text-blue-400": status === "in_progress",
              "text-yellow-600 dark:text-yellow-400": status === "scheduled",
            })}
          >
            {status ? statusKoreanMap[status] : "미정"}
          </span>
        </p>

        {status !== "in_progress" ? null : (
          <div className="mt-2 flex gap-2">
            <Form method="post">
              <input type="hidden" name="action" value="updateStatus" />
              <input type="hidden" name="goalId" value={id} />
              <input type="hidden" name="status" value="completed" />
              <Button variant="outline" size="sm" type="submit">
                완료로 설정
              </Button>
            </Form>
            <Form method="post">
              <input type="hidden" name="action" value="updateStatus" />
              <input type="hidden" name="goalId" value={id} />
              <input type="hidden" name="status" value="failed" />
              <Button variant="outline" size="sm" type="submit">
                실패로 설정
              </Button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
