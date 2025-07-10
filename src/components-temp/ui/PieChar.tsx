import * as React from "react";

import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// ✅ Hardcoded colors that work in both themes
const chartConfig = {
  visitors: {
    label: "Users",
  },
  premium: {
    label: "Premium Users",
    color: "#10b981", // Emerald
  },
  nonPremium: {
    label: "Non Premium Users",
    color: "#6366f1", // Blue-Violet
  },
} satisfies ChartConfig;

export function PieChartComp({
  premiumUsers,
  totalUsers,
}: {
  premiumUsers: number;
  totalUsers: number;
}) {
  const nonPremiumUsers = React.useMemo(() => {
    return Math.max(totalUsers - premiumUsers, 0);
  }, [premiumUsers, totalUsers]);

  const chartData = [
    {
      browser: "premium",
      visitors: premiumUsers,
      fill: "#A1E3F9",
    },
    {
      browser: "nonPremium",
      visitors: nonPremiumUsers,
      fill: "#4ED7F1",
    },
  ];

  return (
    <Card className=" bg-[#1A2238] text-[#E2E8F0] border-0 hover:shadow-2xl hover:shadow-indigo-950   lg:w-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle>Users</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white text-3xl font-bold"
                        >
                          {totalUsers}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-gray-400"
                        >
                          Users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
    </Card>
  );
}
