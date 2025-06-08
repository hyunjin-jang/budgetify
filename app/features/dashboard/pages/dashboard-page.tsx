import { useMemo, useState } from "react";
import type { MetaFunction } from "react-router";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import Calendar from "~/common/components/calendar";
import {
  addMonths,
  format,
  subMonths,
  addDays,
  startOfMonth,
  endOfMonth,
  min,
  parseISO,
} from "date-fns";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/common/components/ui/chart";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Route } from "./+types/dashboard-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedIsUserId } from "~/features/settings/queries";
import { Button } from "~/common/components/ui/button";
import {
  getBudget,
  getBudgetMonthlyTotal,
  getBudgetYearlyTotal,
} from "~/features/budget/queries";
import {
  getExpensesByMonth,
  getExpensesByYear,
} from "~/features/expenses/queries";

export const meta: MetaFunction = () => {
  return [{ title: "머니도비 대시보드" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedIsUserId(client);
  const budget = await getBudget(client, userId, new Date());
  const budgetMonthlyTotal = await getBudgetMonthlyTotal(
    client,
    userId,
    new Date()
  );
  const budgetYearlyTotal = await getBudgetYearlyTotal(
    client,
    userId,
    new Date()
  );

  const expenses = await getExpensesByMonth(client, userId, new Date());
  const expensesByYear = await getExpensesByYear(client, userId, new Date());
  return {
    budget,
    budgetYearlyTotal,
    budgetMonthlyTotal,
    expenses,
    expensesByYear,
  };
};

const chartConfig = {
  budget: {
    label: "예산",
    color: "oklch(70.5% 0.213 47.604)",
  },
  expense: {
    label: "지출",
    color: "oklch(83.7% 0.128 66.29)",
  },
} satisfies ChartConfig;

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  const {
    budget,
    budgetMonthlyTotal,
    budgetYearlyTotal,
    expenses,
    expensesByYear,
  } = loaderData;
  const [selectedDate, setSelectedDate] = useState(new Date());

  const chartMonthData = useMemo(() => {
    const currentYear = format(selectedDate, "yyyy");
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthKey = `${currentYear}-${month.toString().padStart(2, "0")}`;

      // 해당 월의 예산 합계
      const budget = budgetYearlyTotal
        .filter((b) => b.date.startsWith(monthKey))
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);

      // 해당 월의 지출 합계
      const expense = expensesByYear
        .filter((e) => e.date.startsWith(monthKey))
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        month: `${month}월`,
        budget,
        expense,
      };
    });

    return monthlyData;
  }, [budgetYearlyTotal, expensesByYear, selectedDate]);

  const chartWeeklyData = useMemo(() => {
    const lastDayOfMonth = endOfMonth(selectedDate);
    const totalBudget = budget?.total_amount || 0;
    const daysInMonth = lastDayOfMonth.getDate();

    // 주별 구간 계산
    let weekRanges = [];
    let start = startOfMonth(selectedDate);
    while (start <= lastDayOfMonth) {
      const end = min([addDays(start, 6), lastDayOfMonth]);
      weekRanges.push([start, end]);
      start = addDays(end, 1);
    }

    let budgets: number[] = [];
    let budgetSum = 0;

    weekRanges.forEach(([weekStart, weekEnd], i) => {
      const daysInWeek = weekEnd.getDate() - weekStart.getDate() + 1;
      let weekBudget = Math.floor((daysInWeek / daysInMonth) * totalBudget);
      budgets.push(weekBudget);
      budgetSum += weekBudget;
    });
    // 마지막 주에 남은 금액 몰아주기
    budgets[budgets.length - 1] += totalBudget - budgetSum;

    const weeks = weekRanges.map(([weekStart, weekEnd], i) => {
      const expense = expenses
        .filter((e) => {
          const expenseDate = parseISO(e.date);
          return expenseDate >= weekStart && expenseDate <= weekEnd;
        })
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        day: `${i + 1}주`,
        budget: budgets[i],
        expense,
      };
    });

    return weeks;
  }, [budget, expenses, selectedDate]);

  const totalThisMonth = useMemo(() => {
    const monthKey = format(selectedDate, "yyyy-MM");
    return expenses
      .filter((expense) => expense.date.startsWith(monthKey))
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses, selectedDate]);

  const mostSpentCategory = useMemo(() => {
    const monthKey = format(selectedDate, "yyyy-MM");
    const counter: Record<string, number> = {};

    expenses
      .filter((expense) => expense.date.startsWith(monthKey))
      .forEach((expense) => {
        const categoryName = expense.category?.name || "미분류";
        counter[categoryName] = (counter[categoryName] || 0) + expense.amount;
      });

    const sorted = Object.entries(counter).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "없음";
  }, [expenses, selectedDate]);

  const spendingDays = useMemo(() => {
    const monthKey = format(selectedDate, "yyyy-MM");
    const uniqueDates = new Set(
      expenses
        .filter((expense) => expense.date.startsWith(monthKey))
        .map((expense) => expense.date)
    );
    return uniqueDates.size;
  }, [expenses, selectedDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="col-span-2 flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => setSelectedDate((prev) => subMonths(prev, 1))}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(selectedDate, "yyyy년 M월")} 요약
        </h2>
        <Button
          variant="ghost"
          onClick={() => setSelectedDate((prev) => addMonths(prev, 1))}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted rounded-xl p-4 flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">이번 달 총 지출</span>
          <span className="text-xl font-bold">
            {totalThisMonth.toLocaleString()}원
          </span>
        </div>
        <div className="bg-muted rounded-xl p-4 flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            최다 지출 카테고리
          </span>
          <span className="text-xl font-bold">{mostSpentCategory}</span>
        </div>
        <div className="bg-muted rounded-xl p-4 flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            예산 대비 잔여율
          </span>
          <span className="text-xl font-bold">
            {budget?.total_amount
              ? (
                  ((budget.total_amount - totalThisMonth) /
                    budget.total_amount) *
                  100
                ).toFixed(1)
              : "0.0"}
            %
          </span>
        </div>
        <div className="bg-muted rounded-xl p-4 flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            이번 달 지출일수
          </span>
          <span className="text-xl font-bold">{spendingDays}일</span>
        </div>
      </div>

      <div className="col-span-2 md:col-span-1">
        <h1 className="text-xl font-bold">월별 지출 현황</h1>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-2 bg-orange-500 rounded-full" />
            <p className="text-sm font-medium">예산</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-2 bg-orange-300 rounded-full" />
            <p className="text-sm font-medium">지출</p>
          </div>
        </div>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartMonthData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="col-span-2 md:col-span-1">
        <h1 className="text-xl font-bold">주별 지출 현황</h1>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-2 bg-orange-500 rounded-full" />
            <p className="text-sm font-medium">예산</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-2 bg-orange-300 rounded-full" />
            <p className="text-sm font-medium">지출</p>
          </div>
        </div>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartWeeklyData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              interval={0}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="col-span-2 flex flex-col gap-4">
        <Calendar expenses={expenses} currentDate={selectedDate} />
      </div>
    </div>
  );
}
