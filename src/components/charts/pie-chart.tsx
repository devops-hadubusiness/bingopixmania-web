// pie-chart.tsx

import { Pie, PieChart, Cell } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import CustomLegend from '@/components/charts/custom-legend'

type PieChartProps = {
  pieData: {
    name: string
    value: string | number
  }[]
  chartConfig: ChartConfig
  colors: string[]
}

export default function PieChartComponent({
  pieData,
  chartConfig,
  colors,
}: PieChartProps) {
  return (
    <>
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ChartContainer>
      <CustomLegend data={pieData} colors={colors} />
    </>
  )
}
