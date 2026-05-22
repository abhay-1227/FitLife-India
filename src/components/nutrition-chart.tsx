'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'

interface ChartData {
  date: string
  calories: number
  goal: number
}

interface NutritionChartProps {
  data: ChartData[]
}

// Custom tooltip with glassmorphism styling
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; payload: ChartData }>
  label?: string
}) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload
  const isOverGoal = data.calories > data.goal

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className={`text-sm font-bold ${isOverGoal ? 'text-orange-400' : 'text-teal-400'}`}>
        {data.calories} kcal
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        Goal: {data.goal} kcal
      </p>
    </div>
  )
}

export default function NutritionChart({ data }: NutritionChartProps) {
  // Calculate average
  const avg =
    data.length > 0
      ? Math.round(data.reduce((sum, d) => sum + d.calories, 0) / data.length)
      : 0

  // Color each bar based on whether it's over goal
  const getBarColor = (calories: number, goal: number) => {
    if (calories > goal) return 'oklch(0.705 0.15 47)' // orange
    if (calories > goal * 0.8) return 'oklch(0.769 0.189 84.429)' // amber
    return 'oklch(0.696 0.17 162.48)' // teal
  }

  return (
    <div className="w-full" style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          barCategoryGap="20%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(1 0 0 / 6%)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: 'oklch(0.7 0 0)', fontSize: 12 }}
            axisLine={{ stroke: 'oklch(1 0 0 / 10%)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'oklch(0.7 0 0)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(1 0 0 / 4%)' }} />
          <ReferenceLine
            y={2000}
            stroke="oklch(0.769 0.189 84.429)"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: 'Goal',
              position: 'right',
              fill: 'oklch(0.769 0.189 84.429)',
              fontSize: 11,
            }}
          />
          <ReferenceLine
            y={avg}
            stroke="oklch(0.696 0.17 162.48)"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{
              value: `Avg: ${avg}`,
              position: 'right',
              fill: 'oklch(0.696 0.17 162.48)',
              fontSize: 10,
            }}
          />
          <Bar dataKey="calories" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.calories, entry.goal)}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
