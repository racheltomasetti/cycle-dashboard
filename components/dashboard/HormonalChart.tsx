'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart as ChartJS } from 'chart.js';
ChartJS.register(annotationPlugin);

const data = [
  { day: 1, estrogen: 30, progesterone: 10 },
  { day: 7, estrogen: 80, progesterone: 15 },
  { day: 14, estrogen: 200, progesterone: 20 },
  { day: 21, estrogen: 30, progesterone: 250 },
  { day: 28, estrogen: 10, progesterone: 10 },
];

const currentDay = 14; // This could be dynamically set based on user's cycle

export function HormonalChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">cycle trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="day"
                tickFormatter={(value) => `Day ${value}`}
                stroke="hsl(var(--foreground))"
              />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line
                type="monotone"
                dataKey="estrogen"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="progesterone"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
              <ReferenceLine
                x={currentDay}
                stroke="hsl(var(--primary))"
                strokeDasharray="5 5"
                label={{
                  value: 'Current Day',
                  position: 'top',
                  fill: 'hsl(var(--primary))',
                  fontSize: 12,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))] mr-2" />
            Estrogen
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))] mr-2" />
            Progesterone
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
