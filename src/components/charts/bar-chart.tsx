// bar-chart.tsx

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import CustomLegend from '@/components/charts/custom-legend'

type BarChartProps = {
  chartData: {
    [key: string]: string | number
  }[]
  chartConfig: ChartConfig
  colors: string[]
  dataKey: string
  barDataKeys: string[]
}

export default function BarChartComponent({
  chartData,
  chartConfig,
  colors,
  dataKey,
  barDataKeys = [],
}: BarChartProps) {
  return (
    <>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={dataKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {barDataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={chartConfig[key].color}
              radius={4}
            />
          ))}
        </BarChart>
      </ChartContainer>
      <CustomLegend data={Object.values(chartConfig)} colors={colors} />
    </>
  )
}
