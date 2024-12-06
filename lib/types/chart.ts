export interface HormonalDataPoint {
  day: number;
  estrogen: number;
  progesterone: number;
}

export interface ChartDimensions {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface BaseChartProps<T> {
  data: T[];
  margin?: ChartDimensions;
  height?: number | string;
}
