import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import { GoalSetting } from "../components/GoalSetting";
import type { MetaFunction } from "react-router";
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import { TrashIcon } from "lucide-react"; // ❗️삭제 아이콘 추가
import IconButton from "~/common/components/iconButton";

export const meta: MetaFunction = () => {
  return [
    { title: "Budgetify 적합 규모 구성" },
    { name: "description", content: "Budgetify 목표 설정" },
  ];
};

type GoalStatus = "upcoming" | "in_progress" | "completed" | "failed";

type Goal = {
  id: string;
  title: string;
  amount: number;
  startDate: string;
  endDate: string;
  status?: "completed" | "failed";
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [openGoalSetting, setOpenGoalSetting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<GoalStatus | "all">("all");

  function getGoalStatus(goal: Goal): GoalStatus {
    const now = new Date();
    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);

    if (goal.status === "completed") return "completed";
    if (goal.status === "failed") return "failed";
    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "in_progress";
    return "in_progress";
  }

  function getCardStyleByStatus(status: GoalStatus) {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400";
      case "failed":
        return "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400";
      case "in_progress":
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400";
      case "upcoming":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-400";
      default:
        return "";
    }
  }

  const statusKoreanMap: Record<GoalStatus, string> = {
    upcoming: "예정",
    in_progress: "진행중",
    completed: "완료",
    failed: "실패",
  };

  const handleStatusChange = (id: string, status: "completed" | "failed") => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, status } : goal))
    );
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const filteredGoals =
    activeFilter === "all"
      ? goals
      : goals.filter((goal) => getGoalStatus(goal) === activeFilter);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">내 목표</h1>
        <Button onClick={() => setOpenGoalSetting(true)}>목표 추가</Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all", label: "전체" },
          { key: "upcoming", label: "예정" },
          { key: "in_progress", label: "진행중" },
          { key: "completed", label: "완료" },
          { key: "failed", label: "실패" },
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={activeFilter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(key as GoalStatus | "all")}
          >
            {label}
          </Button>
        ))}
      </div>

      {filteredGoals.length === 0 ? (
        <div className="text-muted-foreground text-sm">
          선택한 조건에 해당하는 목표가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => {
            const status = getGoalStatus(goal);
            return (
              <div
                key={goal.id}
                className={cn(
                  "relative rounded-xl border p-6 shadow-sm transition-all",
                  getCardStyleByStatus(status)
                )}
              >
                {/* 삭제 버튼 */}
                <IconButton
                  className="absolute top-3 right-3"
                  onClick={() => handleDeleteGoal(goal.id)}
                >
                  <TrashIcon className="w-4 h-4 text-destructive" />
                </IconButton>

                <div>
                  <h2 className="text-base font-semibold">{goal.title}</h2>
                  <p className="text-2xl font-bold mt-1">
                    {goal.amount.toLocaleString()}원
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(goal.startDate), "yyyy.MM.dd")} ~{" "}
                    {format(new Date(goal.endDate), "yyyy.MM.dd")}
                  </p>
                  <p className="text-sm mt-2">
                    상태:{" "}
                    <span
                      className={cn("font-semibold", {
                        "text-green-600 dark:text-green-400":
                          status === "completed",
                        "text-red-600 dark:text-red-400": status === "failed",
                        "text-blue-600 dark:text-blue-400":
                          status === "in_progress",
                        "text-yellow-600 dark:text-yellow-400":
                          status === "upcoming",
                      })}
                    >
                      {statusKoreanMap[status]}
                    </span>
                  </p>

                  {status === "completed" || status === "failed" ? null : (
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(goal.id, "completed")}
                      >
                        완료로 설정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(goal.id, "failed")}
                      >
                        실패로 설정
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GoalSetting
        open={openGoalSetting}
        onClose={() => setOpenGoalSetting(false)}
        goals={goals}
        setGoals={setGoals}
      />
    </>
  );
}
