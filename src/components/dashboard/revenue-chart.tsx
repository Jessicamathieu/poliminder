"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { chartData } from "@/lib/data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart"

const chartConfig = {
  total: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
         <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
