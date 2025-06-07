import { Button } from "~/common/components/ui/button";
import { BudgetSetting, formSchema } from "../components/BudgetSetting";
import { useEffect, useMemo, useState } from "react";
import type { MetaFunction } from "react-router";
import {
  getBudget,
  getBudgetAllocations,
  getFixedExpenses,
  getIncomes,
} from "../queries";
import type { Route } from "./+types/budget-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedIsUserId } from "~/features/settings/queries";
import { createBudget, updateBudget } from "../mutations";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/common/components/ui/tabs";
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
  if (budget) {
    const fixedExpenses = await getFixedExpenses(client, budget.id);
    const incomes = await getIncomes(client, budget.id);
    const budgetAllocations = await getBudgetAllocations(client, budget.id);
    return {
      budget,
      fixedExpenses,
      budgetAllocations,
      incomes,
      headers,
      apiKey,
    };
  }

  return { headers };
};

export const action = async ({ request }: Route.ActionArgs) => {
  try {
    const { client } = makeSSRClient(request);
    const userId = await getLoggedIsUserId(client);
    const formData = await request.formData();
    const action = formData.get("action");

    if (action === "create") {
      const budget = await getBudget(client, userId, new Date());
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
          level: data.level,
          settingMethod: data.settingMethod,
          totalAmount: data.totalAmount,
          fixedCost: data.fixedCost,
          income: data.income,
        });
      } else {
        await createBudget(client, {
          level: data.level,
          settingMethod: data.settingMethod,
          totalAmount: data.totalAmount,
          fixedCost: data.fixedCost,
          income: data.income,
          userId,
        });
      }

      return;
    }
  } catch (error) {
    console.error("Action error:", error);
    return;
  }
};

