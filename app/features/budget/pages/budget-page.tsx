import { Button } from "~/common/components/ui/button";
import { BudgetSetting, formSchema } from "../components/BudgetSetting";
import { useEffect, useMemo, useState } from "react";
import { Form, type MetaFunction } from "react-router";
import {
  getBudget,
  getBudgetAllocations,
  getBudgetRecommendation,
  getFixedExpenses,
  getIncomes,
} from "../queries";
import type { Route } from "./+types/budget-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedIsUserId } from "~/features/settings/queries";
import {
  createBudget,
  createBudgetRecommendation,
  updateBudget,
} from "../mutations";
import { GoogleGenAI } from "@google/genai";
import { Sparkles, CheckCircle } from "lucide-react";
import { monthlyBudgetPrompt } from "../prompt";
import { extractRecommendations } from "../utils";

export const meta: MetaFunction = () => [{ title: "머니도비 예산 설정" }];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const apiKey = process.env.GOOGLE_API_KEY;
  const userId = await getLoggedIsUserId(client);
  const date = new Date();
  const budget = await getBudget(client, userId, date);

  let fixedExpenses = null;
  let incomes = null;
  let budgetRecommendation = null;
  let budgetAllocations = null;

  if (budget) {
    fixedExpenses = await getFixedExpenses(client, budget.id);
    incomes = await getIncomes(client, budget.id);
    budgetRecommendation = await getBudgetRecommendation(client, userId);

    if (budgetRecommendation) {
      budgetAllocations = await getBudgetAllocations(
        client,
        budgetRecommendation.id
      );
    }
  }

  return {
    headers,
    apiKey,
    budget,
    fixedExpenses,
    incomes,
    budgetRecommendation,
    budgetAllocations,
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  try {
    const { client } = makeSSRClient(request);
    const userId = await getLoggedIsUserId(client);
    const formData = await request.formData();
    const action = formData.get("action");
    const budget = await getBudget(client, userId, new Date());

    if (action === "create") {
      const formEntries = Object.fromEntries(formData.entries());

      const parsedData = {
        ...formEntries,
        totalAmount: Number(formEntries.totalAmount),
        fixedCost: formEntries.fixedCost
          ? JSON.parse(formEntries.fixedCost as string)
          : [],
        income: formEntries.income
          ? JSON.parse(formEntries.income as string)
          : [],
      };

      const { success, data, error } = formSchema.safeParse(parsedData);

      if (!success) {
        return error.message;
      }

      if (budget) {
        await updateBudget(client, {
          id: budget.id,
          settingMethod: data.settingMethod,
          totalAmount: data.totalAmount,
          fixedCost: data.fixedCost,
          income: data.income,
          userId,
        });
      } else {
        await createBudget(client, {
          settingMethod: data.settingMethod,
          totalAmount: data.totalAmount,
          fixedCost: data.fixedCost,
          income: data.income,
          userId,
        });
      }

      return;
    } else if (action === "budget-apply") {
      const recommendation = JSON.parse(
        formData.get("recommendation") as string
      );
      if (budget) {
        await createBudgetRecommendation(
          client,
          userId,
          budget.id,
          recommendation
        );
      }
    }
  } catch (error) {
    console.error("Action error:", error);
    return { error: "예산 적용 중 오류가 발생했습니다." };
  }
};

