import { useState, Suspense } from "react";
import { Button } from "~/common/components/ui/button";
import { formSchema, GoalSetting } from "../components/GoalSetting";
import { type MetaFunction } from "react-router";
import { getGoals } from "../queries";
import type { Route } from "./+types/goals-page";
import { GoalCard } from "../components/GoalCard";
import { makeSSRClient } from "~/supa-client";
import { getLoggedIsUserId } from "~/features/settings/queries";
import { createGoal, deleteGoal, updateGoalStatus } from "../mutations";
import { toast } from "sonner";
import { Await, useLoaderData } from "react-router";
import type { Database } from "database.types";

// Goal 타입 정의
type Goal = Database["public"]["Tables"]["goals"]["Row"];

export const meta: MetaFunction = () => {
  return [{ title: "머니도비 적합 규모 구성" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedIsUserId(client);
  const goalsPromise = getGoals(client, userId);
  return { goals: goalsPromise };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedIsUserId(client);

  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "create") {
    const { success, data, error } = formSchema.safeParse({
      ...Object.fromEntries(formData),
      amount: Number(formData.get("amount")),
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
    });

    if (!success) {
      return {
        goalError: null,
        formErrors: error.flatten().fieldErrors,
      };
    }
    try {
      await createGoal(client, { ...data, userId });
      toast.success("목표가 생성되었습니다.");
    } catch (error) {
      console.log(error);
      toast.error("목표 생성에 실패했습니다.");
    }
  } else if (action === "updateStatus") {
    const goalId = formData.get("goalId");
    const status = formData.get("status");
    try {
      await updateGoalStatus(
        client,
        goalId as string,
        status as "completed" | "failed"
      );
      toast.success("목표 상태가 변경되었습니다.");
    } catch (error) {
      toast.error("목표 상태 변경에 실패했습니다.");
    }
  } else if (action === "delete") {
    const goalId = formData.get("goalId");
    try {
      await deleteGoal(client, goalId as string);
      toast.success("목표가 삭제되었습니다.");
    } catch (error) {
      toast.error("목표 삭제에 실패했습니다.");
    }
  }
  return null;
};

type GoalStatus = "scheduled" | "in_progress" | "completed" | "failed";

// 목표 목록을 렌더링하는 컴포넌트
function GoalsList({ goals }: { goals: Goal[] }) {
  const [activeFilter, setActiveFilter] = useState<GoalStatus | "all">("all");

  const filteredGoals =
    activeFilter === "all"
      ? goals
      : goals.filter((goal) => goal.status === activeFilter);

  return (
    <>
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
    </>
  );
}

// 로딩 상태 컴포넌트
function GoalsLoading() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-muted-foreground">목표를 불러오는 중...</div>
    </div>
  );
}

// 에러 상태 컴포넌트
function GoalsError({ error }: { error: Error }) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-destructive">
        목표를 불러오는데 실패했습니다: {error.message}
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const { goals } = useLoaderData() as { goals: Promise<Goal[]> };
  const [openGoalSetting, setOpenGoalSetting] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">내 목표</h1>
        <Button onClick={() => setOpenGoalSetting(true)}>목표 추가</Button>
      </div>

      <Suspense fallback={<GoalsLoading />}>
        <Await
          resolve={goals}
          errorElement={<GoalsError error={new Error("목표 로딩 실패")} />}
        >
          {(resolvedGoals) => <GoalsList goals={resolvedGoals} />}
        </Await>
      </Suspense>

      <GoalSetting
        open={openGoalSetting}
        onClose={() => setOpenGoalSetting(false)}
      />
    </>
  );
}
