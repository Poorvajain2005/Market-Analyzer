"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useTheme } from "next-themes";

type ChartData = {
  name: string;
  value: number;
};

interface MarketRadarChartProps {
  data: ChartData[];
}

export function MarketRadarChart({ data }: MarketRadarChartProps) {
  const { theme } = useTheme();

  // Recharts uses HSL values from CSS variables
  const primaryColor = "hsl(var(--primary))";
  const foregroundColor = theme === 'dark' ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
            </linearGradient>
        </defs>
        <PolarGrid stroke={foregroundColor} strokeOpacity={0.3} />
        <PolarAngleAxis dataKey="name" tick={{ fill: foregroundColor, fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Score"
          dataKey="value"
          stroke={primaryColor}
          fill={primaryColor}
          fillOpacity={0.6}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground))",
            }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
