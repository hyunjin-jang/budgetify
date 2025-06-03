import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import { GoalSetting } from "../components/GoalSetting";
import type { MetaFunction } from "react-router";
import { getGoals } from "../queries";
import type { Route } from "./+types/goals-page";
import { GoalCard } from "../components/GoalCard";
import { makeSSRClient } from "~/supa-client";

export const meta: MetaFunction = () => {
  return [{ title: "머니도비 적합 규모 구성" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const goals = await getGoals(client, "376adda7-64d1-4eb0-a962-2465dbc9f2cb");
  return { goals };
};

type GoalStatus = "scheduled" | "in_progress" | "completed" | "failed";

export default function GoalsPage({ loaderData }: Route.ComponentProps) {
  const [openGoalSetting, setOpenGoalSetting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<GoalStatus | "all">("all");

  const filteredGoals =
    activeFilter === "all"
      ? loaderData.goals
      : loaderData.goals.filter((goal) => goal.status === activeFilter);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">내 목표</h1>
        <Button onClick={() => setOpenGoalSetting(true)}>목표 추가</Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all", label: "전체" },
          { key: "scheduled", label: "예정" },
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
            return <GoalCard key={goal.id} {...goal} />;
          })}
        </div>
      )}

      <GoalSetting
        open={openGoalSetting}
        onClose={() => setOpenGoalSetting(false)}
        goal={loaderData.goals[0]}
      />
    </>
  );
}
