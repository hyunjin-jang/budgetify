import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/common/components/ui/chart";

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
  return (
    <div className="container mx-auto p-4 flex flex-col gap-8">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">월별 예산 및 지출</h1>
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

      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">주별 예산 및 지출</h1>
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

      <div>
        <h1 className="text-2xl font-bold">오늘의 사용 가능 금액</h1>
      </div>
    </div>
  );
}
