export interface MarketTrend {
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly icon: string;
  readonly lastPrice: number;
  readonly change24h: number;
  readonly marketCap: number;
  readonly volume24h: number;
  readonly sparklineData: number[];
}
