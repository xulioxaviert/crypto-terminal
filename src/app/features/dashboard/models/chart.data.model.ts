
export interface ChartDataPoint {
  readonly timestamp: number;
  readonly value: number;
}

export interface ChartSeries {
  readonly name: string;
  readonly data: number[];
}
