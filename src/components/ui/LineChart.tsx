import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type LineChartProps = {
  chartData: { month: string; totalCommission: number }[];
};
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#4E71FF",
  },
} satisfies ChartConfig

export function LineChart({ chartData }: LineChartProps) {

  return (
    <Card className="bg-[#1A2238] text-[#E2E8F0] border-0 hover:shadow-2xl hover:shadow-indigo-950  lg:w-sm ">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}
         
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
               dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="#CBD5E1"
              tickFormatter={(value) => value.slice(0, 3)}
            />
          
            <ChartTooltip
              cursor={{ fill: "rgba(79, 209, 197, 0.2)" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="totalCommission"
              fill="#4E71FF"
              radius={[8, 8, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
      </CardFooter>
    </Card>
  )
}