export default function BudgetPage({ loaderData }: Route.ComponentProps) {
  const {
    budgetRecommendation,
    budgetAllocations,
    fixedExpenses,
    budget,
    incomes,
    apiKey,
  } = loaderData;
  const [isBudgetSetting, setIsBudgetSetting] = useState(false);
  const [monthlyRecommendations, setMonthlyRecommendations] = useState<any[]>(
    []
  );
  const [selectedMonthly, setSelectedMonthly] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const budgetSettingMethod = useMemo(() => {
    switch (budget?.setting_method) {
      case "amount":
        return "금액으로 설정";
      case "income_based":
        return "수입 기준으로 설정";
    }
  }, [budget?.setting_method]);

  const ai = new GoogleGenAI({ apiKey });

  const availableAmount =
    (budget?.total_amount ?? 0) -
    (fixedExpenses?.reduce((sum, item) => sum + item.amount, 0) ?? 0);

  useEffect(() => {
    if (!budgetRecommendation && budget) {
      setIsLoading(true);
      (async () => {
        const monthlyResponse = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: monthlyBudgetPrompt(
            availableAmount,
            budget,
            fixedExpenses,
            "monthly"
          ),
        });
        const monthlyRecs = extractRecommendations(
          monthlyResponse.text ?? "",
          "monthly"
        );
        setMonthlyRecommendations(monthlyRecs);
        setSelectedMonthly(null);
        setIsLoading(false);
      })();
    }
  }, [budgetRecommendation, budget]);

  return (
    <div>
      <div className="space-y-8">
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">이번달 예산 현황</h1>
            <p className="text-muted-foreground mt-1">
              {budgetSettingMethod}
              {/* • {budgetLevel} 수준 */}
            </p>
          </div>
          {/* <Button onClick={() => setIsBudgetSetting(true)} size="lg">
            {budget ? "예산 설정 변경" : "예산 설정"}
          </Button> */}
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 총 예산 카드 */}
          <div className="col-span-1 md:col-span-2 rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">총 예산</h3>
            <p className="text-3xl font-bold">
              {budget?.total_amount.toLocaleString() ?? 0}원
            </p>
          </div>

          {/* 고정 비용 카드 */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">고정 비용</h3>
            <div className="space-y-3">
              {fixedExpenses && fixedExpenses.length > 0 ? (
                fixedExpenses?.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <span className="text-muted-foreground">
                      {expense.title}
                    </span>
                    <span className="font-medium">
                      {expense.amount.toLocaleString()}원
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  등록된 고정 비용이 없습니다.
                </p>
              )}
            </div>
          </div>

          {/* 수입 내역 카드 */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">수입 내역</h3>
            <div className="space-y-3">
              {incomes && incomes.length > 0 ? (
                incomes.map((income, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <span className="text-muted-foreground">
                      {income.title}
                    </span>
                    <span className="font-medium">
                      {income.amount.toLocaleString()}원
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  등록된 수입이 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 월간 예산 추천 or 적용된 예산 */}
      <div className="mt-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-400" />
          월간 예산 {!!budgetRecommendation ? "적용 내역" : "AI 추천"}
        </h2>
        {!budget ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Sparkles className="w-16 h-16 text-blue-400 mx-auto" />
              <h3 className="text-xl font-semibold text-white">
                예산을 설정하면 AI 추천이 나옵니다
              </h3>
              <p className="text-gray-500 max-w-md">
                먼저 예산을 설정해주세요. 설정한 예산을 바탕으로 AI가 맞춤형
                예산 추천을 제공해드립니다.
              </p>
              <Button
                onClick={() => setIsBudgetSetting(true)}
                size="lg"
                className="mt-4"
              >
                예산 설정하기
              </Button>
            </div>
          </div>
        ) : !!budgetRecommendation ? (
          <div className="rounded-xl border bg-card p-6 shadow-sm mx-auto">
            <div className="font-bold text-lg mb-2">
              {budgetRecommendation.title}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {budgetRecommendation.description}
            </p>
            <ul className="space-y-2">
              {Array.isArray(budgetAllocations) &&
              budgetAllocations.length > 0 ? (
                budgetAllocations.map((item: any, i: number) => (
                  <li
                    key={i}
                    className="flex justify-between items-center py-2 rounded-lg"
                  >
                    <span className="font-medium">{item.category}</span>
                    <span className="font-semibold text-blue-600">
                      {item.amount.toLocaleString()}원
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">
                  적용된 예산 내역이 없습니다.
                </li>
              )}
            </ul>
            <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm">
              <div className="space-y-1">
                <div className="text-gray-600">
                  <span className="font-semibold text-blue-700">절약</span>:{" "}
                  {budgetRecommendation?.savings?.toLocaleString() ?? 0}원
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold text-blue-700">절약률</span>:{" "}
                  {budgetRecommendation?.saving_ratio ?? 0}%
                </div>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mb-4"></div>
            <p className="text-gray-500">AI가 예산 추천을 생성 중입니다...</p>
          </div>
        ) : (
          <Form method="post" id="budget-form">
            <input type="hidden" name="action" value="budget-apply" />
            <input
              type="hidden"
              name="recommendation"
              value={JSON.stringify(
                monthlyRecommendations[selectedMonthly ?? 0]
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {monthlyRecommendations.map((rec, idx) => {
                const isSelected = selectedMonthly === idx;
                return (
                  <div
                    key={idx}
                    className={`
                      group relative rounded-xl border shadow-sm cursor-pointer
                      transition-all duration-300 ease-in-out
                      px-4 py-3
                      ${
                        isSelected
                          ? "border-blue-500 ring-2 ring-blue-200 shadow-lg z-10"
                          : "border-gray-200 hover:border-blue-300"
                      }
                      hover:shadow-md
                    `}
                    style={{
                      transform: isSelected ? "scale(1.04)" : "scale(1)",
                    }}
                    onClick={() => setSelectedMonthly(idx)}
                  >
                    <div className="absolute -top-3 left-4 bg-white rounded-full px-2 py-1 shadow text-xs font-semibold text-blue-500 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      {rec.label}
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-blue-500">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    )}
                    <div className="mt-4 mb-1 font-bold text-base text-blue-700">
                      {rec.title}
                    </div>
                    <div className="mb-3 text-xs text-gray-500">
                      {rec.description}
                    </div>
                    <ul className="space-y-1">
                      {Array.isArray(rec.allocations) &&
                      rec.allocations.length > 0 ? (
                        rec.allocations.map((item: any, i: number) => (
                          <li
                            key={i}
                            className="flex justify-between items-center text-[15px] md:text-sm"
                          >
                            <span>{item.category}</span>
                            <span className="font-semibold">
                              {item.amount.toLocaleString()}원
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-red-500 text-xs">
                          추천 데이터를 불러올 수 없습니다.
                        </li>
                      )}
                    </ul>
                    <div className="mt-4 flex justify-between items-center text-xs text-gray-600">
                      <span>
                        <span className="font-semibold text-blue-700">
                          절약
                        </span>
                        : {rec.savings?.toLocaleString()}원
                      </span>
                      <span>
                        <span className="font-semibold text-blue-700">
                          절약률
                        </span>
                        : {rec.saving_ratio ?? 0}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedMonthly !== null && (
              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  className="w-40"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "저장 중..." : "이 추천안으로 예산 적용"}
                </Button>
              </div>
            )}
          </Form>
        )}
      </div>

      <BudgetSetting
        isBudgetSetting={isBudgetSetting}
        closeModal={() => setIsBudgetSetting(false)}
      />
    </div>
  );
}
