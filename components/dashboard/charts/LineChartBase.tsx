'use client';

import { ReactNode, useMemo } from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { BaseChartProps, ChartDimensions } from '@/lib/types/chart';

const defaultMargin: ChartDimensions = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5,
};

interface LineChartBaseProps<T> extends BaseChartProps<T> {
  children: ReactNode;
  xDataKey: keyof T;
}

function CustomTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
  if (!active || !payload) return null;

  return (
    <div className="bg-background border border-border rounded-lg p-2 shadow-sm">
      <p className="text-sm font-medium">Day {label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function LineChartBase<T>({
  data,
  children,
  margin = defaultMargin,
  xDataKey,
  height = '100%',
}: LineChartBaseProps<T>) {
  const xAxisProps = useMemo(
    () => ({
      dataKey: String(xDataKey),
      axisLine: true as const,
      tickLine: false as const,
      padding: { left: 10, right: 10 },
    }),
    [xDataKey]
  );

  const yAxisProps = useMemo(
    () => ({
      axisLine: true as const,
      tickLine: false as const,
      width: 30,
    }),
    []
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={margin}>
        <XAxis {...xAxisProps} />
        <YAxis {...yAxisProps} />
        <Tooltip content={<CustomTooltip />} />
        {children}
      </LineChart>
    </ResponsiveContainer>
  );
}
