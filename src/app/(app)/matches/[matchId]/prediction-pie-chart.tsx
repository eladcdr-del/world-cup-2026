"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PredictionPieChartProps {
  homeWin: number;
  draw: number;
  awayWin: number;
  homeTeamName: string;
  awayTeamName: string;
}

const COLORS = ["#3b82f6", "#a1a1aa", "#ef4444"];

export default function PredictionPieChart({
  homeWin,
  draw,
  awayWin,
  homeTeamName,
  awayTeamName,
}: PredictionPieChartProps) {
  const total = homeWin + draw + awayWin;

  const data = [
    {
      name: `ניצחון ${homeTeamName}`,
      value: homeWin,
      pct: total > 0 ? Math.round((homeWin / total) * 100) : 0,
    },
    {
      name: "תיקו",
      value: draw,
      pct: total > 0 ? Math.round((draw / total) * 100) : 0,
    },
    {
      name: `ניצחון ${awayTeamName}`,
      value: awayWin,
      pct: total > 0 ? Math.round((awayWin / total) * 100) : 0,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={2}
            dataKey="value"
            label={(props) => `${Math.round((props.percent ?? 0) * 100)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${value} ניחושים`,
              name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-sm text-muted-foreground">
        סה&quot;כ {total} ניחושים
      </p>
    </div>
  );
}