export default function BudgetPage({ loaderData }: Route.ComponentProps) {
  const { budget, fixedExpenses, incomes, budgetAllocations, apiKey } =
    loaderData;
  const [isBudgetSetting, setIsBudgetSetting] = useState(false);
  const [selectedTab, setSelectedTab] = useState("monthly");
  const [monthlyRecommendations, setMonthlyRecommendations] = useState<any[]>(
    []
  );
  const [selectedMonthly, setSelectedMonthly] = useState<number | null>(null);
  const [weeklyRecommendations, setWeeklyRecommendations] = useState<any[]>([]);
  const [selectedWeekly, setSelectedWeekly] = useState<number | null>(null);
  const [dailyRecommendations, setDailyRecommendations] = useState<any[]>([]);
  const [selectedDaily, setSelectedDaily] = useState<number | null>(null);

  const budgetLevel = useMemo(() => {
    switch (budget?.level) {
      case "basic":
        return "초급";
      case "intermediate":
        return "중급";
      case "advanced":
        return "고급";
    }
  }, [budget?.level]);

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
    // 월별 탭이 선택될 때만 AI 호출
    if (selectedTab === "monthly") {
      (async () => {
        // 월별 예산 추천
        const monthlyResponse = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: monthlyBudgetPrompt(
            availableAmount,
            budget,
            fixedExpenses,
            selectedTab
          ), // prompt는 monthly 기준으로 생성
        });
        const monthlyRecs = extractRecommendations(
          monthlyResponse.text ?? "",
          "monthly"
        );
        setMonthlyRecommendations(monthlyRecs);
        setSelectedMonthly(null);

        // 주간 예산 추천 (월별 예산을 바탕으로 산출)
        // 예: 월별 allocations의 합을 4로 나누거나, 월별 추천의 allocations을 주간 단위로 변환
        // 여기서는 예시로, 월별 추천의 allocations을 4로 나눠서 주간 추천으로 만듦
        const weeklyRecs = monthlyRecs.map((rec: any) => ({
          ...rec,
          allocations: rec.allocations.map((item: any) => ({
            ...item,
            amount: Math.round(item.amount / 4),
          })),
          // savings, saving_ratio도 4로 나눔 (실제 로직에 맞게 조정 가능)
          savings: Math.round((rec.savings ?? 0) / 4),
          saving_ratio: rec.saving_ratio, // 비율은 동일하게 유지
        }));
        setWeeklyRecommendations(weeklyRecs);
        setSelectedWeekly(null);

        const dailyRecs = weeklyRecs.map((rec: any) => ({
          ...rec,
          allocations: rec.allocations.map((item: any) => ({
            ...item,
            amount: Math.round(item.amount / 7),
          })),
        }));
        setDailyRecommendations(dailyRecs);
        setSelectedDaily(null);
      })();
    }
  }, []);

  return (
    <>
      <Tabs defaultValue="budget-setting" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="budget-setting">예산 설정</TabsTrigger>
          <TabsTrigger
            value="monthly"
            onClick={() => setSelectedTab("monthly")}
          >
            월간 예산
          </TabsTrigger>
          <TabsTrigger value="weekly" onClick={() => setSelectedTab("weekly")}>
            주간 예산
          </TabsTrigger>
          <TabsTrigger value="daily" onClick={() => setSelectedTab("daily")}>
            일간 예산
          </TabsTrigger>
        </TabsList>

        <TabsContent value="budget-setting">
          <div className="space-y-8">
            {/* 헤더 섹션 */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">이번달 예산 현황</h1>
                <p className="text-muted-foreground mt-1">
                  {budgetSettingMethod} • {budgetLevel} 수준
                </p>
              </div>
              <Button onClick={() => setIsBudgetSetting(true)} size="lg">
                {budget ? "예산 설정 변경" : "예산 설정"}
              </Button>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 총 예산 카드 */}
              <div className="col-span-1 md:col-span-2 rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-2">총 예산</h3>
                <p className="text-3xl font-bold">
                  {budget?.total_amount.toLocaleString()}원
                </p>
              </div>

              {/* 고정 비용 카드 */}
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">고정 비용</h3>
                <div className="space-y-3">
                  {fixedExpenses?.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <span className="text-muted-foreground">
                        {expense.title}
                      </span>
                      <span className="font-medium text-red-600">
                        {expense.amount.toLocaleString()}원
                      </span>
                    </div>
                  ))}
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
                        <span className="font-medium text-green-600">
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
        </TabsContent>

        <TabsContent value="monthly">
          <div className="p-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              월별 예산 AI 추천
            </h2>
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
                    {/* 추천 라벨 */}
                    <div className="absolute -top-3 left-4 bg-white rounded-full px-2 py-1 shadow text-xs font-semibold text-blue-500 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      {rec.label}
                    </div>
                    {/* 체크 아이콘 */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-blue-500">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    )}
                    {/* 추천 제목 */}
                    <div className="mt-4 mb-1 font-bold text-base text-blue-700">
                      {rec.title}
                    </div>
                    {/* 추천 설명 */}
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
                    {/* 절약 정보 */}
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
                    {isSelected && (
                      <div className="mt-3 text-blue-600 font-medium text-xs text-center animate-pulse">
                        선택됨
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {selectedMonthly !== null && (
              <div className="mt-8 text-center">
                <Button size="lg" className="w-40">
                  이 추천안으로 예산 적용
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="weekly">
          <div className="p-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              주간 예산 AI 추천
            </h2>
            {weeklyRecommendations.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p>먼저 월별 예산 추천안 중 하나를 선택해주세요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weeklyRecommendations.map((rec, idx) => {
                  const isSelected = selectedWeekly === idx;
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
                      onClick={() => setSelectedWeekly(idx)}
                    >
                      {/* 추천 라벨 */}
                      <div className="absolute -top-3 left-4 bg-white rounded-full px-2 py-1 shadow text-xs font-semibold text-blue-500 flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        {rec.label}
                      </div>
                      {/* 체크 아이콘 */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-blue-500">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                      )}
                      {/* 추천 제목 */}
                      <div className="mt-4 mb-1 font-bold text-base text-blue-700">
                        {rec.title}
                      </div>
                      {/* 추천 설명 */}
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
                      {/* 절약 정보 */}
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
                      {isSelected && (
                        <div className="mt-3 text-blue-600 font-medium text-xs text-center animate-pulse">
                          선택됨
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {selectedWeekly !== null && (
              <div className="mt-8 text-center">
                <Button size="lg" className="w-40">
                  이 추천안으로 예산 적용
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="daily">
          <div className="p-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              일별 예산 AI 추천
            </h2>
            {dailyRecommendations.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p>먼저 월별 예산 추천안 중 하나를 선택해주세요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dailyRecommendations.map((rec, idx) => {
                  const isSelected = selectedDaily === idx;
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
                      onClick={() => setSelectedDaily(idx)}
                    >
                      {/* 날짜 라벨 */}
                      <div className="absolute -top-3 left-4 bg-white rounded-full px-2 py-1 shadow text-xs font-semibold text-blue-500 flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        {rec.dayLabel}
                      </div>
                      {/* 체크 아이콘 */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-blue-500">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                      )}
                      <ul className="space-y-1 mt-6">
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
                      {isSelected && (
                        <div className="mt-3 text-blue-600 font-medium text-xs text-center animate-pulse">
                          선택됨
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {selectedDaily !== null && (
              <div className="mt-8 text-center">
                <Button size="lg" className="w-40">
                  이 추천안으로 예산 적용
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <BudgetSetting
        isBudgetSetting={isBudgetSetting}
        closeModal={() => setIsBudgetSetting(false)}
      />
    </>
  );
}
