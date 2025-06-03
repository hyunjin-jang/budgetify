import { Button } from "~/common/components/ui/button";
import { BudgetSetting } from "../components/BudgetSetting";
import { useEffect, useState } from "react";
import type { MetaFunction } from "react-router";
import { getBudget, getBudgetAllocations, getFixedExpenses } from "../queries";
import type { Route } from "./+types/budget-page";
import { makeSSRClient } from "~/supa-client";

type Budget = {
  id: string;
  year: number;
  month: number;
  total_amount: number;
  setting_method: "amount" | "income_based";
  level: "basic" | "intermediate" | "advanced";
};

export const meta: MetaFunction = () => [{ title: "머니도비 예산 설정" }];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const budgets = await getBudget(
    client,
    "376adda7-64d1-4eb0-a962-2465dbc9f2cb"
  );
  const fixedExpenses = await getFixedExpenses(
    client,
    "f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c"
  );
  const budgetAllocations = await getBudgetAllocations(
    client,
    "f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c"
  );
  return { budgets, fixedExpenses, budgetAllocations, headers };
};

export default function BudgetPage({ loaderData }: Route.ComponentProps) {
  const { budgets, fixedExpenses, budgetAllocations } = loaderData;
  const [isBudgetSetting, setIsBudgetSetting] = useState(false);

  return (
    <>
      <div className="space-y-8">
        {/* 예산 설정 버튼 */}
        <div className="flex justify-end">
          <Button onClick={() => setIsBudgetSetting(true)}>예산 설정</Button>
        </div>

        {/* 예산 정보 */}
        <section className="space-y-6">
          <h1 className="text-2xl font-bold">이번달 설정중인 예산</h1>

          {/* 예산 설정 방법 */}
          <div className="rounded-lg border p-4 shadow-sm bg-muted/10">
            <h3 className="text-xl font-semibold mb-2">예산 설정 방법</h3>
            <p className="text-muted-foreground">
              {budgets.find(
                (budget) => budget.month === new Date().getMonth() + 1
              )?.setting_method === "amount"
                ? "금액으로 설정"
                : "수입 기준으로 설정"}
            </p>
          </div>

          {/* 금액 혹은 수입 설정 */}
          <div className="rounded-lg border p-4 shadow-sm bg-muted/10">
            <h3 className="text-xl font-semibold mb-2">금액 혹은 수입</h3>
            <ul className="space-y-1">
              <li className="flex justify-between">
                <span className="text-muted-foreground">금액</span>
                <span className="font-medium">
                  {budgets
                    .find(
                      (budget) => budget.month === new Date().getMonth() + 1
                    )
                    ?.total_amount.toLocaleString()}
                  원
                </span>
              </li>
            </ul>
          </div>

          {/* 고정 비용 */}
          <div className="rounded-lg border p-4 shadow-sm bg-muted/10">
            <h3 className="text-xl font-semibold mb-2">고정 비용</h3>
            <ul className="space-y-1">
              {fixedExpenses.map((expense) => (
                <li key={expense.id} className="flex justify-between">
                  <span className="text-muted-foreground">{expense.title}</span>
                  <span className="font-medium">
                    {expense.amount.toLocaleString()}원
                  </span>
                </li>
              ))}
              {/* <li className="flex justify-between">
                <span className="text-muted-foreground">공과금</span>
                <span className="font-medium">200,000원</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">식비</span>
                <span className="font-medium">300,000원</span>
              </li> */}
            </ul>
          </div>

          {/* 예산 금액 */}
          <div className="rounded-lg border p-4 shadow-sm bg-muted/10">
            <h3 className="text-xl font-semibold mb-2">예산 금액</h3>
            <p className="font-bold text-lg">
              {budgets
                .find((budget) => budget.month === new Date().getMonth() + 1)
                ?.total_amount.toLocaleString()}
              원
            </p>
          </div>

          {/* 예산 수준 */}
          <div className="rounded-lg border p-4 shadow-sm bg-muted/10">
            <div className="flex flex-row gap-2 mb-4">
              <h3 className="text-xl font-semibold">예산 수준</h3>
              <p className="text-muted-foreground text-sm">
                {budgets.find(
                  (budget) => budget.month === new Date().getMonth() + 1
                )?.level === "basic"
                  ? "초급"
                  : budgets.find(
                      (budget) => budget.month === new Date().getMonth() + 1
                    )?.level === "intermediate"
                  ? "중급"
                  : "고급"}
              </p>
            </div>

            <div className="space-y-1">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                {budgetAllocations.map((allocation) => (
                  <li key={allocation.id} className="flex justify-between">
                    <span>{allocation.category}</span>
                    <span>{allocation.amount.toLocaleString()}원</span>
                  </li>
                ))}
                {/* <li className="flex justify-between">
                  <span>쇼핑</span>
                  <span>100,000원</span>
                </li>
                <li className="flex justify-between">
                  <span>교통</span>
                  <span>100,000원</span>
                </li>
                <li className="flex justify-between">
                  <span>문화</span>
                  <span>100,000원</span>
                </li>
                <li className="flex justify-between">
                  <span>기타</span>
                  <span>100,000원</span>
                </li> */}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* 예산 설정 모달 */}
      <BudgetSetting
        isBudgetSetting={isBudgetSetting}
        onOpenChange={() => setIsBudgetSetting(false)}
      />
    </>
  );
}
