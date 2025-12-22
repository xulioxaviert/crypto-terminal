// src/app/features/dashboard/models/crypto.model.ts

export interface CryptoAsset {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly currentPrice: number;
  readonly priceChangePercentage24h: number;
  readonly lastUpdated: Date;
  readonly sparkline: number[]; // Para el mini-gráfico
}

export type MarketTrend = 'up' | 'down' | 'neutral';
