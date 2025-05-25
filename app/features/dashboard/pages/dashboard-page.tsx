import { useEffect, useMemo, useState } from "react";
import type { MetaFunction } from "react-router";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import Calendar from "~/common/components/calendar";
import { addMonths, format, subMonths } from "date-fns";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/common/components/ui/chart";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import IconButton from "~/common/components/iconButton";

export const meta: MetaFunction = () => {
  return [
    { title: "Budgetify 대시보드" },
    { name: "description", content: "Budgetify 대시보드" },
  ];
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

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const chartMonthData = [
    { month: "1월", budget: 186, expense: 80 },
    { month: "2월", budget: 305, expense: 200 },
    { month: "3월", budget: 237, expense: 120 },
    { month: "4월", budget: 73, expense: 190 },
    { month: "5월", budget: 209, expense: 130 },
    { month: "6월", budget: 214, expense: 140 },
  ];
  const chartWeeklyData = [
    { day: "1주", budget: 186, expense: 80 },
    { day: "2주", budget: 305, expense: 200 },
    { day: "3주", budget: 237, expense: 120 },
    { day: "4주", budget: 73, expense: 190 },
    { day: "5주", budget: 209, expense: 130 },
  ];
  const expensesByDate: Record<string, { category: string; amount: number }[]> =
    {
      "2025-05-22": [
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
        { category: "식비", amount: 120000 },
        { category: "교통", amount: 3000 },
      ],
      "2025-05-23": [{ category: "카페", amount: 4500 }],
    };

  const totalThisMonth = useMemo(() => {
    const monthKey = format(selectedDate, "yyyy-MM");
    const list = Object.entries(expensesByDate)
      .filter(([date]) => date.startsWith(monthKey))
      .flatMap(([_, items]) => items)
      .map((item) => item.amount);
    return list.reduce((a, b) => a + b, 0);
  }, [expensesByDate, selectedDate]);

  const mostSpentCategory = useMemo(() => {
    const monthKey = format(selectedDate, "yyyy-MM");
    const counter: Record<string, number> = {};
    Object.entries(expensesByDate)
      .filter(([date]) => date.startsWith(monthKey))
      .flatMap(([_, items]) => items)
      .forEach((e) => {
        counter[e.category] = (counter[e.category] || 0) + e.amount;
      });
    const sorted = Object.entries(counter).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || "없음";
  }, [expensesByDate, selectedDate]);

  const spendingDays = useMemo(() => {
    const monthKey = format(selectedDate, "yyyy-MM");
    return Object.keys(expensesByDate).filter((date) =>
      date.startsWith(monthKey)
    ).length;
  }, [expensesByDate, selectedDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="col-span-2 flex items-center justify-between mb-4">
        <IconButton
          onClick={() => setSelectedDate((prev) => subMonths(prev, 1))}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </IconButton>
        <h2 className="text-lg font-semibold">
          {format(selectedDate, "yyyy년 M월")} 요약
        </h2>
        <IconButton
          onClick={() => setSelectedDate((prev) => addMonths(prev, 1))}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </IconButton>
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
          <span className="text-xl font-bold">89%</span>
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
        <Calendar expensesByDate={expensesByDate} currentDate={selectedDate} />
      </div>
    </div>
  );
}
