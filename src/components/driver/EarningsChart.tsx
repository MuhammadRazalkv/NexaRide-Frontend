import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
import {  getDayOfWeek } from "@/utils/DateAndTimeFormatter";

type DriverEarningsChartProps = {
  chartData?: { day: string; totalEarnings: number }[];
};

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "#3B82F6",
  },
} satisfies ChartConfig;

export function DriverEarningsChart({ chartData }: DriverEarningsChartProps) {
  return (
    <Card className="bg-white text-gray-800 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Earnings (Last 7 Days)</CardTitle>
        <CardDescription>Recent revenue summary</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="#64748B"
              tickFormatter={(value) => getDayOfWeek(value)}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="totalEarnings"
              fill="#3B82F6"
              radius={[6, 6, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm text-gray-500">
        <p>Showing revenue earned in the past 7 days.</p>
      </CardFooter>
    </Card>
  );
}
