'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'recharts';
import { LineChartBase } from './LineChartBase';
import { HormoneLegend } from './HormoneLegend';
import { hormonalData } from '@/lib/data/hormonal-data';
import { HormonalDataPoint } from '@/lib/types/chart';

export function HormonalChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Hormonal Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <LineChartBase<HormonalDataPoint> data={hormonalData} xDataKey="day">
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
          </LineChartBase>
        </div>
        <HormoneLegend />
      </CardContent>
    </Card>
  );
}
